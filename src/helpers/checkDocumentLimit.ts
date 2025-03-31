
export const checkDocumentLimit = async (documentId: string): Promise<boolean> => {
    try {
        const response = await chrome.runtime.sendMessage({
            type: "checkDocumentLimit",
            documentId
        });

        return response.success;
    } catch (error) {
        console.error("Error checking document limit:", error);
        return false;
    }
}; 