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

    // chrome.runtime.onMessage.addListener((response: AuthTokenResponse | undefined) => {
    //     console.log("raw resp FRONTEND vvvv2", response);

    //     // if (event.data.type === "auth") {
    //     if (response && response.token) {
    //         console.log("WE FOUND IT", response.token);
    //     } else {
    //         console.log("Failed to fetch Authentication Code from OAUTH. Please try again.");
    //         // }
    //     }
    // });

    // check if user is logged in without explicitly showing window prompt to login again:
    const checkLoggedIn = () => {
        console.log("trig checkLoggedIn");

        updateLoadingState({ loginLoading: true }); // as soon as user clicks login, show loading spinner until either success or fail happens
        sendChromeMessage("isLoggedIn");
    };

    const handleLogin = () => {
        documentCtx.updateDocumentDetails({ hasClickedLogin: true }); // update context to say that login button has been clicked

        updateLoadingState({ loginLoading: true }); // as soon as user clicks login, show loading spinner until either success or fail happens
        sendChromeMessagev2("getAuthToken");
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

    const sendChromeMessagev2 = async (type: string): Promise<string | null> => {
        try {
            const authCode = await new Promise<string>((resolve, reject) => {
                chrome.runtime.sendMessage({ type }, (response: AuthTokenResponse | undefined) => {
                    console.log("raw resp FRONTEND", response);
                    if (response && response.token) {
                        console.log("CODE BACK AND FRONTEND?", response.token);

                        documentCtx.updateDocumentDetails({
                            isLoggedIn: true,
                            token: response.token,
                            hasClickedLogin: false,
                        });
                        resolve(response.token);
                    } else {
                        console.log(
                            "Error while logging in. Invalid response back from background.js. Please refresh page and try again"
                        );
                        documentCtx.updateDocumentDetails({ isLoggedIn: false });
                        updateLoadingState({ loginLoading: false });
                        reject(new Error("No oauth auth code found :("));
                    }
                });
            });

            // // const authCode2 = await new Promise<string>((resolve, reject) => {
            // //     // Add a listener to receive the final token from background.js
            // //     chrome.runtime.onMessage.addListener((response: AuthTokenResponse | undefined) => {
            // //         console.log("raw resp FRONTEND vvvv2", response);

            // //         // if (event.data.type === "auth") {
            // //         if (response && response.token) {
            // //             resolve(response.token);
            // //         } else {
            // //             reject(new Error("Failed to fetch Authentication Code from OAUTH. Please try again."));
            // //             // }
            // //         }
            // //     });
            // // });

            console.log("cole returning final authCode:", authCode);
            // console.log("cole returning final authCode v2:", authCode2);
            return authCode;
        } catch (e) {
            console.log("Failed to fetch Document ID.");
            return null;
        }
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
