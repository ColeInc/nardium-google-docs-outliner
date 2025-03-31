import { AccessToken } from "../models";

export const authenticateFirstTimeUser = () => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "authenticateUser", interactive: true }, (response: AccessToken | undefined) => {
            response ? resolve(response) : reject(new Error("Invalid response from background.js"));
        });
    });
};