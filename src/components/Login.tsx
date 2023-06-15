import React, { FC, useContext, useEffect } from "react";
import { useMixPanelAnalytics } from "../hooks/useMixPanelAnalytics";
import GoogleLogo from "../../public/assets/google-logo.svg";
import DocumentContext from "../context/document-context";
import LoadingContext from "../context/loading-context";
import { DocumentInfo } from "../models";
import "./Login.css";

interface LoginProps {
    isLoading: boolean;
    isFirstRender: React.MutableRefObject<boolean>;
}

interface AuthTokenResponse {
    token: string;
}

interface ChromeProfileUserInfo {
    email: string;
    id: string;
}

const Login: FC<LoginProps> = ({ isLoading, isFirstRender }) => {
    const documentCtx = useContext(DocumentContext);
    const loadingCtx = useContext(LoadingContext);
    const { updateLoadingState } = loadingCtx;

    const { identifyUser, mixPanelAnalyticsClick } = useMixPanelAnalytics();

    // attempt to log user in on page load:
    useEffect(() => {
        if (isFirstRender.current) {
            checkLoggedIn();
            identifyUser();
            isFirstRender.current = false;
        }
    }, []);

    // check if user is logged in without explicitly showing window prompt to login again:
    const checkLoggedIn = () => {
        updateLoadingState({ loginLoading: true }); // as soon as user clicks login, show loading spinner until either success or fail happens
        sendChromeMessage("isLoggedIn");
    };

    const handleLogin = () => {
        documentCtx.updateDocumentDetails({ hasClickedLogin: true }); // update context to say that login button has been clicked

        updateLoadingState({ loginLoading: true }); // as soon as user clicks login, show loading spinner until either success or fail happens
        sendChromeMessage("getAuthToken");
        // TODO: next line is for testing only:
        // // // documentCtx.updateDocumentDetails({ isLoggedIn: true } );
        fetchLoggedInUserDetails();

        mixPanelAnalyticsClick("Login Button");
    };

    const sendChromeMessage = (type: string) => {
        chrome.runtime.sendMessage({ type }, (response: AuthTokenResponse | undefined) => {
            if (response && response.token) {
                documentCtx.updateDocumentDetails({
                    isLoggedIn: true,
                    token: response.token,
                    hasClickedLogin: false,
                });
            } else {
                console.log(
                    "Error while logging in. Invalid response back from background.js. Please refresh page and try again"
                );
                documentCtx.updateDocumentDetails({ isLoggedIn: false });
                updateLoadingState({ loginLoading: false });
            }
        });
    };

    const fetchLoggedInUserDetails = () => {
        chrome.runtime.sendMessage({ type: "fetchUserDetails" }, (response: ChromeProfileUserInfo | undefined) => {
            if (response) {
                documentCtx.updateDocumentDetails({
                    email: response.email,
                    userId: response.id,
                });
            } else {
                console.log("Unable to fetch logged in user details.");
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
