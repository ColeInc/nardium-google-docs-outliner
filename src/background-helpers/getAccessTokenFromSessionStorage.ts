import { Token } from "../models/token";

export const getAccessTokenFromSessionStorage = async (userEmail: string): Promise<Token> => {
    console.log(`Starting to fetch access token from session storage for user: ${userEmail}`);
    return new Promise((resolve, reject) => {
        const storageKey = `nardium-access-${userEmail}`;
        chrome.storage.session.get(storageKey, resp => {
            if (chrome.runtime.lastError || Object.keys(resp).length === 0) {
                console.log(`Failed to fetch access token from session storage for key: ${storageKey}`);
                reject(chrome.runtime.lastError);
            } else {
                // Parse the token from string to object since it's stored as a stringified JSON
                let token: Token;
                try {
                    token = JSON.parse(resp[storageKey]);
                    console.log(`Successfully fetched access token from session storage for key: ${storageKey}`, {
                        key: storageKey,
                        token
                    });
                    resolve(token);
                } catch (error) {
                    console.log(`Error parsing token from session storage for key: ${storageKey}`, error);
                    reject(error);
                }
            }
        });
    });
};
