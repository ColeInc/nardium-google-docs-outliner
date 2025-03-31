import { callOAuthEndpoint } from "./background-helpers/callOAuthEndpoint";
// import { fetchNewAccessToken } from "./background-helpers/fetchNewAccessToken";
import { startAccessTokenTimer } from "./background-helpers/startAccessTokenTimer";
import { logout } from "./background-helpers/logout";
import { extractAlarmEmail } from "./background-helpers/extractAlarmEmail";
import { refreshAccessToken, nardiumAuthBackendUrl, expectedClientId } from "./background-helpers/refreshAccessToken";
import { storeAccessToken } from "./background-helpers/storeAccessToken";
import { getFEtoBEAuthToken } from "./background-helpers/getFEtoBEAuthToken";

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
                    .then(resp => {
                        try {
                            if (!resp) {
                                throw new Error("No valid auth token returned :(");
                            }
                            if (!resp.jwt_token) {
                                throw new Error("No auth token found in response");
                            }

                            // Return a promise that resolves when storage is complete
                            return new Promise<void>((resolve, reject) => {
                                chrome.storage.local.set(
                                    { [`fe-to-be-auth-token-${resp.user.email || ""}`]: resp },
                                    () => {
                                        if (chrome.runtime.lastError) {
                                            reject(chrome.runtime.lastError);
                                        } else {
                                            console.log("Frontend-Backend auth token stored successfully");
                                            resolve();
                                        }
                                    }
                                );
                            }).then(() => {
                                // Now we can safely call refreshAccessToken
                                return refreshAccessToken(resp.user.email ?? "");
                            }).then(accessTokenResponse => {
                                if (!accessTokenResponse) {
                                    throw new Error("Failed to get new access token from refresh token endpoint");
                                }

                                // Store the new access token
                                return new Promise<void>((resolve) => {
                                    storeAccessToken(accessTokenResponse, resp.user.email ?? "");
                                    if (chrome.runtime.lastError) {
                                        console.error("Error storing access token:", chrome.runtime.lastError);
                                    }
                                    resolve();
                                }).then(() => accessTokenResponse); // Pass accessTokenResponse through
                            }).then(accessTokenResponse => {
                                // Start the access token timer
                                startAccessTokenTimer(accessTokenResponse?.expires_in, resp.user.email ?? "");
                                // Send response back to frontend
                                sendResponse(accessTokenResponse);
                            });
                        } catch (error) {
                            console.log("Failed in authentication flow:", error);
                            sendResponse("Failed in authentication flow");
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
            logout(request.token, request.email ?? "").catch(e => {
                console.log("Failed to logout user", e);
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
        console.log("Starting to fetch document ID...");
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            try {
                const currentTab = tabs[0];
                if (currentTab && currentTab.url.includes("docs.google.com/document/d")) {
                    setTimeout(() => {
                        const url = tabs[0].url;
                        const match =
                            /\/document\/(?:u\/\d+\/)?d\/([a-zA-Z0-9-_]+)(?:\/[a-zA-Z0-9-_]+)?(?:\/edit)?/.exec(url);
                        const documentId = match?.[1];
                        if (!documentId) {
                            sendResponse({ error: "Failed to get document ID" });
                        } else {
                            console.log("Successfully retrieved document ID:", documentId);
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
        console.log("cole starting fetchAccessToken...")

        const fetchAccessToken = async () => {
            try {
                console.log("request.email", request.email)
                const userEmail = request.email;

                if (!userEmail) {
                    throw new Error("No email received as parameter to fetchAccessToken in background.ts!");
                }

                const token = await refreshAccessToken(userEmail);
                console.log("cole token back from refreshAccessToken at background.ts", token)

                sendResponse({ token });
            } catch (e) {
                console.warn("Failed attempt to fetch Access Token.", e);
                sendResponse(null);
            }
        };

        fetchAccessToken();
        return true;
    }
    // Get current tab ID:
    else if (request.type === "getCurrentTabId") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            sendResponse({ tabId: tabs[0]?.id ?? 0 });
        });
        return true; // Required for async response
    }
    // Check document access limit:
    else if (request.type === "checkDocumentLimit") {
        const checkDocumentAccess = async () => {
            try {
                // // Get the FEtoBEToken first
                // const FEtoBEToken = await chrome.storage.local.get(`fe-to-be-auth-token-${request.email}`);
                // if (!FEtoBEToken?.['jwt_token']) {
                //     throw new Error("No valid auth token found");
                // }

                const FEtoBEToken = await getFEtoBEAuthToken(request.email);
                if (!FEtoBEToken) {
                    console.error("[Refresh] No auth token found in storage");
                    return null;
                }

                const response = await fetch(`${nardiumAuthBackendUrl}/documents/access`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-client-id': expectedClientId,
                        'Authorization': `Bearer ${FEtoBEToken.jwt_token}`
                    }
                });

                const data = await response.json();
                sendResponse({ success: data.success });
            } catch (error) {
                console.error("Error checking document access:", error);
                sendResponse({ success: false });
            }
        };

        checkDocumentAccess();
        return true;
    }
});

// When timer goes off, fetch new access_token with refresh_token:
chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name.startsWith("accessTokenTimer-")) {
        // console.log("Timer finished! Access token has expired.");

        // extract the email out of the timer when finished and pass into this:
        const userEmail = extractAlarmEmail(alarm.name);
        // fetchNewAccessToken(userEmail);
        refreshAccessToken(userEmail);
    }
});
