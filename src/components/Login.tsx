import React, { FC, useContext, useEffect, useRef } from "react";
import DocumentContext from "../context/document-context";
import { DocumentInfo } from "../models";
import "./Login.css";
import LoadingContext from "../context/loading-context";
interface LoginProps {
    isLoading: boolean;
    // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isFirstRender: React.MutableRefObject<boolean>;
}

interface AuthTokenResponse {
    token: string;
}

const Login: FC<LoginProps> = ({ isLoading, isFirstRender }) => {
    const documentCtx = useContext(DocumentContext);
    const loadingCtx = useContext(LoadingContext);
    const { updateLoadingState } = loadingCtx;

    // attempt to log user in on page load:
    useEffect(() => {
        if (isFirstRender.current) {
            // handleLogin();
            console.log("ONLOAD checking if user is logged in");
            checkLoggedIn();
            isFirstRender.current = false;
        }
    }, []);

    // check if user is logged in without explicitly showing window prompt to login again:
    const checkLoggedIn = () => {
        chrome.runtime.sendMessage({ type: "isLoggedIn" }, (response: boolean) => {
            console.log("checkLoggedIn resp:", response);
            if (response) {
                documentCtx.updateDocumentDetails({ isLoggedIn: true } as DocumentInfo);
            } else {
                documentCtx.updateDocumentDetails({ isLoggedIn: false } as DocumentInfo);
            }
            // setIsLoading(false);
            updateLoadingState({ loginLoading: false });
        });
    };

    const handleLogin = () => {
        // setIsLoading(true); // as soon as user clicks login, show loading spinner until either success or fail happens
        updateLoadingState({ loginLoading: true }); // as soon as user clicks login, show loading spinner until either success or fail happens

        // TODO: convert this response into valid type once we have final user object shape:
        chrome.runtime.sendMessage({ type: "getAuthToken" }, (response: AuthTokenResponse | undefined) => {
            // console.log("RESP TO CONVERT TO TYPESCRIPT", JSON.stringify(response));
            if (response) {
                // console.log("repsonse fetched back at content.js", response);
                console.log("setting isLoggedIn: true");
                documentCtx.updateDocumentDetails({ isLoggedIn: true, token: response.token } as DocumentInfo);
            } else {
                console.error("Invalid response back from chrome Login background.js function");
                documentCtx.updateDocumentDetails({ isLoggedIn: false } as DocumentInfo);
            }
            // setIsLoading(false);
        });
        // next line is for testing only:
        // // // documentCtx.updateDocumentDetails({ isLoggedIn: true } as DocumentInfo);
    };

    return (
        <>
            {!isLoading && (
                <div className="login-container">
                    <button className="login-button" onClick={handleLogin}>
                        LOGIN
                    </button>
                </div>
            )}
        </>
    );
};

export default Login;
