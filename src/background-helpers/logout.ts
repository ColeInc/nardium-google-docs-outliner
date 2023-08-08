import { removeAccessTokensFromLocalStorage } from "./removeAccessTokensFromLocalStorage";

export const logout = async (token: string | undefined) => {
    if (token) {
        // remove user's token from cache
        await chrome.identity.removeCachedAuthToken({ token });
    }

    // Clear all cached auth tokens.
    await chrome.identity.clearAllCachedAuthTokens();

    // Clear localstorage of any JWT tokens stored:
    removeAccessTokensFromLocalStorage();

    // console.log("Successfully logged out user!");
};
