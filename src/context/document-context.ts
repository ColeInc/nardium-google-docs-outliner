import React from "react";
import { DocumentInfo, IDocumentContext } from "../models";

export const defaultDocumentState: DocumentInfo = {
    isLoggedIn: false,
    hasClickedLogin: false,
    token: "",
    email: "",
    userId: "",
    documentId: "",
    documentContent: undefined,
};

const DocumentContext = React.createContext<IDocumentContext>({
    documentDetails: defaultDocumentState,
    updateDocumentDetails: (details: DocumentInfo) => {},
    clearDocumentDetails: () => {},
});

export default DocumentContext;
