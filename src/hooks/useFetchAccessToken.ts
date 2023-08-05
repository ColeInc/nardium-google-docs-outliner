import React, { useContext } from "react";
import { AuthTokenResponse, ChromeProfileUserInfo } from "../components/Login";
import DocumentContext from "../context/document-context";
import LoadingContext from "../context/loading-context";

export const useFetchAccessToken = () => {
    const documentCtx = useContext(DocumentContext);
    const loadingCtx = useContext(LoadingContext);
    const { updateLoadingState } = loadingCtx;

    const fetchAccessToken = async () => {
        console.log("trig fetchAccessTOken");

        // if the "SIGN IN WITH GOOGLE" button is currently showing, then turn on the loading state as we make this call:
        if (!documentCtx.documentDetails.isLoggedIn) {
            updateLoadingState({ loginLoading: true });
        }

        chrome.runtime.sendMessage({ type: "fetchAccessToken" }, (response: AuthTokenResponse | undefined) => {
            console.log("raw resp FRONTEND", response);
            if (response && response.token) {
                try {
                    documentCtx.updateDocumentDetails({
                        isLoggedIn: true,
                        token: response.token.access_token,
                        email: response.token.email,
                        userId: response.token.userId,
                        hasClickedLogin: false,
                    });

                    // fetchLoggedInUserDetails();
                } catch (error) {
                    console.log("failed while processing authorization response: ", error);
                }
                updateLoadingState({ loginLoading: false });
            } else {
                console.log(
                    "Error while logging in. Invalid response back from background.js. Please refresh page and try again"
                );
                documentCtx.updateDocumentDetails({ isLoggedIn: false });
                updateLoadingState({ loginLoading: false });
            }
        });
    };

    // const fetchLoggedInUserDetails = () => {
    //     console.log("fetching user email details");
    //     chrome.runtime.sendMessage({ type: "fetchUserDetails" }, (response: ChromeProfileUserInfo | undefined) => {
    //         if (response) {
    //             console.log("user details resp", response);
    //             documentCtx.updateDocumentDetails({
    //                 email: response.email,
    //                 userId: response.id,
    //             });
    //         } else {
    //             console.log("Unable to fetch logged in user details.");
    //         }
    //     });
    // };

    return fetchAccessToken;
};
