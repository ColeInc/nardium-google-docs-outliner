
export const checkDocumentLimit = async (documentId: string, token: string): Promise<boolean> => {
    try {
        const response = await chrome.runtime.sendMessage({
            type: "checkDocumentLimit",
            documentId,
            token
        });

        if (response.success) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.error("Error checking document limit:", error);
        return false;
    }
}; 