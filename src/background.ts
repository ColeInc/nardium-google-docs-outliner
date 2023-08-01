import { send } from "process";
import { setTimeout } from "timers";
import { AuthTokenResponse, Token } from "./components/Login";

const clientId = process.env["REACT_GOOGLE_CLOUD_CLIENT_ID"] ?? "";
const scopes = process.env["REACT_GOOGLE_CLOUD_SCOPES"] ?? "";
const googleAppScriptUrl = process.env["REACT_GOOGLE_APP_SCRIPT_URL"] ?? "";

interface ChromeMessageRequest {
    type: string;
    token?: string;
    documentId?: string;
    startIndex?: string;
    key?: string;
    payload?: {
        [key: string]: number;
    };
    interactive?: boolean;
}

const callOAuthEndpoint = async (authCode: string | null): Promise<Token | null> => {
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
        // console.log("callOAuthEndpoint RAW", response);

        // const content = await response.text();
        // console.log("access_token response", content);
        // return content;
        const responseData = await response.json();
        console.log("resp response", responseData);
        // const { access_token, expires_in, refresh_token, scope, token_type, id_token } = responseData;
        return responseData as Token;
    } catch (error) {
        console.log("Error while fetching nardium auth:", error);
        return null;
    }
};

// store oauth response token into chrome.storage PER BROWSER TAB with tabId as key:
const storeOAuthToken = (token: Token | undefined | null) => {
    try {
        console.log("gets to storeOAuthToken");
        // token = JSON.parse(token)
        // token = JSON.parse(token);
        // const { access_token, id_token, refresh_token, expires_in, scope, token_type } = token;
        if (typeof token === "string") {
            try {
                token = JSON.parse(token);
            } catch (error) {
                // If JSON parsing fails, just keep the original token (string)
                return;
            }
        } else {
            // If the token is not a string, just return it as it is
        }

        // get current tabId:
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            const currentTabId = tabs[0].id;
            console.log("Current Tab ID:", currentTabId);

            if (!token) {
                new Error("invalid token received at storeOAuthToken");
                return;
            }
            const enhancedToken = appendUserJWTInfo(token);
            console.log("trying to assign user email:", enhancedToken.email);
            // token.email = jwtInfo;
            // token = { ...token, ...jwtInfo };
            const expiryDateTime = calculateExpiryDate(enhancedToken.expires_in);
            enhancedToken.expiry_date = JSON.stringify(expiryDateTime);

            // store token into localstorage
            chrome.storage.local.set({ [`nardium-token-${currentTabId}`]: JSON.stringify(enhancedToken) }, () => {
                console.log(`Data saved to local storage for key >nardium-token-${currentTabId}<`, enhancedToken);
            });
        });

        return;
    } catch (error) {
        console.log("failed while processing authorization response: ", error);
        return undefined;
    }
};

const storeRefreshToken = (userEmail: string, refreshToken: string) => {
    try {
        if (userEmail.length > 0 && refreshToken.length > 0) {
            chrome.storage.local.set({ [`nardium-refresh-${userEmail}`]: refreshToken }, () => {
                console.log(`Data saved to local storage for key >nardium-refresh-${userEmail}<`);
            });
        } else {
            new Error("Invalid user email or refresh_token provided to storeRefreshToken function.");
        }
    } catch (error) {
        console.log("Failed to store refresh token into localstorage: ", error);
    }
};

const startAccessTokenTimer = (expiresIn: number | undefined) => {
    console.log("gets to start of timer fn");
    if (!expiresIn) {
        console.log("No timer started. Invalid expires_in provided.");
        return;
    }
    // subtract 1 min from expiry time so we got 1 min to fetch new one:
    const timeSeconds = expiresIn - 60;
    // TODO: uncomment dis so its real 1:
    const timeMins = timeSeconds / 60;
    // // // const timeMins = 0.1;

    // Set an alarm to go off after that time
    chrome.alarms.create("accessTokenTimer", { delayInMinutes: timeMins });
    console.log("TIMER CREATED TO GO OFF IN --->", timeMins, "mins");

    // Listener to handle the alarm firing
    // chrome.alarms.onAlarm.addListener(alarm => {
    //     if (alarm.name === "accessTokenTimer") {
    //         console.log("Timer finished! Access token has expired.");
    //         // Your code here to handle the token expiration, e.g., refresh token, logout, etc.
    //     }
    // });
    return;
};

// when timer goes off, fetch new access_token with refresh_token:
chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === "accessTokenTimer") {
        console.log("Timer finished! Access token has expired.");
        fetchNewAccessToken();
    }
});

const appendUserJWTInfo = (token: Token): Token => {
    const { id_token } = token;

    const payloadBase64 = id_token?.split(".")[1];
    if (!payloadBase64) {
        new Error("failed to process extract JWT token");
        return token;
    }
    const payloadJsonString = atob(payloadBase64);
    const decodedPayload = JSON.parse(payloadJsonString);
    const email = decodedPayload.email ?? "";
    const userId = decodedPayload.sub ?? "";
    console.log("Decoded email:", email);
    console.log("Decoded user id:", userId);
    const finalToken = { ...token, email, userId };
    return finalToken;
};

const fetchNewAccessToken = async () => {
    try {
        // 1) get current tab ID and fetch auth token from local storage via TAB ID
        // const currentTabId = await new Promise((resolve, reject) => {
        //     chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        //         const currentTabId = tabs[0].id;
        //         // return currentTabId;
        //         resolve(currentTabId);
        //     });
        // });
        const currentTabId = await getCurrentTabId();
        console.log("Current Tab ID:", currentTabId);

        // fetch auth token from localstorage:
        // const authToken = chrome.storage.local.get(`nardium-token-${currentTabId}`, resp => {
        //     console.log("fetched from localstorage:", resp);
        //     return resp;
        // });
        // const authToken = await new Promise((resolve, reject) => {
        //     chrome.storage.local.get(`nardium-token-${currentTabId}`, resp => {
        //         console.log("fetched dis authToken from localstorage:", resp);
        //         resolve(resp[`nardium-token-${currentTabId}`]);
        //         // resolve(resp);
        //     });
        // });
        const authToken = await getAuthTokenFromLocalStorage(currentTabId as string);
        if (!authToken) {
            logout(undefined);
            new Error("No valid access token found in localstorage. User must login manually.");
        }

        // 2) extract user email
        console.log("trying to convert dis", authToken);
        const token = JSON.parse(authToken as string);
        const enhancedToken = appendUserJWTInfo(token);

        // 3) fetch refresh_token from localstorage with that email
        // const refreshToken = await new Promise((resolve, reject) => {
        //     chrome.storage.local.get(`nardium-refresh-${userEmail}`, resp => {
        //         console.log("fetched this refreshToken from localstorage:", resp);
        //         resolve(resp[`nardium-refresh-${userEmail}`]);
        //         // resolve(resp);
        //     });
        // });
        const refreshToken = await getRefreshTokenFromLocalStorage(enhancedToken.email ?? "");

        // 4) send req out to renewAccessToken GAS MW API
        const newToken = await renewAccessToken(refreshToken as string);
        if (!newToken) {
            console.error("Invalid access token returned when trying to fetch one with refresh token.");
            return;
        } else {
            // store oauth response token into chrome.storage PER BROWSER TAB with tabId as key:
            storeOAuthToken(appendUserJWTInfo(JSON.parse(newToken) as Token));
        }
    } catch (error) {
        console.log("Failed at fetchNewAccessToken", error);
        return null;
    }
    return true;
};

function getCurrentTabId() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                const currentTabId = tabs[0].id;
                resolve(currentTabId);
            }
        });
    });
}

function getAuthTokenFromLocalStorage(currentTabId: string) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(`nardium-token-${currentTabId}`, resp => {
            if (chrome.runtime.lastError || Object.keys(resp).length === 0) {
                console.log("No valid AuthToken found in localstorage.");
                reject(chrome.runtime.lastError);
            } else {
                console.log("fetched dis authToken from localstorage:", resp);
                resolve(resp[`nardium-token-${currentTabId}`]);
            }
        });
    });
}

function getRefreshTokenFromLocalStorage(userEmail: string) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(`nardium-refresh-${userEmail}`, resp => {
            console.log("fetched this refreshToken from localstorage:", resp);
            resolve(resp[`nardium-refresh-${userEmail}`]);
        });
    });
}

const renewAccessToken = async (refreshToken: string) => {
    try {
        if (!refreshToken) {
            return;
        }

        const url = googleAppScriptUrl + "?type=renewAccessToken&refreshToken=" + encodeURIComponent(refreshToken);
        console.log("renewAccessToken url going out:", url);
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            console.log("Something went wrong renewing access token. ERROR:", response);
            return null;
        }
        console.log("renewRefreshToken resp RAW", response);

        const newToken = await response.text();
        console.log("newToken response", newToken);
        // return content;
        // const responseData = await response.json();
        // console.log("resp response", responseData);
        // const { access_token, expires_in, refresh_token, scope, token_type, id_token } = responseData;
        return newToken;
    } catch (error) {
        console.log("failed at renewAccessToken", error);
        return null;
    }
};

const calculateExpiryDate = (expiresInSeconds: number | undefined) => {
    console.log("start calculateExpiryDate");
    if (!expiresInSeconds) {
        return "";
    }
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + expiresInSeconds * 1000);
    return expiryDate;
};

const checkIfExpired = (expiryDateString: string | undefined) => {
    console.log("start checkIfExpired -->", expiryDateString);

    if (!expiryDateString) {
        return true;
    }

    // convert string to date if its currently a string:
    const expiryDate = JSON.parse(expiryDateString, (key, value) => {
        // Check if the value is a string and represents a valid date
        const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
        if (dateRegex.test(value)) {
            // If it's a valid date string, convert it back to a Date object
            return new Date(value);
        }
        // For non-date values or invalid date strings, return the value as is
        return value;
    });
    console.log("new date -->", expiryDate);

    const currentDate = new Date();
    console.log("token isExpired?", expiryDate.getTime() <= currentDate.getTime());
    return expiryDate.getTime() <= currentDate.getTime();
};

const logout = async (token: string | undefined) => {
    if (token) {
        // remove user's token from cache
        await chrome.identity.removeCachedAuthToken({ token });
    }

    // Clear all cached auth tokens.
    await chrome.identity.clearAllCachedAuthTokens();

    // Clear localstorage of any JWT tokens stored:
    removeAccessTokensFromLocalStorage();

    console.log("Successfully logged out user!");
    return;
};

const removeAccessTokensFromLocalStorage = () => {
    // const currentTabId = await getCurrentTabId();
    // console.log("Current Tab ID:", currentTabId);

    chrome.storage.local.get(null, result => {
        const tokensToRemove = Object.keys(result).filter(key => key.startsWith("nardium-token-"));

        // It is fine to remove all "tokens" we find in localstorage globally, bc even if user is logged into different account in another tab their refresh token for that acc will stay there, so when user goes back to that tab it will fallback to using that refresh token to go out and fetch access token for user.
        tokensToRemove &&
            chrome.storage.local.remove(tokensToRemove, () => {
                console.log(`Removed ${tokensToRemove.length} nardium tokens from local storage.`);
            });
    });
};

chrome.runtime.onMessage.addListener((request: ChromeMessageRequest, sender, sendResponse) => {
    // Login User:
    if (request.type === "authenticateUser") {
        if (!chrome.identity) {
            console.error("Chrome Identity API not available :(");
            sendResponse(undefined);
            return;
        }

        const interactive = request.interactive ?? true;
        console.log("running authenticateUser W/ interactive ===", interactive);

        let details = {};
        if (request.interactive) {
            details = {
                interactive: true,
            };
        } else {
            details = {
                interactive: false,
                // abortOnLoadForNonInteractive: true,
                // abortOnLoadForNonInteractive: false,
                // timeoutMsForNonInteractive: 30000,
            };
        }

        // // chrome.identity.authenticateUser({ interactive: true }, token => {
        // //     if (chrome.runtime.lastError || !token) {
        // //         console.log(`SSO ended with an error: ${JSON.stringify(chrome.runtime.lastError)}`);
        // //         sendResponse(undefined);
        // //         return;
        // //     }
        // //     sendResponse({ token: token });
        // // });
        // // return true;

        const redirectURL = chrome.identity.getRedirectURL("oauth2");
        console.log("cole redirectURL", redirectURL);
        const manifest = chrome.runtime.getManifest();
        console.log("cole manifest contents", manifest);
        // const clientId = encodeURIComponent(manifest.oauth2.client_id);
        // const scopes = encodeURIComponent(manifest.oauth2.scopes.join(" "));

        const authParams = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectURL,
            response_type: "code",
            access_type: "offline",
            scope: scopes,
        });

        const authURL = `https://accounts.google.com/o/oauth2/auth?${authParams.toString()}`;

        // console.log("final details being used", JSON.stringify({ url: authURL, ...details }));
        // console.log("final details being used", JSON.stringify({ url: authURL }));

        try {
            chrome.identity.launchWebAuthFlow({ url: authURL, ...details }, responseURL => {
                // chrome.identity.launchWebAuthFlow({ url: authURL }, responseURL => {
                console.log("raw RESP URL", responseURL);

                // Check for errors:
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                    new Error(chrome.runtime.lastError.message);
                }
                if (!responseURL) {
                    console.error("Failed to fetch Authentication Code from OAUTH. Please try again.");
                    new Error("Failed to fetch Authentication Code from OAUTH. Please try again.");
                    return;
                }

                // extract valid authorization code from end of response url:
                const url = new URL(responseURL);
                const authCode = url.searchParams.get("code");
                console.log("FINAL Extracted code:", authCode);

                // call our google apps script middleware to send req to oauth with secret key in payload:
                callOAuthEndpoint(authCode)
                    .then(token => {
                        try {
                            console.log("token returned to first authenticateUser fn:", token);
                            // store oauth response into chrome.storage:
                            // const token = JSON.parse(response ?? "");

                            if (!token) {
                                new Error("No valid auth token returned :(");
                            } else {
                                // append user email and id into our final token:
                                token = appendUserJWTInfo(token);
                                console.log("token resp from appendUserJWTInfo");

                                // 1) store oauth response token into chrome.storage PER BROWSER TAB with tabId as key:
                                storeOAuthToken(token);
                                // token.email = userEmail;
                                // console.log("val returned from storeOAuthToken", userEmail);

                                // 2) store refresh token into chrome.storage with user email as key:
                                if (!token.refresh_token) {
                                    console.warn(
                                        "No refresh token found in response. Not user's first time logging in."
                                    );
                                } else {
                                    storeRefreshToken(token.email ?? "", token.refresh_token);
                                }

                                // Get the user's email address.
                                // const tokenObject = chrome.identity.getAuthToken(tokenInfo.id_token);
                                // const emailAddress = (tokenObject as any).email;
                                // Print the user's email address.
                                // console.log("email", emailAddress);

                                // sendResponse({ token: { ...tokenInfo, email: emailAddress } });
                            }
                            // send access_token back to FE so we can store in state for subsequent HTTP requests:
                            console.log("gets to end here, wid dis token: ", token);
                            startAccessTokenTimer(token?.expires_in);
                            sendResponse({ token });
                        } catch (error) {
                            new Error("Failed to login user - Stage 2 of 3 Legged Auth Flow.");
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        sendResponse("Failed to login user - Stage 2 of 3 Legged Auth Flow.");
                    });
            });
        } catch (error) {
            console.log("Failed at chrome.identity.launchWebAuthFlow: \n", error);
            sendResponse(undefined);
            return;
        }
        return true;
    }
    // Logout user:
    else if (request.type === "logoutUser") {
        console.log("Attempting to log out user...");

        // const logout = async (token: string) => {
        //     // remove user's token from cache
        //     await chrome.identity.removeCachedAuthToken({ token });

        //     // Clear all cached auth tokens.
        //     await chrome.identity.clearAllCachedAuthTokens();

        //     console.log("Successfully logged out user!");
        // };

        if (chrome.identity && request.token) {
            logout(request.token).catch(e => {
                console.log(e);
            });
        }
    }
    // // Check if user is logged in:
    // else if (request.type === "isLoggedIn") {
    //     if (!chrome.identity) {
    //         console.error("Chrome Identity API not available :(");
    //         sendResponse(undefined);
    //         return;
    //     }

    //     // interactive=false allows checking the login status without showing any authentication prompts.
    //     chrome.identity.authenticateUser({ interactive: false }, token => {
    //         if (chrome.runtime.lastError || !token) {
    //             console.log("Unable to login user.");
    //             sendResponse(undefined);
    //             return;
    //         } else {
    //             sendResponse({ token: token });
    //         }
    //     });
    //     return true;
    // }
    // // // // Check if user is logged in:
    // // // else if (request.type === "renewAccessToken") {
    // // //     // if (!chrome.identity) {
    // // //     //     console.error("Chrome Identity API not available :(");
    // // //     //     sendResponse(undefined);
    // // //     //     return;
    // // //     // }

    // // //     // // interactive=false allows checking the login status without showing any authentication prompts.
    // // //     // chrome.identity.authenticateUser({ interactive: false }, token => {
    // // //     //     if (chrome.runtime.lastError || !token) {
    // // //     //         console.log("Unable to login user.");
    // // //     //         sendResponse(undefined);
    // // //     //         return;
    // // //     //     } else {
    // // //     //         sendResponse({ token: token });
    // // //     //     }
    // // //     // });
    // // //     // return true;
    // // //     if (!chrome.identity) {
    // // //         console.error("Chrome Identity API not available :(");
    // // //         sendResponse(undefined);
    // // //         return;
    // // //     }

    // // //     // interactive=false allows checking the login status without showing any authentication prompts.
    // // //     chrome.identity.launchWebAuthFlow({ interactive: false }, token => {
    // // //         if (chrome.runtime.lastError || !token) {
    // // //             console.log("Unable to login user.");
    // // //             sendResponse(undefined);
    // // //             return;
    // // //         } else {
    // // //             sendResponse({ token: token });
    // // //         }
    // // //     });
    // // //     return true;
    // // // }
    // Fetch User Details:
    else if (request.type === "fetchUserDetails") {
        console.log("cole gets here 3");
        chrome.identity.getProfileUserInfo(userInfo => {
            if (chrome.runtime.lastError || !userInfo) {
                console.error("Failed to retrieve user info", chrome?.runtime?.lastError);
                sendResponse(undefined);
                return;
            } else {
                sendResponse(userInfo);
            }
        });
    }
    // Fetch documentId:
    else if (request.type === "getDocumentId") {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            try {
                setTimeout(() => {
                    const url = tabs[0].url;
                    const match = /\/document\/(?:u\/\d+\/)?d\/([a-zA-Z0-9-_]+)(?:\/[a-zA-Z0-9-_]+)?(?:\/edit)?/.exec(
                        url
                    );
                    const documentId = match?.[1];
                    // console.log("Document ID found:", documentId);
                    if (!documentId) {
                        sendResponse({ error: "Failed to get document ID" });
                    } else {
                        sendResponse({ documentId });
                    }
                }, 300);
            } catch (error) {
                console.log(error);
            }
        });
        return true;
    }
    // SET - Store the passed payload under the passed key in Local Storage (Store User's Heading Lvl or Current Zoom Setting in Local Storage):
    else if (request.type === "setLocalStorage") {
        const { key, payload } = request;
        // If key or payload is missing, send an error message back
        if (!key || !payload) {
            sendResponse({ type: "error", message: "Invalid parameters" });
            return;
        }

        chrome.storage.local.set({ [key]: payload }, () => {
            // console.log(`Data saved to local storage for key >${key}<`);
        });
    }
    // GET - Check Localstorage for anything stored under key parameter. (Store the passed payload under the passed key in Local Storage (Fetch User's Heading Lvl or Zoom lvl from Local Storage):
    else if (request.type === "getLocalStorage") {
        // console.log("fetching localStorage for this key...", request.key);
        if (!request.key) {
            sendResponse({ error: "Invalid key passed to fetch from Localstorage." });
            return;
        }

        chrome.storage.local.get(request.key, result => {
            const data = result[request.key as string];
            if (data) {
                console.log("Data retrieved from local storage:", data);
                sendResponse({ data });
            } else {
                console.log("Unable to find item in local storage for", request.key);
                sendResponse({ error: "Item not found" });
            }
        });
        return true;
    }
    // Fetch valid access_token and return back to user:
    else if (request.type === "fetchAccessToken") {
        console.log("starting fetchAccessToken");

        const fetchAccessToken = async () => {
            // starts by just checking expired_in of current localstorage one, returns that if valid,
            const currentTabId = await getCurrentTabId();
            console.log("Current Tab ID:", currentTabId);
            const authToken = await getAuthTokenFromLocalStorage(currentTabId as string);
            if (!authToken) {
                logout(undefined);
                new Error("No valid access token found in localstorage. User must login manually.");
            }

            console.log("trying to convert dis", authToken);
            const token = JSON.parse(authToken as string);

            // Check if token has expired:
            const expired = checkIfExpired(token.expiry_date);

            if (!expired) {
                console.log("token isn't expired, so FE should just keep on using new one for now!");
                sendResponse({ token });
                return;
            }
            console.log("token expired. fetching new one via refresh token:");

            // Else, goes gets one with refresh token, else asks user to login.
            const userEmail = appendUserJWTInfo(token).email ?? "";
            const refreshToken = await getRefreshTokenFromLocalStorage(userEmail);
            const newToken = await renewAccessToken(refreshToken as string);

            if (!newToken) {
                console.error("Invalid access token returned when trying to fetch one with refresh token.");
                return;
            } else {
                // store oauth response token into chrome.storage PER BROWSER TAB with tabId as key:
                storeOAuthToken(appendUserJWTInfo(JSON.parse(newToken) as Token));
            }
        };

        fetchAccessToken().catch(e => {
            console.log(e);
            sendResponse(null);
        });
        return true;
    }
});
