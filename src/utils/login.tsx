import React, { Dispatch, FC, SetStateAction } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { UserAuthObject } from "../models";

const clientId = process.env.REACT_CLIENT_ID || "";

interface LoginProps {
    setUserAuth: (authDetails: CredentialResponse) => void;
}

// const Login = (setUserAuth: { setUserAuth: React.Dispatch<React.SetStateAction<UserAuthObject>> }) => {
// const Login = (setUserAuth: (userAuth: CredentialResponse) => void) => {
const Login: FC<LoginProps> = ({ setUserAuth }) => {
    const onSuccess = (res: CredentialResponse) => {
        console.log("Login Success :D ", res);
        setUserAuth(res);

        // if ("profileObj" in res) {
        //     console.log("Login Success. Current user:", res.profileObj);
        // } else {
        //     console.log("Login Success. User is offline.");
        // }
    };

    const onError = () => {
        console.log("Login failed :(");
    };

    return (
        <div className="login-button">
            <GoogleLogin
                // buttonText="Login"
                onSuccess={onSuccess}
                onError={onError}
                // cookiePolicy="single_host_origin"
                // isSignedIn={true}
                theme="outline"
                size="large"
                text="signin"
                shape="pill"
                width="100"
                auto_select
            />
        </div>
    );
};

export default Login;
