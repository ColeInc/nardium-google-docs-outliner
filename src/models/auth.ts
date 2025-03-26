
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

export interface AuthTokenResponse {
    token: AccessToken;
}

// export interface Token {
//     access_token: string;
//     id_token?: string;
//     // refresh_token?: string;
//     expires_in?: number;
//     expiry_date?: string;
//     scope?: string;
//     token_type?: string;
//     email?: string;
//     userId?: string;
// }


export interface AccessToken {
    success: boolean;
    access_token: string;
    expires_in: number;
    email?: string;
    userId?: string;
}

export interface FEtoBETokenResponse {
    success: boolean;
    jwt_token: string;
    csrf_token: string;
    user: {
        email: string;
        sub: string;
        subscription_tier?: string;
    }
}

