import React from "react";
import { DocumentInfo, IDocumentContext } from "../models";

interface Document {
    documentId: string;
}

// export const getDocumentId = async (setDocumentId: (details: DocumentInfo) => void): Promise<string | null> => {
export const getDocumentId = async (): Promise<string | null> => {
    console.log("triggering req to getDocumentId");
    // const { updateDocumentDetails } = documentCtx;

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

        // console.log("cole docId being sent in", documentId);
        // setDocumentId({ documentId } as DocumentInfo);
        // updateDocumentDetails({ documentId } as DocumentInfo);
        return documentId;
        // documentCtx.updateDocumentDetails({ documentId: documentId } as DocumentInfo);
    } catch (e) {
        console.error("caught error: ", e);
        return null;
    }
};
