import { Token } from "../models/token";

export const storeAccessToken = (token: Token | undefined | null, userEmail: string) => {
    try {
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
        const tokenValue = JSON.stringify(token.access_token);
        
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