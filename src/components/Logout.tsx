// import { CodeResponse, googleLogout } from "@react-oauth/google";
import React, { FC, useContext } from "react";
import UserContext from "../context/user-context";
import { GoogleAuthDetails } from "../models";

// import { gapi } from "gapi-script";

// const clientId = process.env.REACT_CLIENT_ID || "";

// const onSuccess = () => {
//     console.log("Logout was Successful.");
// };

// interface LogoutProps {
//     setUserAuth: (authDetails: CodeResponse | undefined) => void;
// }

const Logout: FC = () => {
    const userCtx = useContext(UserContext);
    const token = userCtx.userDetails?.token;

    const handleGoogleLogout = async () => {
        chrome.runtime.sendMessage({ type: "logoutUser", token }, (response: any) => {
            // remove token from our UserProvider:
            userCtx.updateUserDetails({ token: "" } as GoogleAuthDetails);

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
