import React, { ReactNode, useMemo, useState } from "react";
import DocumentContext, { defaultDocumentState } from "./document-context";
import { DocumentInfo } from "../models";

interface DocumentProviderProps {
    children: ReactNode;
}

const DocumentProvider = (props: DocumentProviderProps) => {
    const [documentDetails, setdocumentDetails] = useState<DocumentInfo>(defaultDocumentState);
    // console.log("userDeatils", documentDetails);

    const updateDocumentDetails = (details: DocumentInfo) => {
        setdocumentDetails(prevState => {
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

    // return <DocumentContext.Provider value={DocumentContext}>{props.children}</DocumentContext.Provider>;
    return <DocumentContext.Provider value={documentContext}>{props.children}</DocumentContext.Provider>;
};

export default DocumentProvider;
