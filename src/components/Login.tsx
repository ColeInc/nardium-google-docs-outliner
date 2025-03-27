import React, { FC, useContext } from "react";
import { useMixPanelAnalytics } from "../hooks/useMixPanelAnalytics";
import { useFetchAccessToken } from "../hooks/useFetchAccessToken";
import GoogleLogo from "../../public/assets/google-logo.svg";
import DocumentContext from "../context/document-context";
import LoadingContext from "../context/loading-context";
import "./Login.css";
import { useAttemptLogin } from "../hooks/useAttemptLogin";
import { AccessToken } from "../models";

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
    const attemptToLoginUser = useAttemptLogin();

    // Attempt to log user in on page load:
    // useEffect(() => {
    //     console.log("cole trig Login.tsx attempt to login user")
    //     if (isFirstRender.current) {
    //         fetchAccessToken().then(() => {
    //             identifyUser();
    //             isFirstRender.current = false;
    //         });
    //     }
    // }, []);

    const initialLogin = () => {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ type: "authenticateUser", interactive: true }, (response: AccessToken | undefined) => {
                response ? resolve(response) : reject(new Error("Invalid response from background.js"));
            });
        });
    };

    const handleLogin = async () => {
        try {
            documentCtx.updateDocumentDetails({ hasClickedLogin: true });
            updateLoadingState({ loginLoading: true });
            mixPanelAnalyticsClick("Login Button");

            const loginResponse = await initialLogin(); // Wait for the login response
            if (loginResponse) {
                await attemptToLoginUser();
            }

            updateLoadingState({ loginLoading: false });
        } catch (error) {
            documentCtx.updateDocumentDetails({ isLoggedIn: false });
            console.error("Login failed:", error);
        } finally {
            updateLoadingState({ loginLoading: false });
        }
    };

    // const sendChromeMessage = (type: string, interactive = true) => {
    //     chrome.runtime.sendMessage({ type, interactive }, (response: AccessToken | undefined) => {
    //         // console.log("raw resp FRONTEND", response);

    //         if (response && response.access_token) {
    //             try {
    //                 documentCtx.updateDocumentDetails({
    //                     isLoggedIn: true,
    //                     token: response.access_token,
    //                     email: response.email,
    //                     userId: response.userId,
    //                     hasClickedLogin: false,
    //                 });
    //             } catch (error) {
    //                 console.log("failed while processing authorization response: ", error);
    //             }
    //         } else {
    //             // console.log("Error while logging in. Invalid response back from background.js. Please refresh page and try again");
    //             documentCtx.updateDocumentDetails({ isLoggedIn: false });
    //             updateLoadingState({ loginLoading: false });
    //         }
    //     });
    // };

    return (
        <>
            {!isLoading && (
                <div className="login-container">
                    <button className="login-button" onClick={handleLogin}>
                        <GoogleLogo />
                        <p>Sign in with Google</p>
                    </button>
                    {/* <button className="login-button" onClick={fetchAccessToken}>
                        <p>Refresh Token</p>
                    </button> */}
                </div>
            )}
        </>
    );
};

export default Login;
