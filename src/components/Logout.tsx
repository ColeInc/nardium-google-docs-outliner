import React, { FC, useContext } from "react";
import DocumentContext from "../context/document-context";
import { DocumentInfo } from "../models";
import { useLogoutUser } from "../hooks/useLogoutUser";

const Logout: FC = () => {
    // const documentCtx = useContext(DocumentContext);
    // const token = documentCtx.documentDetails?.token;
    const { logoutUser } = useLogoutUser();

    const handleLogout = async () => {
        // console.log("logging out user");
        // chrome.runtime.sendMessage({ type: "logoutUser", token }, () => {
        //     documentCtx.updateDocumentDetails({ token: "", isLoggedIn: false } as DocumentInfo); // remove token from our UserProvider
        //     console.log("logging out successful");
        // });
        await logoutUser();
    };

    return (
        <div className="logout-button">
            <button onClick={handleLogout}>Log out</button>
        </div>
    );
};

export default Logout;
