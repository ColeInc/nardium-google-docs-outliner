import React, { ReactNode, useMemo, useState } from "react";
import DocumentContext, { defaultDocumentState } from "./document-context";
import { DocumentInfo } from "../models";

interface DocumentProviderProps {
    children: ReactNode;
}

const DocumentProvider = (props: DocumentProviderProps) => {
    const [documentDetails, setDocumentDetails] = useState<DocumentInfo>(defaultDocumentState);

    const updateDocumentDetails = (details: DocumentInfo) => {
        setDocumentDetails(prevState => {
            // console.log("prevState", prevState);
            // console.log("new Provider:", { ...prevState, ...details });
            return { ...prevState, ...details } as DocumentInfo;
        });
    };
    const clearDocumentDetails = () => {
        setDocumentDetails(defaultDocumentState);
    };

    const documentContext = useMemo(
        () => ({
            documentDetails,
            updateDocumentDetails,
            clearDocumentDetails,
        }),
        [documentDetails, updateDocumentDetails, clearDocumentDetails]
    );

    return <DocumentContext.Provider value={documentContext}>{props.children}</DocumentContext.Provider>;
};

export default DocumentProvider;
