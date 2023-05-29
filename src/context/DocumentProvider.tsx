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

    const documentContext = useMemo(
        () => ({
            documentDetails,
            updateDocumentDetails,
        }),
        [documentDetails, updateDocumentDetails]
    );

    return <DocumentContext.Provider value={documentContext}>{props.children}</DocumentContext.Provider>;
};

export default DocumentProvider;
