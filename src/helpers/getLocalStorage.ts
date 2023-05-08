export const getLocalStorage = (key: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            {
                type: "getLocalStorage",
                key,
            },
            response => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    // console.log("response from getLocalStorage: ", response);
                    resolve(response);
                }
            }
        );
    });
};
