export const setLocalStorage = (key: string, payload: { [key: string]: number | boolean }) => {
    chrome.runtime.sendMessage(
        {
            type: "setLocalStorage",
            key,
            payload,
        },
        response => {
            console.log("response from setLocalStorage", response);
        }
    );
};
