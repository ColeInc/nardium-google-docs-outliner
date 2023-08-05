export const startAccessTokenTimer = (expiresIn: number | undefined) => {
    if (!expiresIn) {
        // console.log("No timer started. Invalid expires_in provided.");
        return;
    }

    // first check if we have an existing timer & clear it if found.
    chrome.alarms.clear("accessTokenTimer", wasCleared => {
        if (wasCleared) {
            // console.log(`Timer accessTokenTimer was successfully cleared.`);
        }
    });

    // subtract 1 min from expiry time so we got 1 min to fetch new one:
    const timeSeconds = expiresIn - 60;
    // TODO: can toggle this for 10second token timeout instead of 1hr:
    const timeMins = timeSeconds / 60;
    // const timeMins = 0.2;

    // Set an alarm to go off after that time
    chrome.alarms.create("accessTokenTimer", { delayInMinutes: timeMins });
    // console.log("TIMER CREATED TO GO OFF IN --->", timeMins, "mins");
};
