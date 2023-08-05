export const calculateExpiryDate = (expiresInSeconds: number | undefined) => {
    if (!expiresInSeconds) {
        return "";
    }
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + expiresInSeconds * 1000);
    return expiryDate;
};
