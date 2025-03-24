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

        // store token into session storage
        chrome.storage.session.set({ [`nardium-access-${userEmail}`]: JSON.stringify(token) }, () => {
            // console.log(`Data saved to session storage for key >nardium-access-${userEmail}<`, token);
        });

        return;
    } catch (error) {
        console.log("failed while processing authorization response: ", error);
        return undefined;
    }
}; 