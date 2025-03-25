import { getAccessTokenFromSessionStorage } from "./getAccessTokenFromSessionStorage";
import { getFEtoBEAuthToken } from "./getFEtoBEAuthToken";

interface TokenResponse {
    success: boolean;
    access_token: string;
    expires_in: number;
}

const nardiumAuthBackendUrl = process.env["REACT_NARDIUM_AUTH_BACKEND_URL"] ?? "";
const expectedClientId = process.env["EXPECTED_CLIENT_ID"] ?? "";

export const refreshAccessToken = async (userEmail: string): Promise<TokenResponse | null> => {
    console.log(`Starting refreshAccessToken for user: ${userEmail}`);
    try {
        const FEtoBEToken = await getFEtoBEAuthToken(userEmail);
        if (!FEtoBEToken) {
            console.error("[Refresh] No auth token found in storage");
            return null;
        }

         // Check whether we already have non expired access token. If so, don't need to send request.        
        let authToken;
        try {
            authToken = await getAccessTokenFromSessionStorage(userEmail);
        } catch (error) {
            console.log(`Error fetching access token from session storage: ${error}`);
            authToken = null;
        }
        
        // Now that we have the token (or null), we can proceed with the rest of the function
        if (!authToken) {
            console.log(`No access token found in session storage for key: nardium-access-${userEmail}`);
        } else {
            const now = Math.floor(Date.now() / 1000);
            const tokenExpirationTime = authToken.expires_in;
            
            if (tokenExpirationTime && now < tokenExpirationTime) {
                console.log(`Access token is still valid for user: ${userEmail}, expiration time: ${tokenExpirationTime}, current time: ${now}`);
                return authToken as TokenResponse;  // Token is still valid, return it instead of firing new request
            }
        }

        console.log(`sending refresh-token api request: ${userEmail}`);
        const url = `${nardiumAuthBackendUrl}/auth/google/refresh-token`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': expectedClientId,
                'Authorization': `Bearer ${FEtoBEToken.jwt_token}`
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