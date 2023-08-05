import React, { useContext } from "react";
import DocumentContext from "../context/document-context";
import LoadingContext from "../context/loading-context";
import { AuthTokenResponse } from "../models/token";

export const useFetchAccessToken = () => {
    const documentCtx = useContext(DocumentContext);
    const loadingCtx = useContext(LoadingContext);
    const { updateLoadingState } = loadingCtx;

    const fetchAccessToken = async () => {
        // if the "SIGN IN WITH GOOGLE" button is currently showing, then turn on the loading state as we make this call:
        if (!documentCtx.documentDetails.isLoggedIn) {
            updateLoadingState({ loginLoading: true });
        }

        chrome.runtime.sendMessage({ type: "fetchAccessToken" }, (response: AuthTokenResponse | undefined) => {
            // console.log("raw resp FRONTEND", response);

            if (response && response.token) {
                try {
                    documentCtx.updateDocumentDetails({
                        isLoggedIn: true,
                        token: response.token.access_token,
                        email: response.token.email,
                        userId: response.token.userId,
                        hasClickedLogin: false,
                    });
                } catch (error) {
                    console.log("failed while processing authorization response: ", error);
                }
                updateLoadingState({ loginLoading: false });
            } else {
                // console.log("Error while logging in. Invalid response back from background.js. Please refresh page and try again");
                documentCtx.updateDocumentDetails({ isLoggedIn: false });
                updateLoadingState({ loginLoading: false });
            }
        });
    };

    return fetchAccessToken;
};
