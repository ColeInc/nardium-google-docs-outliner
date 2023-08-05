import React, { FC, useContext, useEffect } from "react";
import { useMixPanelAnalytics } from "../hooks/useMixPanelAnalytics";
import { useFetchAccessToken } from "../hooks/useFetchAccessToken";
import GoogleLogo from "../../public/assets/google-logo.svg";
import DocumentContext from "../context/document-context";
import LoadingContext from "../context/loading-context";
import "./Login.css";
import { AuthTokenResponse } from "../models/token";

interface LoginProps {
    isLoading: boolean;
    isFirstRender: React.MutableRefObject<boolean>;
}

export interface ChromeProfileUserInfo {
    email: string;
    id: string;
}

const Login: FC<LoginProps> = ({ isLoading, isFirstRender }) => {
    const documentCtx = useContext(DocumentContext);
    const loadingCtx = useContext(LoadingContext);
    const { updateLoadingState } = loadingCtx;

    const { identifyUser, mixPanelAnalyticsClick } = useMixPanelAnalytics();
    const fetchAccessToken = useFetchAccessToken();

    // Attempt to log user in on page load:
    useEffect(() => {
        if (isFirstRender.current) {
            fetchAccessToken().then(() => {
                identifyUser();
                isFirstRender.current = false;
            });
        }
    }, []);

    const handleLogin = () => {
        documentCtx.updateDocumentDetails({ hasClickedLogin: true }); // update context to say that login button has been clicked

        updateLoadingState({ loginLoading: true }); // as soon as user clicks login, show loading spinner until either success or fail happens
        sendChromeMessage("authenticateUser", true);

        mixPanelAnalyticsClick("Login Button");
    };

    const sendChromeMessage = (type: string, interactive = true) => {
        chrome.runtime.sendMessage({ type, interactive }, (response: AuthTokenResponse | undefined) => {
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
            } else {
                // console.log("Error while logging in. Invalid response back from background.js. Please refresh page and try again");
                documentCtx.updateDocumentDetails({ isLoggedIn: false });
                updateLoadingState({ loginLoading: false });
            }
        });
    };

    return (
        <>
            {!isLoading && (
                <div className="login-container">
                    <button className="login-button" onClick={handleLogin}>
                        <GoogleLogo />
                        <p>Sign in with Google</p>
                    </button>
                </div>
            )}
        </>
    );
};

export default Login;
