import { useContext } from "react";
import DocumentContext from "../context/document-context";
import LoadingContext from "../context/loading-context";
import { filterDocumentContent } from "../helpers/filterDocumentContent";
import { generateHeadingsHierarchy } from "../helpers/generateHeadingsHierarchy";
import { AccessToken } from "../models";
import { useHeadingsDifference } from "./useHeadingsDifference";
import { fetchCurrentTabGoogleAccount } from "../helpers/fetchCurrentTabGoogleAccount";
import { UnfilteredBody } from "../models/body";
import { useLogoutUser } from "./useLogoutUser";
import { extractGoogleDocId } from "../helpers/extractGoogleDocId";
import { authenticateFirstTimeUser } from "../helpers/authenticateFirstTimeUser";

const fetchAccessTokenV2 = async (documentCtx: any, loadingCtx: any, userEmail: string) => {
    return new Promise<AccessToken | null>((resolve) => {
        // const userEmail = documentCtx.documentDetails.email;
        console.log("cole sending dis email to background.ts", userEmail)

        // const sendChromeMessage = (type: string, interactive = true) => {
        chrome.runtime.sendMessage({ type: "fetchAccessToken", email: userEmail, interactive: true }, (response: { token: AccessToken } | undefined) => {
            console.log("cole exact response back from fetchAccessToken at useAttemptLogin.ts from background.ts", response)
            if (response && response.token) {
                try {
                    documentCtx.updateDocumentDetails({
                        isLoggedIn: true,
                        token: response.token.access_token,
                        userId: response.token.userId,
                        email: response.token.email,
                        hasClickedLogin: false,
                    });
                    resolve(response.token);
                } catch (error) {
                    console.log("failed while processing authorization response: ", error);
                    resolve(null);
                }
            } else {
                documentCtx.updateDocumentDetails({ isLoggedIn: false });
                loadingCtx.updateLoadingState({ loginLoading: false });
                resolve(null);
            }
        });
    });
}

const fetchFileContentsV2 = async (documentId: string, token: string) => {
    // const documentId = await getDocumentId();

    if (token && documentId) {
        return fetch("https://docs.googleapis.com/v1/documents/" + documentId, {
            method: "GET",
            headers: new Headers({ Authorization: "Bearer " + token }),
        })
            .then(res => {
                return res.json().then(response => {
                    if (res.status === 401) {
                        throw new Error("UNAUTHENTICATED");
                    } else if (response.error) {
                        throw new Error(JSON.stringify(response.error));
                    }
                    return response;
                });
            })
            .then(contents => {
                return contents as UnfilteredBody;
            })
            .catch(error => {
                console.log("Error while fetching:", error);
            });
    } else {
        console.log("failed to fetch google doc api data. no token or documentId found")
        throw new Error("No token or documentId found");
    }
}



export const useAttemptLogin = () => {
    const documentCtx = useContext(DocumentContext);
    const loadingCtx = useContext(LoadingContext);

    const { checkHeadingsDifference } = useHeadingsDifference();
    const { logoutUser } = useLogoutUser();

    const checkDocumentDifferences = async (
        accessToken: string,
    ) => {

        console.log("yyy document we're checking differences for!", documentCtx.documentDetails.documentId)
        const documentId = extractGoogleDocId();
        console.log("yyy v2 cole got dis documentId @ useAttemptLogin.ts", documentId)

        if (!documentId) {
            const error = new Error("Document ID not found! Very bad!");
            console.error(error);
            throw error;
        }
        documentCtx.updateDocumentDetails({ documentId });

        console.log("Fetching document contents...");
        // const fileContents = await fetchFileContentsV2(documentCtx.documentDetails.documentId, accessToken);
        const fileContents = await fetchFileContentsV2(documentId, accessToken);
        console.log("Document contents fetch status:", !!fileContents);

        if (!fileContents) {
            console.error("Failed to fetch document contents");
            return new Error("Document content was not able to be fetched :(");
        }

        console.log("Checking for heading differences...");
        const hasChanges = checkHeadingsDifference(fileContents);
        console.log("Heading changes detected:", hasChanges);

        if (!hasChanges) {
            console.log("No heading changes found, updating loading state and returning");
            loadingCtx.updateLoadingState({ loginLoading: false });
            return;
        }

        console.log("Processing document content...");
        const filteredHeadings = filterDocumentContent(fileContents);
        console.log("Filtered headings count:", filteredHeadings.length);

        console.log("Generating headings hierarchy...");
        const headingsHierarchy = await generateHeadingsHierarchy(filteredHeadings);
        console.log("Headings hierarchy generated successfully");

        // check if current tab's documentId is the same as the documentId in the documentCtx
        // const currentTabDocumentId = await getDocumentId();
        // console.log("xxx api call document id vs. current tab's documentId", documentId, currentTabDocumentId)

        // if (documentId !== currentTabDocumentId) {
        //     console.log("Document ID doesn't match one we made request for, not updating document state.");
        //     return;
        // }

        console.log("Updating document context with new hierarchy...");
        documentCtx.updateDocumentDetails({ documentContent: headingsHierarchy });
    }

    const attemptToLoginUser = async () => {
        try {
            console.log("Starting attemptToLoginUser process...");

            // Check for user email
            console.log("Fetching current tab Google account...");
            const userEmail = fetchCurrentTabGoogleAccount();
            // const documentId = await getDocumentId();
            console.log("Current user email:", userEmail);

            const tokenKey = `fe-to-be-auth-token-${userEmail}`;
            console.log("Generated token key:", tokenKey);

            console.log("Checking chrome.storage.local for FE-to-BE token...");
            const FEtoBEToken = await new Promise<string>((resolve, reject) => {
                chrome.storage.local.get(tokenKey, (result) => {
                    console.log(`Storage response for ${tokenKey}:`, result);
                    if (chrome.runtime.lastError) {
                        console.error("Chrome storage error:", chrome.runtime.lastError);
                        reject(chrome.runtime.lastError);
                    } else {
                        console.log("FE-to-BE token found:", !!result[tokenKey]);
                        resolve(result[tokenKey]);
                    }
                });
            });

            // no fe-to-be token found, treat user as brand new
            if (!FEtoBEToken) {
                console.log("No FE-to-BE token found, calling authenticateUser at background.ts");
                // throw new Error("No FE-to-BE token found");
                const loginResponse = await authenticateFirstTimeUser();
                // if response is successful, means fe-to-be token was created successfully, so try calling this function again, then return.
                if (loginResponse) {
                    console.log("calling attemptToLoginUser...")
                    await attemptToLoginUser();
                }
                return;
            }

            console.log("Attempting to fetch access token...");
            const accessToken = await fetchAccessTokenV2(documentCtx, loadingCtx, userEmail);
            console.log("Access token fetch result:", !!accessToken);

            if (!accessToken) {
                console.log("No access token received, returning early");
                throw new Error("No access token received");
            }

            await checkDocumentDifferences(accessToken.access_token);

            console.log("Finishing login process, setting loading state to false");
            loadingCtx.updateLoadingState({ loginLoading: false });

        } catch (error) {
            console.error("attemptToLoginUser failed with error:", error);
            documentCtx.clearDocumentDetails();
            loadingCtx.updateLoadingState({ loginLoading: false });
            logoutUser();
            return false;
        }
    }

    return { attemptToLoginUser, checkDocumentDifferences };
}; 