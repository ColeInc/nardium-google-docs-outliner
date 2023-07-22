import { send } from "process";
import { setTimeout } from "timers";

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
}

// const callOAuthEndpoint = async (authCode: string | null): Promise<string | null> => {
//     if (!authCode) return Promise.reject(null);

//     fetch(googleAppScriptUrl, {
//         method: "GET",
//         // headers: new Headers({ Authorization: "Bearer " + token }),
//     })
//         .then(res => {
//             console.log("resp raw", res);
//             return res.json();
//         })
//         .then(contents => {
//             console.log("resp response", contents);
//             return contents;
//         })
//         .catch(error => {
//             console.log("Error while fetching nardium auth:", error);
//             return null;
//         });
//     return Promise.reject(null);
// };

const callOAuthEndpoint = async (authCode: string | null): Promise<string | null> => {
    // if (!authCode) return Promise.reject(null);
    if (!authCode) return null;

    const url = googleAppScriptUrl + "?code=" + authCode;

    try {
        const response = await fetch(url, {
            method: "GET",
            // headers: new Headers({ Authorization: "Bearer " + token }),
        });

        if (!response.ok) {
            console.log("Error while fetching nardium auth:", response.status, response.statusText);
            return null;
        }

        const content = await response.text(); // Use response.text() to get the response content as a plain text string
        console.log("access_token response", content);
        return content;
    } catch (error) {
        console.log("Error while fetching nardium auth:", error);
        return null;
    }
};

chrome.runtime.onMessage.addListener((request: ChromeMessageRequest, sender, sendResponse) => {
    // Login User:
    if (request.type === "getAuthToken") {
        // //     const trigAuthFlow = async () => {
        // //         console.log("starting background.js --> getAuthToken");

        // //         await setTimeout(() => {
        // //             sendResponse({ token: "C63333" });
        // //             console.log("Successfully trigAuthFlow!");
        // //         }, 3000);
        // //     };

        // //     if (chrome.identity) {
        // //         trigAuthFlow().catch(e => {
        // //             console.log(e);
        // //         });
        // //     }
        // //     return true;

        if (!chrome.identity) {
            console.error("Chrome Identity API not available :(");
            sendResponse(undefined);
            return;
        }

        // // chrome.identity.getAuthToken({ interactive: true }, token => {
        // //     if (chrome.runtime.lastError || !token) {
        // //         console.log(`SSO ended with an error: ${JSON.stringify(chrome.runtime.lastError)}`);
        // //         sendResponse(undefined);
        // //         return;
        // //     }
        // //     sendResponse({ token: token });
        // // });
        // // return true;

        // let authURL = "https://accounts.google.com/o/oauth2/v2/auth";
        const redirectURL = chrome.identity.getRedirectURL("oauth2");
        console.log("cole redirectURL", redirectURL);
        // const auth_params = {
        //     client_id: clientId,
        //     redirect_uri: redirectURL,
        //     response_type: "code",
        //     access_type: "offline",
        //     scope: "https://www.googleapis.com/auth/spreadsheets",
        // };

        const authParams = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectURL,
            response_type: "code",
            access_type: "offline",
            scope: scopes,
        });
        // scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/documents"].join(
        //     " "
        // ),
        const authURL = `https://accounts.google.com/o/oauth2/auth?${authParams.toString()}`;
        console.log("final authURL", authURL);

        chrome.identity.launchWebAuthFlow({ url: authURL, interactive: true }, responseURL => {
            console.log("raw RESP URL", responseURL);

            if (!responseURL) {
                console.error("Failed to fetch Authentication Code from OAUTH. Please try again.");
                sendResponse(undefined);
                return;
            }

            const url = new URL(responseURL);
            const authCode = url.searchParams.get("code");
            console.log("FINAL Extracted code:", authCode);
            // sendResponse({ token: code });

            // try {
            //     const token = callOAuthEndpoint(authCode);
            //     console.log("token returned to first getAuthToken fn:", token);
            //     // sendResponse({ token: code });
            // } catch (error) {
            //     console.log(error);
            //     sendResponse("Failed to login user - Stage 2 of 3 Legged Auth Flow.");
            // }
            callOAuthEndpoint(authCode)
                .then(token => {
                    console.log("token returned to first getAuthToken fn:", token);
                    sendResponse({ token });
                })
                .catch(error => {
                    console.log(error);
                    sendResponse("Failed to login user - Stage 2 of 3 Legged Auth Flow.");
                });
        });
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
    // Check if user is logged in:
    else if (request.type === "isLoggedIn") {
        if (!chrome.identity) {
            console.error("Chrome Identity API not available :(");
            sendResponse(undefined);
            return;
        }

        // interactive=false allows checking the login status without showing any authentication prompts.
        chrome.identity.getAuthToken({ interactive: false }, token => {
            if (chrome.runtime.lastError || !token) {
                console.log("Unable to login user.");
                sendResponse(undefined);
                return;
            } else {
                sendResponse({ token: token });
            }
        });
        return true;
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
