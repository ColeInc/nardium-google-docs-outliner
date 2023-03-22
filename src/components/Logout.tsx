import { CodeResponse, googleLogout } from "@react-oauth/google";
import React, { FC } from "react";

// import { gapi } from "gapi-script";

// const clientId = process.env.REACT_CLIENT_ID || "";

// const onSuccess = () => {
//     console.log("Logout was Successful.");
// };

interface LogoutProps {
    setUserAuth: (authDetails: CodeResponse | undefined) => void;
}

const Logout: FC<LogoutProps> = ({ setUserAuth }) => {
    const handleGoogleLogout = () => {
        googleLogout();

        const signOut = () => {
            const auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(() => {
                setUserAuth(undefined);
                console.log("User signed out.");
            });
        };
        signOut();

        console.log("Logout was Successful.");
    };

    return (
        <div className="logout-button">
            {/* <GoogleLogout clientId={clientId} buttonText="Logout" onLogoutSuccess={onSuccess} /> */}
            <button onClick={handleGoogleLogout}>Log out</button>
        </div>
    );
};

export default Logout;
