interface TokenResponse {
    success: boolean;
    access_token: string;
    expires_in: number;
}

const nardiumAuthBackendUrl = process.env["REACT_NARDIUM_AUTH_BACKEND_URL"] ?? "";
const expectedClientId = process.env["EXPECTED_CLIENT_ID"] ?? "";

export const refreshAccessToken = async (): Promise<TokenResponse | null> => {
    try {
        // if (!refreshToken) {
        //     return null;
        // }

        const url = `${nardiumAuthBackendUrl}/auth/google/refresh-token`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': expectedClientId
            },
            // body: JSON.stringify({ refreshToken }),
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