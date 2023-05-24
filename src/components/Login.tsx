import React, { FC, useContext, useEffect } from "react";
import DocumentContext from "../context/document-context";
import { DocumentInfo } from "../models";
import Logout from "./Logout";
import "./Login.css";
interface LoginProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: FC<LoginProps> = ({ setIsLoading }) => {
    const documentCtx = useContext(DocumentContext);

    // attempt to log user in on page load:
    useEffect(() => {
        handleLogin();
    }, []);

    const handleLogin = () => {
        // TODO: convert this response into valid type once we have final user object shape:
        chrome.runtime.sendMessage({ type: "getAuthToken" }, (response: any) => {
            console.log("RESP TO CONVERT TO TYPESCRIPT", JSON.stringify(response));
            if (response) {
                // console.log("repsonse fetched back at content.js", response);
                documentCtx.updateDocumentDetails({ isLoggedIn: true, token: response.token } as DocumentInfo);
            } else {
                console.error("Invalid response back from chrome Login background.js function");
                documentCtx.updateDocumentDetails({ isLoggedIn: false } as DocumentInfo);
            }
        });
        // next line is for testing only:
        // // // documentCtx.updateDocumentDetails({ isLoggedIn: true } as DocumentInfo);
        setIsLoading(false);
    };

    return (
        <div className="login-container">
            <button className="login-button" onClick={handleLogin}>
                LOGIN
            </button>
        </div>
    );
};

export default Login;
