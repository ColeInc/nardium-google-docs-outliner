import React, { useContext } from "react";
import DocumentContext from "../context/document-context";
import { DocumentInfo } from "../models";

export const getDocumentId = () => {
    const userCtx = useContext(DocumentContext);

    console.log("triggering req to getDocumentId");
    chrome.runtime.sendMessage({ type: "getDocumentId" }, (response: any) => {
        // userCtx.updateDocumentDetails({ documentId: response.documentId } as DocumentInfo);

        console.log("fetched dis documentId (back at content.js!)", response.documentId);
        response.documentId ? userCtx.updateDocumentDetails({ documentId: response.documentId } as DocumentInfo) : null;
        console.log("2)");
    });
};
