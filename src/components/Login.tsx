import React, { FC, useContext } from "react";
import DocumentContext from "../context/document-context";
import { DocumentInfo } from "../models";
import Logout from "./Logout";
import "./Login.css";

const Login: FC = () => {
    const userCtx = useContext(DocumentContext);

    const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // TODO: convert this response into valid type once we have final user object shape:
        chrome.runtime.sendMessage({ type: "getAuthToken" }, (response: any) => {
            if (response) {
                console.log("repsonse fetched back at content.js", response);
                userCtx.updateDocumentDetails({ token: response.token, isLoggedIn: true } as DocumentInfo);
            } else {
                userCtx.updateDocumentDetails({ isLoggedIn: false } as DocumentInfo);
            }
        });
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
