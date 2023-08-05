export interface AuthTokenResponse {
    token: Token;
}

export interface Token {
    access_token: string;
    id_token?: string;
    refresh_token?: string;
    expires_in?: number;
    expiry_date?: string;
    scope?: string;
    token_type?: string;
    email?: string;
    userId?: string;
}
