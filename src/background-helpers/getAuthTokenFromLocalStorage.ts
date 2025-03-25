export const getFEtoBEAuthTokenFromLocalStorage = (userEmail: string) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(`nardium-access-${userEmail}`, resp => {
            if (chrome.runtime.lastError || Object.keys(resp).length === 0) {
                // console.log("No valid AuthToken found in localstorage.");
                reject(chrome.runtime.lastError);
            } else {
                // console.log("fetched dis authToken from localstorage:", resp);
                resolve(resp[`nardium-access-${userEmail}`]);
            }
        });
    });
};
