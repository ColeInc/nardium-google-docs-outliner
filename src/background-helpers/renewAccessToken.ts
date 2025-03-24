import { Token } from "../models/token";
import { getAuthToken } from "./getAuthToken";

// const nardiumAuthBackendUrl = process.env["REACT_GOOGLE_APP_SCRIPT_URL"] ?? "";
const nardiumAuthBackendUrl = process.env["REACT_NARDIUM_AUTH_BACKEND_URL"] ?? "";
const expectedClientId = process.env["EXPECTED_CLIENT_ID"] ?? "";

export const renewAccessToken = async (refreshToken: string): Promise<Token | null> => {
    try {
        if (!refreshToken) {
            return null;
        }

        const authToken = await getAuthToken();
        if (!authToken) {
            console.error("[Renew] No auth token found in storage");
            return null;
        }

        const url = nardiumAuthBackendUrl + "/auth/google/callback" + "?type=renewAccessToken&refreshToken=" + encodeURIComponent(refreshToken);
        // console.log("renewAccessToken url going out:", url);
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': expectedClientId,
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            console.log("Something went wrong renewing access token. ERROR:", response);
            return null;
        }
        // console.log("renewRefreshToken resp RAW", response);

        const newToken = await response.text();
        return JSON.parse(newToken) as Token;
    } catch (error) {
        console.log("failed at renewAccessToken", error);
        return null;
    }
};
