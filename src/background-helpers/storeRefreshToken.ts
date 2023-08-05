export const storeRefreshToken = (userEmail: string, refreshToken: string) => {
    try {
        if (userEmail.length > 0 && refreshToken.length > 0) {
            chrome.storage.local.set({ [`nardium-refresh-${userEmail}`]: refreshToken }, () => {
                console.log(`Data saved to local storage for key >nardium-refresh-${userEmail}<`);
            });
        } else {
            throw new Error("Invalid user email or refresh_token provided to storeRefreshToken function.");
        }
    } catch (error) {
        console.log("Failed to store refresh token into localstorage: ", error);
    }
};
