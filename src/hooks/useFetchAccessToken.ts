import React, { useContext, useEffect, useRef } from "react";
import DocumentContext from "../context/document-context";
import LoadingContext from "../context/loading-context";
import { AuthTokenResponse } from "../models/token";
import { IDocumentContext } from "../models";
import { ILoadingContext } from "../models/loading";

export const useFetchAccessToken = () => {
    const documentCtx = useContext(DocumentContext);
    const loadingCtx = useContext(LoadingContext);
    // const { updateLoadingState } = loadingCtx;

    const documentCtxRef = useRef(documentCtx);
    const loadingCtxRef = useRef(loadingCtx);

    // Update the reference whenever documentCtx changes
    useEffect(() => {
        documentCtxRef.current = documentCtx;
        loadingCtxRef.current = loadingCtx;
    }, [documentCtx, loadingCtx]);

    // Have to have this wrapper function unfortunately, to pass in latest version of context, otherwise closure is formed on initial load if we try accessing straight from getAccessToken()
    const fetchAccessToken = async () => {
        getAccessToken(documentCtxRef, loadingCtxRef);
    };

    const getAccessToken = async (
        documentCtxRef: React.MutableRefObject<IDocumentContext>,
        loadingCtxRef: React.MutableRefObject<ILoadingContext>
    ) => {
        // Access the updated documentCtx using the useRef. Must to do this because referencing the original one gave me a stale closure which only stored the original state of the ctx.
        const docCtx = documentCtxRef.current;
        const loadingCtx = loadingCtxRef.current;

        console.log("documentCtx.documentDetails @ fetchAccesstoken", docCtx.documentDetails);
        // if the "SIGN IN WITH GOOGLE" button is currently showing, then turn on the loading state as we make this call:
        if (!docCtx.documentDetails.isLoggedIn) {
            loadingCtx.updateLoadingState({ loginLoading: true });
        }

        chrome.runtime.sendMessage({ type: "fetchAccessToken" }, (response: AuthTokenResponse | undefined) => {
            // console.log("raw resp FRONTEND", response);

            if (response && response.token) {
                try {
                    docCtx.updateDocumentDetails({
                        isLoggedIn: true,
                        token: response.token.access_token,
                        email: response.token.email,
                        userId: response.token.userId,
                        hasClickedLogin: false,
                    });
                } catch (error) {
                    console.log("failed while processing authorization response: ", error);
                }
                console.log("has clicked login?", docCtx.documentDetails.hasClickedLogin);
                if (!docCtx.documentDetails.hasClickedLogin) {
                    console.log("cole setting login OFF here 1)");
                    loadingCtx.updateLoadingState({ loginLoading: false });
                }
            } else {
                // console.log("Error while logging in. Invalid response back from background.js. Please refresh page and try again");
                docCtx.updateDocumentDetails({ isLoggedIn: false });
                console.log("cole setting login OFF here 222)");
                // updateLoadingState({ loginLoading: false });
                console.log("has clicked login?", docCtx.documentDetails.hasClickedLogin);
                if (!docCtx.documentDetails.hasClickedLogin) {
                    loadingCtx.updateLoadingState({ loginLoading: false });
                }
            }
        });
    };

    return fetchAccessToken;
};
