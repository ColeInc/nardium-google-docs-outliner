export const checkIfExpired = (expiryDateString: string | undefined) => {
    // console.log("start checkIfExpired -->", expiryDateString);

    if (!expiryDateString) {
        return true;
    }

    // convert string to date if its currently a string:
    const expiryDate = JSON.parse(expiryDateString, (key, value) => {
        // Check if the value is a string and represents a valid date
        const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
        if (dateRegex.test(value)) {
            // If it's a valid date string, convert it back to a Date object
            return new Date(value);
        }
        // For non-date values or invalid date strings, return the value as is
        return value;
    });
    // console.log("new date -->", expiryDate);

    const currentDate = new Date();
    // console.log("token isExpired?", expiryDate.getTime() <= currentDate.getTime());
    return expiryDate.getTime() <= currentDate.getTime();
};
