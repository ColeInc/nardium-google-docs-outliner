export const removeFromLocalStorage = (keyPrefix: string) => {
    console.log(`Searching for keys with prefix: ${keyPrefix}`);
    chrome.storage.local.get(null, result => {
        const tokensToRemove = Object.keys(result).filter(key => key.startsWith(keyPrefix));
        
        tokensToRemove.forEach(token => {
            console.log(`Found token to remove: ${token}`);
        });

        // It is fine to remove all "tokens" we find in localstorage globally, bc even if user is logged into different account in another tab their refresh token for that acc will stay there, so when user goes back to that tab it will fallback to using that refresh token to go out and fetch access token for user.
        tokensToRemove &&
            chrome.storage.local.remove(tokensToRemove, () => {
                console.log(`Removed ${tokensToRemove.length} ${keyPrefix} tokens from local storage.`);
                tokensToRemove.forEach(token => {
                    console.log(`Deleted token: ${token}`);
                });
            });
    });
};
