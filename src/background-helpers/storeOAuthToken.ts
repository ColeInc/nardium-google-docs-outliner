import { Token } from "../models/token";
import { appendUserJWTInfo } from "./appendUserJWTInfo";
import { calculateExpiryDate } from "./calculateExpiryDate";

// store oauth response token into chrome.storage PER BROWSER TAB with tabId as key:
export const storeOAuthToken = (token: Token | undefined | null) => {
    try {
        if (typeof token === "string") {
            try {
                token = JSON.parse(token);
            } catch (error) {
                // If JSON parsing fails, just keep the original token (string)
                return;
            }
        }

        // Get current tabId:
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            const currentTabId = tabs[0].id;
            // console.log("Current Tab ID:", currentTabId);

            if (!token) {
                new Error("invalid token received at storeOAuthToken");
                return;
            }
            const enhancedToken = appendUserJWTInfo(token);
            const expiryDateTime = calculateExpiryDate(enhancedToken.expires_in);
            enhancedToken.expiry_date = JSON.stringify(expiryDateTime);

            // store token into localstorage
            chrome.storage.local.set({ [`nardium-token-${currentTabId}`]: JSON.stringify(enhancedToken) }, () => {
                // console.log(`Data saved to local storage for key >nardium-token-${currentTabId}<`, enhancedToken);
            });
        });

        return;
    } catch (error) {
        console.log("failed while processing authorization response: ", error);
        return undefined;
    }
};
