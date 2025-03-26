import { removeAccessTokenFromSessionStorage } from "./removeAccessTokenFromSessionStorage";
import { removeFromLocalStorage } from "./removeFromLocalStorage";

export const logout = async (token: string | undefined, userEmail: string) => {
    if (token) {
        // remove user's token from cache
        await chrome.identity.removeCachedAuthToken({ token });
    }

    // Clear all cached auth tokens.
    await chrome.identity.clearAllCachedAuthTokens();

    removeAccessTokenFromSessionStorage(userEmail ?? "");
    // Clear localstorage of any JWT tokens stored:
    removeFromLocalStorage("fe-to-be-auth-token-");

    // console.log("Successfully logged out user!");
};
