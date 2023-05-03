// TODO: convert documentContent to proper type
export interface DocumentInfo {
    isLoggedIn: boolean;
    token: string;
    email: string;
    documentId: string;
    documentContent: any;
}

export interface IDocumentContext {
    documentDetails: DocumentInfo;
    updateDocumentDetails: (details: DocumentInfo) => void;
}
