import { setTimeout } from "timers";

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

chrome.runtime.onMessage.addListener((request: ChromeMessageRequest, sender, sendResponse) => {
    // Login User:
    if (request.type === "getAuthToken") {
        if (!chrome.identity) {
            console.error("Chrome Identity API not available :(");
            sendResponse(undefined);
            return;
        }

        chrome.identity.getAuthToken({ interactive: true }, token => {
            if (chrome.runtime.lastError || !token) {
                console.log(`SSO ended with an error: ${JSON.stringify(chrome.runtime.lastError)}`);
                sendResponse(undefined);
                return;
            }
            sendResponse({ token: token });
        });
        return true;
    }
    // Logout user:
    else if (request.type === "logoutUser") {
        console.log("trying to log out user...");

        const logout = async (token: string) => {
            // // // // remove user's token from cache
            // // // chrome.identity.removeCachedAuthToken({ token: request.token });

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
            console.log("isLoggedIn repsonse", token);
            if (chrome.runtime.lastError || !token) {
                console.log("User is not logged in");
                sendResponse(undefined);
                return;
            } else {
                console.log("User is logged in");
                sendResponse({ token: token });
            }
        });
        return true;
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
                    // console.log("DOCUMENT ID FOUND:", documentId);
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
            console.log(`Data saved to local storage for key >${key}<`);
        });
    }
    // GET - Check Localstorage for anything stored under key parameter. (Store the passed payload under the passed key in Local Storage (Fetch User's Heading Lvl or Zoom lvl from Local Storage):
    else if (request.type === "getLocalStorage") {
        console.log("fetching localStorage for this key...", request.key);
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
