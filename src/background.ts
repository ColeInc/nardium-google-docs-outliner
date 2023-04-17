import { gapi, loadAuth2 } from "gapi-script";

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

chrome.runtime.onInstalled.addListener(() => {
    const clientId = process.env.REACT_CLIENT_ID || "";
    const scopes = "https://www.googleapis.com/auth/documents";
    const apiKey = process.env.REACT_API_KEY || "";

    // Load the gapi library
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
        if (navigator.cookieEnabled) {
            try {
                const start = () => {
                    gapi.client.init({ apiKey, clientId, scope: scopes });
                };
                gapi.load("client:auth2", start);
            } catch (e) {
                console.log("error logging in boi:\n", e);
            }
            // setThirdPartyCookiesEnabled(false);
        } else {
            // setThirdPartyCookiesEnabled(true);
            console.error("Cookies are not enabled in the current environment.");
            alert("please enable 3rd party cookies!");
        }
    };
    document.body.appendChild(script);
});
