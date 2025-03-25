export const getAuthToken = (): Promise<string | null> => {
    return new Promise((resolve) => {
        chrome.storage.local.get('fe-to-be-auth-token', (result) => {
            if (chrome.runtime.lastError || !result['fe-to-be-auth-token']) {
                console.error('Failed to get auth token from storage:', chrome.runtime.lastError);
                resolve(null);
            } else {
                resolve(result['fe-to-be-auth-token']);
            }
        });
    });
}; 