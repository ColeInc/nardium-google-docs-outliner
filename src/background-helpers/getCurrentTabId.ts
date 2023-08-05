export function getCurrentTabId() {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.query({ active: true }, tabs => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    // console.log("tabs", tabs);
                    resolve(tabs[0] ? tabs[0].id : "nothing");
                }
            });
        } catch (e) {
            console.log("error finding current tab id", e);
            resolve(null);
        }
    });
}
