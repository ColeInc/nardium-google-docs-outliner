export function getCurrentTabId() {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    const currentTab = tabs[0];

                    if (currentTab && currentTab.url.includes("docs.google.com/document/d")) {
                        // console.log("Current tab:", currentTab);
                        resolve(currentTab.id);
                    } else {
                        // User is not on a Google Docs tab:
                        // console.log("User is not on a Google Docs tab.");
                        resolve(null);
                    }
                }
            });
        } catch (e) {
            console.log("error finding current tab id", e);
            resolve(null);
        }
    });
}
