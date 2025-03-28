
interface Document {
    documentId: string;
}

export const getDocumentId = async (): Promise<string | null> => {
    try {
        const documentId = await new Promise<string>((resolve, reject) => {
            chrome.runtime.sendMessage({ type: "getDocumentId" }, (response: Document) => {
                if (response?.documentId) {
                    resolve(response.documentId);
                } else {
                    reject(new Error("No documentId found"));
                }
            });
        });

        return documentId;
    } catch (e) {
        console.log("Failed to fetch Document ID.");
        return null;
    }
};
