export const startAccessTokenTimer = (expiresIn: number | undefined, userEmail: string) => {
    if (!expiresIn || !userEmail) {
        console.log("No timer started. Invalid expires_in or userEmail provided.");
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
    // const timeMins = 0.1;

    // Set an alarm to go off after that time & pass users email in with that alarm name for future reference:
    chrome.alarms.create(`accessTokenTimer-${userEmail}`, { delayInMinutes: timeMins });
};
