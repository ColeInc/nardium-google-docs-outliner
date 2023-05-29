import React, { useContext } from "react";
import DocumentContext from "../context/document-context";
import { DocumentInfo } from "../models";

export const useLogoutUser = () => {
    const documentCtx = useContext(DocumentContext);
    const token = documentCtx.documentDetails?.token;

    const logoutUser = async () => {
        chrome.runtime.sendMessage({ type: "logoutUser", token }, () => {
            documentCtx.updateDocumentDetails({ token: "", isLoggedIn: false } as DocumentInfo); // remove token from our UserProvider
        });
    };

    return { logoutUser };
};
