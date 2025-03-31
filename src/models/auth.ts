// TODO: convert documentContent from any to proper type
export interface DocumentInfo {
    isLoggedIn: boolean;
    hasClickedLogin: boolean;
    token: string;
    email: string;
    userId: string;
    documentId: string;
    documentContent: any;
    tabId?: number;  // Optional since it might not be set in all cases
    documentLimit?: boolean;  // Whether user has hit their document limit
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
    expiry_time: string;
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

