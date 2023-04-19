// import { gapi } from "gapi-script";

// console.log("Background script loaded");

// // Initialize the Google API client
// loadAuth2().then(() => {
//     console.log("Google API client initialized");
// });

// // Add event listener for the extension button
// chrome.action.onClicked.addListener(tab => {
//     console.log("Extension button clicked", tab);
// });

// chrome.runtime.onInstalled.addListener(() => {
//     // Load the gapi library
//     const script = document.createElement("script");
//     script.src = "https://apis.google.com/js/api.js";
//     script.onload = () => {
//         // Initialize the gapi client
//         gapi.load("client:auth2", () => {
//             gapi.client.init({
//                 apiKey: "YOUR_API_KEY",
//                 clientId: "YOUR_CLIENT_ID",
//                 discoveryDocs: ["https://docs.googleapis.com/$discovery/rest?version=v1"],
//                 scope: "https://www.googleapis.com/auth/documents",
//             });
//         });
//     };
//     document.body.appendChild(script);
// });
// let window = self;

// chrome.runtime.onInstalled.addListener(() => {
//     const clientId = process.env.REACT_CLIENT_ID || "";
//     const scopes = "https://www.googleapis.com/auth/documents";
//     const apiKey = process.env.REACT_API_KEY || "";

//     // Load the gapi library
//     const script = document.createElement("script");
//     script.src = "https://apis.google.com/js/api.js";
//     script.onload = () => {
//         if (navigator.cookieEnabled) {
//             try {
//                 const start = () => {
//                     gapi.client.init({ apiKey, clientId, scope: scopes });
//                 };
//                 gapi.load("client:auth2", start);
//             } catch (e) {
//                 console.log("error logging in boi:\n", e);
//             }
//             // setThirdPartyCookiesEnabled(false);
//         } else {
//             // setThirdPartyCookiesEnabled(true);
//             console.error("Cookies are not enabled in the current environment.");
//             alert("please enable 3rd party cookies!");
//         }
//     };
//     document.body.appendChild(script);
// });

interface ChromeMessageRequest {
    type: string;
    token?: string;
    documentId?: string;
    startIndex?: string;
}

chrome.runtime.onMessage.addListener(function (request: ChromeMessageRequest, sender, sendResponse) {
    // Login User:
    if (request.type === "getAuthToken") {
        if (!chrome.identity) {
            console.error("Chrome Identity API not available :(");
            return;
        }

        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            if (chrome.runtime.lastError || !token) {
                alert(`SSO ended with an error: ${JSON.stringify(chrome.runtime.lastError)}`);
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
            let url = tabs[0].url;
            console.log("url");
            const match = /\/document\/d\/([a-zA-Z0-9-_]+)/.exec(url);
            console.log("match 1", match);
            const documentId = match && match[1];
            return documentId;
        });
    }
    // Update Cursor Position:
    else if (request.type === "updateCursor") {
        if (request.token && request.documentId && request.startIndex) {
            fetch(`https://docs.googleapis.com/v1/documents/${request.documentId}:batchUpdate`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${request.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    requests: [
                        {
                            updateCursor: {
                                location: {
                                    index: request.startIndex,
                                },
                            },
                        },
                    ],
                }),
            }).catch(error => console.error(error));
        } else {
            console.log("Invalid token, documentId or startIndex provided.");
            sendResponse({ message: "Invalid token, documentId or startIndex provided." });
        }
    }
});

// chrome.identity.getAuthToken({ interactive: true }, token => {
//     if (chrome.runtime.lastError || !token) {
//         alert(`SSO ended with an error: ${JSON.stringify(chrome.runtime.lastError)}`);
//         return;
//     }

//     console.log("fetched token! -->", token);

//     // Fetch the user's email using the Google Identity API
//     fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + token)
//         .then(response => response.json())
//         .then(data => console.log("user signin info:", data))
//         .catch(error => console.error(error));
// });
