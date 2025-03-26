import { AccessToken } from "../models";

export const storeAccessToken = (token: AccessToken | undefined | null, userEmail: string) => {
    try {
        console.log("Storing access token...");
        if (typeof token === "string") {
            try {
                token = JSON.parse(token);
            } catch (error) {
                return;
            }
        }

        if (!token) {
            new Error("invalid token received at storeAccessToken");
            return;
        }

        const storageKey = `nardium-access-${userEmail}`;
        const tokenValue = JSON.stringify(token);
        
        // store token into session storage
        chrome.storage.session.set({ [storageKey]: tokenValue }, () => {
            console.log(`Successfully stored access token in session storage with key: ${storageKey}`, {
                key: storageKey,
                tokenLength: token?.access_token?.length
            });
        });

        return;
    } catch (error) {
        console.log("failed while processing authorization response: ", error);
        return undefined;
    }
}; 