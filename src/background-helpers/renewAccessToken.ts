// import { getFEtoBEAuthToken } from "./getFEtoBEAuthToken";

// // const nardiumAuthBackendUrl = process.env["REACT_GOOGLE_APP_SCRIPT_URL"] ?? "";
// const nardiumAuthBackendUrl = process.env["REACT_NARDIUM_AUTH_BACKEND_URL"] ?? "";
// const expectedClientId = process.env["REACT_EXPECTED_CLIENT_ID"] ?? "";

// export const renewAccessToken = async (userEmail: string = ""): Promise<Token | null> => {
//     try {
//         // if (!refreshToken) {
//         //     return null;
//         // }

//         const authToken = await getFEtoBEAuthToken(userEmail);
//         if (!authToken) {
//             console.error("[Renew] No auth token found in storage");
//             return null;
//         }

//         // const refreshToken = authToken.refresh_token;
//         // if (!refreshToken) {
//         //     console.error("[Renew] No refresh token found in auth token");
//         //     return null;
//         // }

//         const url = nardiumAuthBackendUrl + "/backend-/google/refresh-token"
//         // console.log("renewAccessToken url going out:", url);
//         const response = await fetch(url, {
//             method: "GET",
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-client-id': expectedClientId,
//                 'Authorization': `Bearer ${authToken.access_token}`
//             }
//         });

//         if (!response.ok) {
//             console.log("Something went wrong renewing access token. ERROR:", response);
//             return null;
//         }
//         // console.log("renewRefreshToken resp RAW", response);

//         const tokenResponse = await response.json();
//         return tokenResponse as Token;
//     } catch (error) {
//         console.log("failed at renewAccessToken", error);
//         return null;
//     }
// };


