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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "getAuthToken") {
        if (!chrome.identity) {
            console.error("Chrome Identity API not available.");
            return;
        }

        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            if (chrome.runtime.lastError || !token) {
                alert(`SSO ended with an error: ${JSON.stringify(chrome.runtime.lastError)}`);
                return;
            }

            console.log("fetched token! -->", token);

            // Fetch the user's email using the Google Identity API
            fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + token)
                .then(response => response.json())
                .then(data => console.log("user signin info:", data))
                .catch(error => console.error(error));

            // this is what we return back to content.js so far:
            sendResponse({ token: token });
        });
        return true;
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
