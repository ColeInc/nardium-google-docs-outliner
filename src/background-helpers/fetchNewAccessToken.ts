// import { getFEtoBEAuthTokenFromLocalStorage } from "./getFEtoBEAuthTokenFromLocalStorage";
// import { getRefreshTokenFromLocalStorage } from "./getRefreshTokenFromLocalStorage";
// import { startAccessTokenTimer } from "./startAccessTokenTimer";
// import { appendUserJWTInfo } from "./appendUserJWTInfo";
// import { renewAccessToken } from "./renewAccessToken";
// import { getCurrentTabId } from "./getCurrentTabId";
// import { storeOAuthToken } from "./storeOAuthToken";
// import { checkIfExpired } from "./checkIfExpired";
// import { Token } from "../models/token";
// import { logout } from "./logout";

// export const fetchNewAccessToken = async (userEmail: string) => {
//     // starts by just checking expired_in of current localstorage one, returns that if valid,
//     if (userEmail.length < 1) {
//         console.log(`Could not fetch user's email >${userEmail}<. User is not viewing google doc tab.`); // we need user to be on the current tab because it scrapes webpage for currently logged in user since we use that as a key.
//         return;
//     }

//     const authToken = await getFEtoBEAuthTokenFromLocalStorage(userEmail);
//     if (!authToken) {
//         logout(undefined);
//         throw new Error("No valid access token found in localstorage. User must login manually.");
//     }

//     const token = JSON.parse(authToken as string);

//     // Check if token has expired:
//     const expired = checkIfExpired(token.expiry_date);

//     if (!expired) {
//         // console.log("token isn't expired, so FE should just keep on using new one for now!");
//         // start timer for expiration of existing access_token incase it despawned in user's browser:
//         startAccessTokenTimer(token.expires_in, userEmail);
//         return token as Token;
//     }

//     // Else, goes gets one with refresh token, else asks user to login.
//     // console.log("token expired. fetching new one via refresh token:");

//     //TODO: this was the old way we fetched email (extracted from JWT), might be better to go back to this approach?
//     // const userEmail = appendUserJWTInfo(token).email ?? "";
//     // const refreshToken = await getRefreshTokenFromLocalStorage(userEmail);
//     // const newToken = await renewAccessToken(refreshToken as string);

//     if (!newToken) {
//         console.error("Invalid access token returned when trying to fetch one with refresh token.");
//         return;
//     } else {
//         // store oauth response token into chrome.storage PER BROWSER TAB with tabId as key:
//         const newEnhancedToken = appendUserJWTInfo(newToken);
//         storeOAuthToken(newEnhancedToken, userEmail);

//         // start timer for expiration of this new access_token:
//         startAccessTokenTimer(newEnhancedToken?.expires_in, userEmail);
//         return newEnhancedToken;
//     }
// };
