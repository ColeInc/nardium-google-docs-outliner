import { callOAuthEndpoint } from "./background-helpers/callOAuthEndpoint";
import { storeOAuthToken } from "./background-helpers/storeOAuthToken";
import { storeRefreshToken } from "./background-helpers/storeRefreshToken";
import { fetchNewAccessToken } from "./background-helpers/fetchNewAccessToken";
import { appendUserJWTInfo } from "./background-helpers/appendUserJWTInfo";
import { startAccessTokenTimer } from "./background-helpers/startAccessTokenTimer";
import { logout } from "./background-helpers/logout";

const clientId = process.env["REACT_GOOGLE_CLOUD_CLIENT_ID"] ?? "";
const scopes = process.env["REACT_GOOGLE_CLOUD_SCOPES"] ?? "";

chrome.runtime.onMessage.addListener((request: ChromeMessageRequest, sender, sendResponse) => {
    // Login User:
    if (request.type === "authenticateUser") {
        if (!chrome.identity) {
            console.error("Chrome Identity API not available :(");
            sendResponse(undefined);
            return;
        }

        const interactive = request.interactive ?? true;

        const redirectURL = chrome.identity.getRedirectURL("oauth2");
        // console.log("cole redirectURL", redirectURL);

        // const manifest = chrome.runtime.getManifest();
        // console.log("cole manifest contents", manifest);
        // const clientId = encodeURIComponent(manifest?.oauth2?.client_id ?? "");
        // const scopes = encodeURIComponent(manifest?.oauth2?.scopes?.join(" ") ?? "");

        const authParams = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectURL,
            response_type: "code",
            access_type: "offline",
            scope: scopes,
        });

        const authURL = `https://accounts.google.com/o/oauth2/auth?${authParams.toString()}`;

        try {
            // chrome.identity.launchWebAuthFlow({ url: authURL, ...details }, responseURL => {
            chrome.identity.launchWebAuthFlow({ url: authURL, interactive }, responseURL => {
                // console.log("raw RESP URL", responseURL);

                // Check for errors:
                if (chrome.runtime.lastError) {
                    console.log("authenticateUser Error:", chrome.runtime.lastError.message);
                    throw new Error(chrome.runtime.lastError.message);
                }
                if (!responseURL) {
                    console.error("Failed to fetch Authentication Code from OAUTH. Please try again.");
                    throw new Error("Failed to fetch Authentication Code from OAUTH. Please try again.");
                    return;
                }

                // extract valid authorization code from end of response url:
                const url = new URL(responseURL);
                const authCode = url.searchParams.get("code");
                // console.log("FINAL Extracted code:", authCode);

                // call our google apps script middleware to send req to oauth with secret key in payload:
                callOAuthEndpoint(authCode)
                    .then(token => {
                        try {
                            // console.log("token returned to first authenticateUser fn:", token);
                            if (!token) {
                                throw new Error("No valid auth token returned :(");
                            } else {
                                token = appendUserJWTInfo(token);

                                // 1) store oauth response token into chrome.storage PER BROWSER TAB with tabId as key:
                                storeOAuthToken(token);

                                // 2) store refresh token into chrome.storage with user email as key:
                                if (!token.refresh_token) {
                                    console.warn(
                                        "No refresh token found in response. Not user's first time logging in."
                                    );
                                } else {
                                    storeRefreshToken(token.email ?? "", token.refresh_token);
                                }
                            }
                            startAccessTokenTimer(token?.expires_in);
                            // send access_token back to FE so we can store in state for subsequent HTTP requests:
                            sendResponse({ token });
                        } catch (error) {
                            console.log("Failed to login user - Stage 2 of 3 Legged Auth Flow.");
                        }
                    })
                    .catch(error => {
                        console.log("Failed to login user - Stage 2 of 3 Legged Auth Flow.", error);
                        sendResponse("Failed to login user - Stage 2 of 3 Legged Auth Flow.");
                    });
            });
        } catch (error) {
            console.log("Failed at chrome.identity.launchWebAuthFlow: \n", error);
            sendResponse(undefined);
            return;
        }
        return true;
    }
    // Logout user:
    else if (request.type === "logoutUser") {
        // console.log("Attempting to log out user...");

        if (chrome.identity && request.token) {
            logout(request.token).catch(e => {
                console.log(e);
            });
        }
    }
    // Fetch User Details:
    else if (request.type === "fetchUserDetails") {
        chrome.identity.getProfileUserInfo(userInfo => {
            if (chrome.runtime.lastError || !userInfo) {
                console.error("Failed to retrieve user info", chrome?.runtime?.lastError);
                sendResponse(undefined);
                return;
            } else {
                sendResponse(userInfo);
            }
        });
    }
    // Fetch documentId:
    else if (request.type === "getDocumentId") {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            try {
                const currentTab = tabs[0];
                if (currentTab && currentTab.url.includes("docs.google.com/document/d")) {
                    setTimeout(() => {
                        const url = tabs[0].url;
                        const match =
                            /\/document\/(?:u\/\d+\/)?d\/([a-zA-Z0-9-_]+)(?:\/[a-zA-Z0-9-_]+)?(?:\/edit)?/.exec(url);
                        const documentId = match?.[1];
                        // console.log("Document ID found:", documentId);
                        if (!documentId) {
                            sendResponse({ error: "Failed to get document ID" });
                        } else {
                            sendResponse({ documentId });
                        }
                    }, 300);
                }
            } catch (error) {
                console.log("getDocumentId Error:", error);
            }
        });
        return true;
    }
    // SET - Store the passed payload under the passed key in Local Storage (Store User's Heading Lvl or Current Zoom Setting in Local Storage):
    else if (request.type === "setLocalStorage") {
        const { key, payload } = request;
        // If key or payload is missing, send an error message back
        if (!key || !payload) {
            sendResponse({ type: "error", message: "Invalid parameters" });
            return;
        }

        chrome.storage.local.set({ [key]: payload }, () => {
            // console.log(`Data saved to local storage for key >${key}<`);
        });
    }
    // GET - Check Localstorage for anything stored under key parameter. (Store the passed payload under the passed key in Local Storage (Fetch User's Heading Lvl or Zoom lvl from Local Storage):
    else if (request.type === "getLocalStorage") {
        // console.log("fetching localStorage for this key...", request.key);
        if (!request.key) {
            sendResponse({ error: "Invalid key passed to fetch from Localstorage." });
            return;
        }

        chrome.storage.local.get(request.key, result => {
            const data = result[request.key as string];
            if (data) {
                // console.log("Data retrieved from local storage:", data);
                sendResponse({ data });
            } else {
                console.log("Unable to find item in local storage for", request.key);
                sendResponse({ error: "Item not found" });
            }
        });
        return true;
    }
    // Fetch valid access_token and return back to user:
    else if (request.type === "fetchAccessToken") {
        const fetchAccessToken = async () => {
            try {
                const newToken = await fetchNewAccessToken();
                sendResponse({ token: newToken });
            } catch (e) {
                console.log("fetchAccessToken Error", e);
                sendResponse(null);
            }
        };

        fetchAccessToken();
        return true;
    }
});

// When timer goes off, fetch new access_token with refresh_token:
chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === "accessTokenTimer") {
        // console.log("Timer finished! Access token has expired.");
        fetchNewAccessToken();
    }
});
