export const getAuthToken = (): Promise<string | null> => {
    return new Promise((resolve) => {
        chrome.storage.local.get('frontendBackendAuthToken', (result) => {
            if (chrome.runtime.lastError || !result['frontendBackendAuthToken']) {
                console.error('Failed to get auth token from storage:', chrome.runtime.lastError);
                resolve(null);
            } else {
                resolve(result['frontendBackendAuthToken']);
            }
        });
    });
}; 