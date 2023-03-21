import React from "react";
import { googleLogout } from "@react-oauth/google";

// const clientId = process.env.REACT_CLIENT_ID || "";

// const onSuccess = () => {
//     console.log("Logout was Successful.");
// };

const handleGoogleLogout = () => {
    googleLogout();
    console.log("Logout was Successful.");
};

const Logout = () => {
    return (
        <div className="logout-button">
            {/* <GoogleLogout clientId={clientId} buttonText="Logout" onLogoutSuccess={onSuccess} /> */}
            <button onClick={handleGoogleLogout}>Log out</button>
        </div>
    );
};

export default Logout;
