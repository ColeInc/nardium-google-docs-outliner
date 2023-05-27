import React from "react";
import { DocumentInfo, IDocumentContext } from "../models";

export const defaultDocumentState: DocumentInfo = {
    isLoggedIn: false,
    token: "",
    email: "",
    documentId: "",
    documentContent: undefined,
};

const DocumentContext = React.createContext<IDocumentContext>({
    documentDetails: defaultDocumentState,
    updateDocumentDetails: (details: DocumentInfo) => {},
});

export default DocumentContext;
