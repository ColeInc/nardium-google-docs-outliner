interface ChromeMessageRequest {
    type: string;
    token?: string;
    documentId?: string;
    startIndex?: string;
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
        if (chrome.identity && request.token) {
            // remove user's token from cache
            chrome.identity.removeCachedAuthToken({ token: request.token });
            console.log("Successfully logged out user! v1");
        }
    }
    // Fetch documentId:
    else if (request.type === "getDocumentId") {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            const url = tabs[0].url;
            const match = /\/document\/(?:u\/\d+\/)?d\/([a-zA-Z0-9-_]+)(?:\/[a-zA-Z0-9-_]+)?(?:\/edit)?/.exec(url);
            const documentId = match && match[1];
            if (!documentId) {
                sendResponse({ error: "Failed to get document ID" });
            } else {
                sendResponse({ documentId });
            }
        });
        return true;
    }
});
