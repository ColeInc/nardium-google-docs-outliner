import { FEtoBETokenResponse } from "../models";

const nardiumAuthBackendUrl = process.env["REACT_NARDIUM_AUTH_BACKEND_URL"] ?? "";
const isDevelopment = process.env.NODE_ENV === 'development';
const expectedClientId = process.env["REACT_EXPECTED_CLIENT_ID"] ?? "";

// Maximum number of retry attempts and delay between retries
const MAX_AUTH_RETRIES = 20;
const RETRY_DELAY_MS = 3000; // 3 seconds

export const callOAuthEndpoint = async (authCode: string | null): Promise<FEtoBETokenResponse | null> => {
    if (!authCode) {
        console.log("[OAuth] No auth code provided, skipping request");
        return null;
    }

    // Check and manage retry count
    try {
        const retryData = await getRetryCount();
        if (retryData.count >= MAX_AUTH_RETRIES) {
            console.error(`[OAuth] Auth retry limit (${MAX_AUTH_RETRIES}) reached. Please try again later.`);
            return null;
        }
    } catch (error) {
        console.error("[OAuth] Error checking retry count:", error);
    }

    // const authToken = await getFEtoBEAuthToken();
    // if (!authToken) {
    //     console.error("[OAuth] No auth token found in storage");
    //     return null;
    // }

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
                'x-client-id': expectedClientId,
                // 'Authorization': `Bearer ${authToken}`, // no auth token needed for dis flow since it's the very initial one.
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
            // Increment retry counter on failure
            await incrementRetryCount();

            const errorMessage = `HTTP error! status: ${response.status}`;
            console.error("[OAuth] Auth request failed:", errorMessage);
            if (isDevelopment) {
                const responseText = await response.text();
                console.error("[OAuth] Response details:", responseText);
            }
            return null;
        }

        // Reset retry counter on success
        await resetRetryCount();

        const responseData = await response.json();
        console.log("[OAuth] Successfully received response data");
        return responseData as FEtoBETokenResponse;
    } catch (error) {
        // Increment retry counter on exception
        await incrementRetryCount();

        console.error("[OAuth] Error while fetching nardium auth:", error);
        return null;
    }
};

// Helper functions to manage retry count in chrome.storage.local

async function getRetryCount(): Promise<{ count: number, timestamp: number }> {
    return new Promise((resolve) => {
        chrome.storage.local.get('oauthRetryData', (result) => {
            const defaultData = { count: 0, timestamp: Date.now() };
            resolve(result['oauthRetryData'] || defaultData);
        });
    });
}

async function incrementRetryCount(): Promise<void> {
    const retryData = await getRetryCount();
    return new Promise((resolve) => {
        chrome.storage.local.set({
            'oauthRetryData': {
                count: retryData.count + 1,
                timestamp: Date.now()
            }
        }, () => {
            console.error(`[OAuth] Retry attempt ${retryData.count + 1}/${MAX_AUTH_RETRIES}`);
            resolve();
        });
    });
}

async function resetRetryCount(): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.local.set({
            'oauthRetryData': {
                count: 0,
                timestamp: Date.now()
            }
        }, resolve);
    });
}
