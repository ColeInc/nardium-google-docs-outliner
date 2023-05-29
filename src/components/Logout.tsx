import React, { FC, useContext } from "react";
import { useLogoutUser } from "../hooks/useLogoutUser";
import "./Logout.css";
import DocumentContext from "../context/document-context";
import { DocumentInfo } from "../models";

const Logout: FC = () => {
    const { logoutUser } = useLogoutUser();
    const documentCtx = useContext(DocumentContext);

    const handleLogout = async () => {
        await logoutUser();
        // clear stored document content:
        documentCtx.updateDocumentDetails({ documentContent: "" } as DocumentInfo);
        return;
    };

    return (
        <button className="logout-button" onClick={handleLogout}>
            Log out
        </button>
    );
};

export default Logout;
