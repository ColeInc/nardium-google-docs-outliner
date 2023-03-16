import React from "react";
import { GoogleLogout } from "react-google-login";

const clientId = process.env.REACT_CLIENT_ID || "";

const onSuccess = () => {
    console.log("Logout is Successful.");
};

const Logout = () => {
    return (
        <div className="logout-button">
            <GoogleLogout clientId={clientId} buttonText="Logout" onLogoutSuccess={onSuccess} />
        </div>
    );
};

export default Logout;
