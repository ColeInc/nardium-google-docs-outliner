export const fetchCurrentTabGoogleAccount = (): string => {
    try {
        // Find the email address within the "gb_wc" div on google docs webpage:
        const element = document.querySelector(".gb_wc");

        if (element) {
            const accountInfoDiv = element.querySelector("div:nth-child(3)");

            if (accountInfoDiv) {
                const email = accountInfoDiv.textContent?.trim() ?? "";
                // console.log("Extracted dis email address:", email);
                return email;
            } else {
                console.log('Email address div not found within "gb_wc" div :(');
                return "";
            }
        } else {
            return "";
        }
    } catch (error) {
        console.log("failed to fetch user's email address", error);
        return "";
    }
};
