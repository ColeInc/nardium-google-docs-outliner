import { Token } from "../models/token";
import { appendUserJWTInfo } from "./appendUserJWTInfo";
import { calculateExpiryDate } from "./calculateExpiryDate";

// store oauth response token into chrome.storage using userEmail as key:
export const storeOAuthToken = (token: Token | undefined | null, userEmail: string) => {
    try {
        if (typeof token === "string") {
            try {
                token = JSON.parse(token);
            } catch (error) {
                // If JSON parsing fails, just keep the original token (string)
                return;
            }
        }

        if (!token) {
            new Error("invalid token received at storeOAuthToken");
            return;
        }

        const enhancedToken = appendUserJWTInfo(token);
        const expiryDateTime = calculateExpiryDate(enhancedToken.expires_in);
        enhancedToken.expiry_date = JSON.stringify(expiryDateTime);

        // store token into localstorage
        chrome.storage.local.set({ [`nardium-access-${userEmail}`]: JSON.stringify(enhancedToken) }, () => {
            // console.log(`Data saved to local storage for key >nardium-access-${userEmail}<`, enhancedToken);
        });

        return;
    } catch (error) {
        console.log("failed while processing authorization response: ", error);
        return undefined;
    }
};
