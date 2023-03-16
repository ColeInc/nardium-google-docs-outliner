import React from "react";
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";

const clientId = process.env.REACT_CLIENT_ID || "";

const onSuccess = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if ("profileObj" in res) {
        console.log("Login Success. Current user:", res.profileObj);
    } else {
        console.log("Login Success. User is offline.");
    }
};

const onFailure = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    console.log("Login Success. Current user:", res);
};

const Login = () => {
    return (
        <div className="login-button">
            <GoogleLogin
                clientId={clientId}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy="single_host_origin"
                isSignedIn={true}
            />
        </div>
    );
};

export default Login;
