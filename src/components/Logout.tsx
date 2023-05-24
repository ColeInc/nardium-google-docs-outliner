import React, { FC, useContext } from "react";
import DocumentContext from "../context/document-context";
import { DocumentInfo } from "../models";

const Logout: FC = () => {
    const documentCtx = useContext(DocumentContext);
    const token = documentCtx.documentDetails?.token;

    const handleGoogleLogout = async () => {
        chrome.runtime.sendMessage({ type: "logoutUser", token }, () => {
            documentCtx.updateDocumentDetails({ token: "", isLoggedIn: false } as DocumentInfo); // remove token from our UserProvider
        });
    };

    return (
        <div className="logout-button">
            <button onClick={handleGoogleLogout}>Log out</button>
        </div>
    );
};

export default Logout;
