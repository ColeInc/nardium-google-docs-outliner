import React from "react";
import { DocumentInfo } from "../models";

interface Document {
    documentId: string;
}

export const getDocumentId = async (setDocumentId: (details: DocumentInfo) => void): Promise<string | null> => {
    console.log("triggering req to getDocumentId");

    try {
        const documentId = await new Promise<string>((resolve, reject) => {
            chrome.runtime.sendMessage({ type: "getDocumentId" }, (response: Document) => {
                if (response && response.documentId) {
                    resolve(response.documentId);
                } else {
                    reject(new Error("No documentId found"));
                }
            });
        });

        setDocumentId({ documentId: documentId } as DocumentInfo);
        return documentId;
        // documentCtx.updateDocumentDetails({ documentId: documentId } as DocumentInfo);
    } catch (e) {
        console.error(e);
        return null;
    }
};
