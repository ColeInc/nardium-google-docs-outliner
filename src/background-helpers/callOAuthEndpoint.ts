import { Token } from "../models/token";

const googleAppScriptUrl = process.env["REACT_GOOGLE_APP_SCRIPT_URL"] ?? "";

export const callOAuthEndpoint = async (authCode: string | null): Promise<Token | null> => {
    if (!authCode) return null;

    const url = googleAppScriptUrl + "?code=" + encodeURIComponent(authCode) + "&type=authenticateUser";

    try {
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            console.log("Something went fetching nardium auth. ERROR:", response);
            return null;
        }
        const responseData = await response.json();
        // console.log("resp", responseData);
        return responseData as Token;
    } catch (error) {
        console.log("Error while fetching nardium auth:", error);
        return null;
    }
};
