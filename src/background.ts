import { send } from "process";
import { setTimeout } from "timers";
import { Token } from "./components/Login";

const clientId = process.env["REACT_GOOGLE_CLOUD_CLIENT_ID"] ?? "";
const scopes = process.env["REACT_GOOGLE_CLOUD_SCOPES"] ?? "";
const googleAppScriptUrl = process.env["REACT_GOOGLE_APP_SCRIPT_URL"] ?? "";

interface ChromeMessageRequest {
    type: string;
    token?: string;
    documentId?: string;
    startIndex?: string;
    key?: string;
    payload?: {
        [key: string]: number;
    };
    interactive?: boolean;
}

const callOAuthEndpoint = async (authCode: string | null): Promise<string | null> => {
    if (!authCode) return null;

    const url = googleAppScriptUrl + "?code=" + encodeURIComponent(authCode) + "&type=authenticateUser";

    try {
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            console.log("Error while fetching nardium auth:", response.status, response.statusText);
            return null;
        }
        console.log("callOAuthEndpoint RAW", response);

        // const content = await response.text();
        // console.log("access_token response", content);
        // return content;
        const responseData = await response.json();
        console.log("resp response", responseData);
        // const { access_token, expires_in, refresh_token, scope, token_type, id_token } = responseData;
        return responseData;
    } catch (error) {
        console.log("Error while fetching nardium auth:", error);
        return null;
    }
};

// store oauth response token into chrome.storage PER BROWSER TAB with tabId as key:
const storeOAuthToken = (token: Token): string | undefined => {
    try {
        // const { access_token, id_token, refresh_token, expires_in, scope, token_type } = token;
        const { id_token } = token;

        // const idToken = token.id_token;
        const payloadBase64 = id_token?.split(".")[1];
        if (!payloadBase64) {
            new Error("failed to process extract JWT token");
            return undefined;
        }
        const payloadJsonString = Buffer.from(payloadBase64, "base64").toString("utf-8");
        console.log("payloadJsonString", payloadJsonString);

        // Step 2: Parse the decoded payload to access its properties
        const decodedPayload = JSON.parse(payloadJsonString);
        console.log("decodedPayload", decodedPayload);
        const email = decodedPayload.email ?? "";
        console.log("Decoded email:", email);

        // get current tabId:
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            const currentTabId = tabs[0].id;
            console.log("Current Tab ID:", currentTabId);

            // store token into localstorage
            chrome.storage.local.set({ [`nardium-${currentTabId}`]: JSON.stringify(token) }, () => {
                console.log(`Data saved to local storage for key >nardium-${currentTabId}<`);
            });
        });

        return email;
    } catch (error) {
        console.log("failed while processing authorization response: ", error);
        return undefined;
    }
};

const storeRefreshToken = (userEmail: string, refreshToken: string) => {
    try {
        if (userEmail.length > 0 && refreshToken.length > 0) {
            chrome.storage.local.set({ [`nardium-${userEmail}`]: refreshToken }, () => {
                console.log(`Data saved to local storage for key >nardium-${userEmail}<`);
            });
        } else {
            new Error("Invalid user email or refresh_token provided to storeRefreshToken function.");
        }
    } catch (error) {
        console.log("Failed to store refresh token into localstorage: ", error);
    }
};

chrome.runtime.onMessage.addListener((request: ChromeMessageRequest, sender, sendResponse) => {
    // Login User:
    if (request.type === "authenticateUser") {
        if (!chrome.identity) {
            console.error("Chrome Identity API not available :(");
            sendResponse(undefined);
            return;
        }

        const interactive = request.interactive ?? true;
        console.log("running authenticateUser W/ interactive ===", interactive);

        // let details = {};
        // if (request.interactive) {
        //     details = {
        //         interactive: true,
        //     };
        // } else {
        //     details = {
        //         interactive: false,
        //         // abortOnLoadForNonInteractive: true,
        //         // abortOnLoadForNonInteractive: false,
        //         // timeoutMsForNonInteractive: 30000,
        //     };
        // }

        // // chrome.identity.authenticateUser({ interactive: true }, token => {
        // //     if (chrome.runtime.lastError || !token) {
        // //         console.log(`SSO ended with an error: ${JSON.stringify(chrome.runtime.lastError)}`);
        // //         sendResponse(undefined);
        // //         return;
        // //     }
        // //     sendResponse({ token: token });
        // // });
        // // return true;

        const redirectURL = chrome.identity.getRedirectURL("oauth2");
        console.log("cole redirectURL", redirectURL);
        const manifest = chrome.runtime.getManifest();
        console.log("cole manifest contents", manifest);
        // const clientId = encodeURIComponent(manifest.oauth2.client_id);
        // const scopes = encodeURIComponent(manifest.oauth2.scopes.join(" "));

        const authParams = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectURL,
            response_type: "code",
            access_type: "offline",
            scope: scopes,
        });

        const authURL = `https://accounts.google.com/o/oauth2/auth?${authParams.toString()}`;

        // console.log("final details being used", JSON.stringify({ url: authURL, ...details }));
        console.log("final details being used", JSON.stringify({ url: authURL }));

        try {
            // chrome.identity.launchWebAuthFlow({ url: authURL, ...details }, responseURL => {
            chrome.identity.launchWebAuthFlow({ url: authURL }, responseURL => {
                console.log("raw RESP URL", responseURL);

                // Check for errors:
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                    new Error(chrome.runtime.lastError.message);
                }
                if (!responseURL) {
                    console.error("Failed to fetch Authentication Code from OAUTH. Please try again.");
                    new Error("Failed to fetch Authentication Code from OAUTH. Please try again.");
                    return;
                }

                // extract valid authorization code from end of response url:
                const url = new URL(responseURL);
                const authCode = url.searchParams.get("code");
                console.log("FINAL Extracted code:", authCode);

                // call our google apps script middleware to send req to oauth with secret key in payload:
                callOAuthEndpoint(authCode)
                    .then(response => {
                        try {
                            console.log("token returned to first authenticateUser fn:", response);
                            // store oauth response into chrome.storage:
                            const token = JSON.parse(response ?? "");

                            if (!token.refresh_token) {
                                console.warn("No refresh token found in response. Not user's first time logging in.");
                            } else {
                                // 1) store oauth response token into chrome.storage PER BROWSER TAB with tabId as key:
                                const userEmail = storeOAuthToken(token);
                                console.log("val returned from storeOAuthToken", userEmail);

                                // 2) store refresh token into chrome.storage with user email as key:
                                storeRefreshToken(userEmail ?? "", token.refresh_token);

                                // Get the user's email address.
                                // const tokenObject = chrome.identity.getAuthToken(tokenInfo.id_token);
                                // const emailAddress = (tokenObject as any).email;
                                // Print the user's email address.
                                // console.log("email", emailAddress);

                                // sendResponse({ token: { ...tokenInfo, email: emailAddress } });
                            }
                            // send access_token back to FE so we can store in state for subsequent HTTP requests:

                            sendResponse({ token });
                        } catch (error) {
                            new Error("Failed to login user - Stage 2 of 3 Legged Auth Flow.");
                        }
                    })
                    .catch(error => {
                        console.log(error);
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
        console.log("Attempting to log out user...");

        const logout = async (token: string) => {
            // remove user's token from cache
            await chrome.identity.removeCachedAuthToken({ token });

            // Clear all cached auth tokens.
            await chrome.identity.clearAllCachedAuthTokens();

            console.log("Successfully logged out user!");
        };

        if (chrome.identity && request.token) {
            logout(request.token).catch(e => {
                console.log(e);
            });
        }
    }
    // // Check if user is logged in:
    // else if (request.type === "isLoggedIn") {
    //     if (!chrome.identity) {
    //         console.error("Chrome Identity API not available :(");
    //         sendResponse(undefined);
    //         return;
    //     }

    //     // interactive=false allows checking the login status without showing any authentication prompts.
    //     chrome.identity.authenticateUser({ interactive: false }, token => {
    //         if (chrome.runtime.lastError || !token) {
    //             console.log("Unable to login user.");
    //             sendResponse(undefined);
    //             return;
    //         } else {
    //             sendResponse({ token: token });
    //         }
    //     });
    //     return true;
    // }
    // // // // Check if user is logged in:
    // // // else if (request.type === "renewAccessToken") {
    // // //     // if (!chrome.identity) {
    // // //     //     console.error("Chrome Identity API not available :(");
    // // //     //     sendResponse(undefined);
    // // //     //     return;
    // // //     // }

    // // //     // // interactive=false allows checking the login status without showing any authentication prompts.
    // // //     // chrome.identity.authenticateUser({ interactive: false }, token => {
    // // //     //     if (chrome.runtime.lastError || !token) {
    // // //     //         console.log("Unable to login user.");
    // // //     //         sendResponse(undefined);
    // // //     //         return;
    // // //     //     } else {
    // // //     //         sendResponse({ token: token });
    // // //     //     }
    // // //     // });
    // // //     // return true;
    // // //     if (!chrome.identity) {
    // // //         console.error("Chrome Identity API not available :(");
    // // //         sendResponse(undefined);
    // // //         return;
    // // //     }

    // // //     // interactive=false allows checking the login status without showing any authentication prompts.
    // // //     chrome.identity.launchWebAuthFlow({ interactive: false }, token => {
    // // //         if (chrome.runtime.lastError || !token) {
    // // //             console.log("Unable to login user.");
    // // //             sendResponse(undefined);
    // // //             return;
    // // //         } else {
    // // //             sendResponse({ token: token });
    // // //         }
    // // //     });
    // // //     return true;
    // // // }
    // Fetch User Details:
    else if (request.type === "fetchUserDetails") {
        console.log("cole gets here 3");
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
                setTimeout(() => {
                    const url = tabs[0].url;
                    const match = /\/document\/(?:u\/\d+\/)?d\/([a-zA-Z0-9-_]+)(?:\/[a-zA-Z0-9-_]+)?(?:\/edit)?/.exec(
                        url
                    );
                    const documentId = match?.[1];
                    // console.log("Document ID found:", documentId);
                    if (!documentId) {
                        sendResponse({ error: "Failed to get document ID" });
                    } else {
                        sendResponse({ documentId });
                    }
                }, 300);
            } catch (error) {
                console.log(error);
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
                console.log("Data retrieved from local storage:", data);
                sendResponse({ data });
            } else {
                console.log("Unable to find item in local storage for", request.key);
                sendResponse({ error: "Item not found" });
            }
        });
        return true;
    }
});
