import React from "react";
import { DocumentInfo, IDocumentContext } from "../models";
import { defaultDocumentState } from "./DocumentProvider";

const DocumentContext = React.createContext<IDocumentContext>({
    documentDetails: defaultDocumentState,
    updateDocumentDetails: (details: DocumentInfo) => {},
});

export default DocumentContext;
