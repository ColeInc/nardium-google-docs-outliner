
export const removeAccessTokenFromSessionStorage = async (userEmail: string): Promise<void> => {
    console.log(`Starting to remove access token from session storage for user: ${userEmail}`);
    return new Promise((resolve, reject) => {
        const storageKey = `nardium-access-${userEmail}`;
        chrome.storage.session.remove(storageKey, () => {
            if (chrome.runtime.lastError) {
                console.log(`Failed to remove access token from session storage for key: ${storageKey}`);
                reject(chrome.runtime.lastError);
            } else {
                console.log(`Successfully removed access token from session storage for key: ${storageKey}`);
                resolve();
            }
        });
    });
}; 