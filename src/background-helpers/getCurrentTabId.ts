export function getCurrentTabId() {
    return new Promise((resolve, reject) => {
        try {
            // chrome.tabs.query({ active: true }, tabs => {
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    console.log("cole tabs", tabs);
                    const currentTab = tabs[0];

                    // console.log("found dis tab:", tabs[0] ? tabs[0].id : "nothing");
                    // resolve(tabs[0] ? tabs[0].id : "nothing");
                    if (currentTab && currentTab.url.includes("docs.google.com/document/d")) {
                        console.log("Current tab:", currentTab);
                        resolve(currentTab.id);
                    } else {
                        console.log("User is not on a Google Docs tab.");
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
