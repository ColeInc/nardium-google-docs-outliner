import { getFEtoBEAuthToken } from "./getFEtoBEAuthToken";

interface TokenResponse {
    success: boolean;
    access_token: string;
    expires_in: number;
}

const nardiumAuthBackendUrl = process.env["REACT_NARDIUM_AUTH_BACKEND_URL"] ?? "";
const expectedClientId = process.env["EXPECTED_CLIENT_ID"] ?? "";

export const refreshAccessToken = async (userEmail: string): Promise<TokenResponse | null> => {
    try {
        const authToken = await getFEtoBEAuthToken(userEmail);
        if (!authToken) {
            console.error("[Refresh] No auth token found in storage");
            return null;
        }

        // Check if token is expired
        const now = Math.floor(Date.now() / 1000);
        const tokenExpirationTime = authToken.expires_in;
        
        if (now < tokenExpirationTime) {
            return authToken as TokenResponse;  // Token is still valid, return it
        } 

        const url = `${nardiumAuthBackendUrl}/auth/google/refresh-token`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': expectedClientId,
                'Authorization': `Bearer ${authToken.access_token}`
            },
        });

        if (!response.ok) {
            console.log("Something went wrong refreshing access token. ERROR:", response);
            return null;
        }

        const tokenResponse = await response.json();
        return tokenResponse as TokenResponse;
    } catch (error) {
        console.log("failed at refreshAccessToken", error);
        return null;
    }
};