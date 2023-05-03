// import { CodeResponse, googleLogout } from "@react-oauth/google";
import React, { FC, useContext } from "react";
import DocumentContext from "../context/document-context";
import { DocumentInfo } from "../models";

// import { gapi } from "gapi-script";

// const clientId = process.env.REACT_CLIENT_ID || "";

// const onSuccess = () => {
//     console.log("Logout was Successful.");
// };

// interface LogoutProps {
//     setUserAuth: (authDetails: CodeResponse | undefined) => void;
// }

const Logout: FC = () => {
    const userCtx = useContext(DocumentContext);
    const token = userCtx.documentDetails?.token;

    const handleGoogleLogout = async () => {
        chrome.runtime.sendMessage({ type: "logoutUser", token }, (response: any) => {
            // remove token from our UserProvider:
            userCtx.updateDocumentDetails({ token: "", isLoggedIn: false } as DocumentInfo);

            console.log("Logout was Successful. v2");
        });
    };

    return (
        <div className="logout-button">
            {/* <GoogleLogout clientId={clientId} buttonText="Logout" onLogoutSuccess={onSuccess} /> */}
            <button onClick={handleGoogleLogout}>Log out</button>
        </div>
    );
};

export default Logout;
