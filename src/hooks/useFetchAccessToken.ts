import React, { useContext, useEffect, useRef } from "react";
import DocumentContext from "../context/document-context";
import LoadingContext from "../context/loading-context";
import { IDocumentContext } from "../models";
import { ILoadingContext } from "../models/loading";
import { fetchCurrentTabGoogleAccount } from "../helpers/fetchCurrentTabGoogleAccount";
import { AuthTokenResponse } from "../models/auth";

export const useFetchAccessToken = () => {
    console.log("cole starting useFetchAccessToken...")
    const documentCtx = useContext(DocumentContext);
    const loadingCtx = useContext(LoadingContext);
    const documentCtxRef = useRef(documentCtx);
    const loadingCtxRef = useRef(loadingCtx);

    // Update the reference whenever documentCtx changes
    useEffect(() => {
        documentCtxRef.current = documentCtx;
        loadingCtxRef.current = loadingCtx;
    }, [documentCtx, loadingCtx]);

    // Have to have this wrapper function unfortunately, to pass in latest version of context, otherwise closure is formed on initial load if we try accessing straight from getAccessToken()
    const fetchAccessToken = async () => {
        console.log("cole starting useFetchAccessToken...")
        getAccessToken(documentCtxRef, loadingCtxRef);
    };

    const getAccessToken = async (
        documentCtxRef: React.MutableRefObject<IDocumentContext>,
        loadingCtxRef: React.MutableRefObject<ILoadingContext>
    ) => {
        console.log("cole starting useFetchAccessToken 2...")
        // Access the updated documentCtx using the useRef. Must to do this because referencing the original one gave me a stale closure which only stored the original state of the ctx.
        const docCtx = documentCtxRef.current;
        const loadingCtx = loadingCtxRef.current;

        // if the "SIGN IN WITH GOOGLE" button is currently showing, then turn on the loading state as we make this call:
        if (!docCtx.documentDetails.isLoggedIn) {
            loadingCtx.updateLoadingState({ loginLoading: true });
        }

        const userEmail = fetchCurrentTabGoogleAccount();
        console.log("cole userEmail", userEmail)
        chrome.runtime.sendMessage(
            { type: "fetchAccessToken", email: userEmail },
            (response: AuthTokenResponse | undefined) => {
            // (response: any | undefined) => {
                console.log("gets this access token back at content.js from background.ts", response)
                // console.log("raw resp FRONTEND", response);
                console.log("xxx response && response.token.access_token,", response, response?.token.access_token)  
                // console.log("xxx where is the token where is the token,", response.token,response?.token.access_token,response.acces_token)
                if (response && response.token.access_token) {
                    try {
                        docCtx.updateDocumentDetails({
                            isLoggedIn: true,
                            token: response.token.access_token,
                            email: response.token.email ?? "",
                            userId: response.token.userId ?? "",
                            hasClickedLogin: false,
                        });
                        console.log("cole successfully updated document details state!")
                    } catch (error) {
                        console.log("failed while processing authorization response: ", error);
                    }
                    if (!docCtx.documentDetails.hasClickedLogin) {
                        // loadingCtx.updateLoadingState({ loginLoading: false }); // disabling this because we assume that the one after generateHeadingsHierarchy() will set loading to false at the correct time.
                    }
                } else {
                    console.log("Error while logging in. Invalid response back from background.js. Please refresh page and try again");
                    // cole reenable this:
                    // docCtx.updateDocumentDetails({ isLoggedIn: false });
                    // if (!docCtx.documentDetails.hasClickedLogin) {
                    //     loadingCtx.updateLoadingState({ loginLoading: false });
                    // }
                }
            }
        );
    };

    return fetchAccessToken;
};
