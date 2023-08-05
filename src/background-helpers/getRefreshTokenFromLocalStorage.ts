export function getRefreshTokenFromLocalStorage(userEmail: string) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(`nardium-refresh-${userEmail}`, resp => {
            // console.log("fetched this refreshToken from localstorage:", resp);
            resolve(resp[`nardium-refresh-${userEmail}`]);
        });
    });
}
