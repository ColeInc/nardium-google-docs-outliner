export interface DocumentInfo {
    token: string;
    email: string;
    documentId: string;
    documentContent: any;
}

export interface IDocumentContext {
    documentDetails: DocumentInfo;
    updateDocumentDetails: (details: DocumentInfo) => void;
}
