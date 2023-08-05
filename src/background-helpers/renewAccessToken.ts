import { Token } from "../models/token";

const googleAppScriptUrl = process.env["REACT_GOOGLE_APP_SCRIPT_URL"] ?? "";

export const renewAccessToken = async (refreshToken: string): Promise<Token | null> => {
    try {
        if (!refreshToken) {
            return null;
        }

        const url = googleAppScriptUrl + "?type=renewAccessToken&refreshToken=" + encodeURIComponent(refreshToken);
        // console.log("renewAccessToken url going out:", url);
        const response = await fetch(url, {
            method: "GET",
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
