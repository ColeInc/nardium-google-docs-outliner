import { FEtoBETokenResponse } from "../models";

export const getFEtoBEAuthToken = (userEmail: string = ""): Promise<FEtoBETokenResponse | null> => {
    const storageKey = userEmail ? `fe-to-be-auth-token-${userEmail}` : 'fe-to-be-auth-token';
    
    return new Promise((resolve) => {
        chrome.storage.local.get(storageKey, (result) => {
            if (chrome.runtime.lastError || !result[storageKey]) {
                console.error('Failed to get auth token from storage:', chrome.runtime.lastError);
                resolve(null);
            } else {
                try {
                    console.log('Retrieving token data from storage:', storageKey);
                    console.log("fetched token data:", result[storageKey]);
                    // const tokenData =  JSON.parse(result[storageKey]);
                    // console.log("parsed token data:", tokenData);
                    // const tokenData = result[storageKey];
                    
                    // console.log('Token validation successful');
                    resolve(result[storageKey] as FEtoBETokenResponse);
                } catch (error) {
                    console.error('Failed to parse auth token:', error);
                    resolve(null);
                }
            }
        });
    });
}; 