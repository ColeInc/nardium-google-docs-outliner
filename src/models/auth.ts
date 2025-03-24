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

export interface AuthResponse {
    success: boolean;
    csrfToken: string;
    user: {
        email: string;
        sub: string;
        subscription_tier: string;
    }
}

