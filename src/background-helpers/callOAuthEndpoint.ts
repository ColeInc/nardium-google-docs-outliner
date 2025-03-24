import { AuthResponse } from "../models";

const nardiumAuthBackendUrl = process.env["REACT_NARDIUM_AUTH_BACKEND_URL"] ?? "";
const isDevelopment = process.env.NODE_ENV === 'development';

export const callOAuthEndpoint = async (authCode: string | null): Promise<AuthResponse | null> => {
    if (!authCode) {
        console.log("[OAuth] No auth code provided, skipping request");
        return null;
    }

    // const url = nardiumAuthBackendUrl + "?code=" + encodeURIComponent(authCode) + "&type=authenticateUser";
    const url = nardiumAuthBackendUrl + "/auth/google/callback" + "?code=" + encodeURIComponent(authCode)
    console.log("[OAuth] Making request to:", url);
    console.log("[OAuth] Environment:", isDevelopment ? "development" : "production");

    try {
        const requestConfig: RequestInit = {
            method: "GET",
            credentials: 'include' as RequestCredentials,
            headers: {
                'Content-Type': 'application/json',
                // Add any additional headers needed for production
                ...(isDevelopment ? {} : {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Client-Version': process.env["REACT_APP_VERSION"] || '1.0.0'
                })
            },
            mode: 'cors'
        };
        console.log("[OAuth] Request configuration:", JSON.stringify(requestConfig, null, 2));

        const response = await fetch(url, requestConfig);
        console.log("[OAuth] Response status:", response.status);
        console.log("[OAuth] Response headers:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorMessage = `HTTP error! status: ${response.status}`;
            console.error("[OAuth] Auth request failed:", errorMessage);
            if (isDevelopment) {
                const responseText = await response.text();
                console.error("[OAuth] Response details:", responseText);
            }
            return null;
        }

        const responseData = await response.json();
        console.log("[OAuth] Successfully received response data");
        return responseData as AuthResponse;
    } catch (error) {
        console.error("[OAuth] Error while fetching nardium auth:", error);
        return null;
    }
};
