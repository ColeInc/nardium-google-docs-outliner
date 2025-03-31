import { ReactNode, useMemo, useState } from "react";
import DocumentContext, { defaultDocumentState } from "./document-context";
import { DocumentInfo } from "../models";

interface DocumentProviderProps {
    children: ReactNode;
}

const DocumentProvider = (props: DocumentProviderProps) => {
    const [documentDetails, setDocumentDetails] = useState<DocumentInfo>(defaultDocumentState);

    const updateDocumentDetails = (details: Partial<DocumentInfo>) => {
        setDocumentDetails(prevState => {
            // Preserve all existing state and only update the provided fields
            const updatedState = {
                ...prevState,
                ...details
            };
            console.log("new Document Provider:", updatedState);
            return updatedState;
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
