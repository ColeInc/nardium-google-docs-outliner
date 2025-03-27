import React, { useContext, useEffect } from "react";
import DocumentContext from "../context/document-context";
import LoadingContext from "../context/loading-context";
import { fetchFileContents } from "../helpers/fetchFileContents";
import { filterDocumentContent } from "../helpers/filterDocumentContent";
import { generateHeadingsHierarchy } from "../helpers/generateHeadingsHierarchy";
import { AccessToken, IDocumentContext } from "../models";
import { ILoadingContext } from "../models/loading";
import { useHeadingsDifference } from "./useHeadingsDifference";
import { useLogoutUser } from "./useLogoutUser";
import { useFetchAccessToken } from "./useFetchAccessToken";
import { fetchCurrentTabGoogleAccount } from "../helpers/fetchCurrentTabGoogleAccount";
import { getDocumentId } from "../helpers/getDocumentId";
import { UnfilteredBody } from "../models/body";

export const useInitialAppLoad = () => {
    const { checkHeadingsDifference } = useHeadingsDifference();
    const { logoutUser } = useLogoutUser();
    const fetchAccessToken = useFetchAccessToken();

    const documentCtx = useContext(DocumentContext);
    const loadingCtx = useContext(LoadingContext);
    // const { updateLoadingState } = loadingCtx;

    // const documentCtxRef = useRef(documentCtx);
    // const loadingCtxRef = useRef(loadingCtx);
    // const fetchAccessTokenRef = useRef<() => Promise<void>>(fetchAccessToken);

    // Update the reference whenever documentCtx changes
    // useEffect(() => {
    //     documentCtxRef.current = documentCtx;
    //     loadingCtxRef.current = loadingCtx;
    // }, [documentCtx, loadingCtx]);

    // // Update fetchAccessTokenRef when fetchAccessToken changes
    // useEffect(() => {
    //     fetchAccessTokenRef.current = fetchAccessToken;
    // }, [fetchAccessToken]);

    const refetch = async (
        documentId: string | null,
        documentCtxRef: React.MutableRefObject<IDocumentContext>,
        loadingCtxRef: React.MutableRefObject<ILoadingContext>,
        fetchNewAccessToken: React.MutableRefObject<() => Promise<void>>
    ) => {
        // Access the updated documentCtx using the useRef. Must to do this because referencing the original one gave me a stale closure which only stored the original state of the ctx.
        const docCtx = documentCtxRef.current;
        const loadingCtx = loadingCtxRef.current;

        console.log("cole data @ refetch", docCtx.documentDetails);

        // const fileContents = await fetchFileContents(documentId, documentCtxRef, loadingCtxRef, fetchAccessToken);
        console.log("fetching new file contents @ refetch")
        const fileContents = await fetchFileContents(documentId, documentCtxRef, loadingCtxRef, fetchNewAccessToken);
        console.log("FETCHED contents @ refetch:", fileContents)

        if (!fileContents) {
            return new Error("Document content was not able to be fetched.");
        }

        // send to function to check diff between prev/current fetched headings. if no difference then don't continue
        const hasChanges = checkHeadingsDifference(fileContents);

        // if no changes found then don't run entire calculation to render headings:
        if (!hasChanges) {
            loadingCtx.updateLoadingState({ loginLoading: false });
            return;
        }
        // if difference found, run entire filterDocumentContent
        const filteredHeadings = filterDocumentContent(fileContents);

        // generateHeadingsHierarchy & render it out
        const headingsHierarchy = await generateHeadingsHierarchy(filteredHeadings);
        docCtx.updateDocumentDetails({ documentContent: headingsHierarchy });

        loadingCtx.updateLoadingState({ loginLoading: false });
    };

    // Main onLoad steps:
    useEffect(() => {
        attemptToLoginUser();
        // const onLoad = async () => {
        //     try {
        //         const documentId = await getDocumentId();
        //         // const documentId = "testing";

        //         if (!documentId) {
        //             await logoutUser();
        //             // return;
        //         } else {
        //             documentCtx.updateDocumentDetails({ documentId });
        //         }

        //         await refetch(documentId, documentCtxRef, loadingCtxRef, fetchAccessTokenRef);

        //         // Every 5 secs check headings data for new changes:
        //         const interval = setInterval(async () => {
        //             console.log("cole trig refetch()")
        //             refetch(documentId, documentCtxRef, loadingCtxRef, fetchAccessTokenRef);
        //         }, 5000);

        //         return () => clearInterval(interval);
        //     } catch (error) {
        //         // updateLoadingState({ loginLoading: false });
        //         console.log("onLoad Error:", error);
        //     }
        // };

        // onLoad().catch(e => {
        //     console.log(e);
        // });
    }, []);

    const fetchAccessTokenV2 = async () => {
        return new Promise<string | null>((resolve) => {
            const sendChromeMessage = (type: string, interactive = true) => {
                chrome.runtime.sendMessage({ type, interactive }, (response: AccessToken | undefined) => {
                    // console.log("raw resp FRONTEND", response);

                    if (response && response.access_token) {
                        try {
                            documentCtx.updateDocumentDetails({
                                isLoggedIn: true,
                                token: response.access_token,
                                email: response.email,
                                userId: response.userId,
                                hasClickedLogin: false,
                            });
                            resolve(response.access_token);
                        } catch (error) {
                            console.log("failed while processing authorization response: ", error);
                            resolve(null);
                        }
                    } else {
                        // console.log("Error while logging in. Invalid response back from background.js. Please refresh page and try again");
                        documentCtx.updateDocumentDetails({ isLoggedIn: false });
                        loadingCtx.updateLoadingState({ loginLoading: false });
                        resolve(null);
                    }
                });
            };
            sendChromeMessage("fetchAccessToken");
        });
    }

    const fetchFileContentsV2 = async (token: string) => {
        const documentId = await getDocumentId();

        if (token && documentId) {
            // const token = "ya29.a0AWY7CkluOwa2uyHj2ETZ2GvCuznYyKPXTRsRLIZRO8aieAigBlPbfwrghseGUNs-w3KcW5DqBWLRyuqnPg2jgwJN2u1rQjsIN6iegTF_yYGSZjHSEMwMR0T3yAiVjy4YJ43_9mnqJKhk_FBHjFvwDy_Jpr_AtwaCgYKAYsSARMSFQG1tDrpK6yl6HCz-w2wIPGps_qoPQ0165";

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
                    // console.log("docs API call response (content)", contents);
                    // setRetryCount(0);
                    return contents as UnfilteredBody;
                })
                .catch(error => {
                    console.log("Error while fetching:", error);

                    // if (error.message === "UNAUTHENTICATED") {
                    //     // setUserLoggedOut();
                    // } else {
                    //     checkErrorCount();
                    // }
                    // return checkErrorCount().then(() => undefined);
                });
        } else {
            // return checkErrorCount().then(() => undefined);
            console.log("failed to fetch google doc api data")
        }
    }


    const attemptToLoginUser = async () => {
        try {
            // Check if user has a token stored in chrome.storage.local
            const userEmail = fetchCurrentTabGoogleAccount();
            const tokenKey = `fe-to-be-token-${userEmail}`;
            const FEtoBEToken = await new Promise<string>((resolve, reject) => {
                chrome.storage.local.get(tokenKey, (result) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(result[tokenKey]);
                    }
                });
            });

            // if no fe-to-be-token exists it means response from /auth/callback hasn't arrived yet, so return early.
            if (!FEtoBEToken) {
                console.log(`No access token found in local storage for user: ${userEmail}`);
                return null;
            }

            // if fe-to-be-token exists, then attempt to fetch access token:
            const accessToken = await fetchAccessTokenV2();

            // if no response from fetchAccessTokenV2, then return early:
            if (!accessToken) {
                console.log("No access token found in local storage for user: ", userEmail);
                return;
            }

            // If successfully fetched access token, fetch document data:
            const fileContents = await fetchFileContentsV2(accessToken);
            console.log("FETCHED contents @ refetch:", fileContents)

            if (!fileContents) {
                return new Error("Document content was not able to be fetched :(");
            }

            // send to function to check diff between prev/current fetched headings. if no difference then don't continue
            const hasChanges = checkHeadingsDifference(fileContents);

            // if no changes found then don't run entire calculation to render headings:
            if (!hasChanges) {
                loadingCtx.updateLoadingState({ loginLoading: false });
                return;
            }
            // if difference found, run entire filterDocumentContent
            const filteredHeadings = filterDocumentContent(fileContents);

            // generateHeadingsHierarchy & render it out
            const headingsHierarchy = await generateHeadingsHierarchy(filteredHeadings);
            documentCtx.updateDocumentDetails({ documentContent: headingsHierarchy });

            loadingCtx.updateLoadingState({ loginLoading: false });



        } catch (error) {
            console.error("Error checking for stored token:", error);
            return false;
        }
    }


};
