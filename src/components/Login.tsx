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
        // console.log("triggers handleLogin");
        handleLogin();
    }, []);

    const handleLogin = () => {
        // TODO: convert this response into valid type once we have final user object shape:
        chrome.runtime.sendMessage({ type: "getAuthToken" }, (response: any) => {
            if (response) {
                console.log("repsonse fetched back at content.js", response);
                documentCtx.updateDocumentDetails({ isLoggedIn: true, token: response.token } as DocumentInfo);
            } else {
                console.log("Invalid response back from chrome Login background.js function");
                documentCtx.updateDocumentDetails({ isLoggedIn: false } as DocumentInfo);
            }
        });
        // // // documentCtx.updateDocumentDetails({ isLoggedIn: true } as DocumentInfo);
        setIsLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-button">
                <button onClick={handleLogin}>Login</button>
            </div>
            <Logout />
        </div>
    );
};

export default Login;
