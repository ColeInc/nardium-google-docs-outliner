import { AccessToken } from "../models";

// store oauth response token into chrome.storage using userEmail as key:
export const storeOAuthToken = (token: AccessToken | undefined | null, userEmail: string) => {
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

        // const enhancedToken = appendUserJWTInfo(token);
        // const expiryDateTime = calculateExpiryDate(enhancedToken.expires_in);
        // const expiryDateTime = calculateExpiryDate(token);
        // enhancedToken.expiry_date = JSON.stringify(expiryDateTime);

        // store token into localstorage
        chrome.storage.local.set({ [`nardium-access-${userEmail}`]: JSON.stringify(token) }, () => {
            // console.log(`Data saved to local storage for key >nardium-access-${userEmail}<`, enhancedToken);
        });

        return;
    } catch (error) {
        console.log("failed while processing authorization response: ", error);
        return undefined;
    }
};
