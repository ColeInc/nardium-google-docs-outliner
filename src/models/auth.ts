// TODO: convert documentContent from any to proper type
export interface DocumentInfo {
    isLoggedIn: boolean;
    hasClickedLogin: boolean;
    token: string;
    email: string;
    userId: string;
    documentId: string;
    documentContent: any;
}

export interface IDocumentContext {
    documentDetails: DocumentInfo;
    updateDocumentDetails: (details: Partial<DocumentInfo>) => void;
    clearDocumentDetails: () => void;
}
