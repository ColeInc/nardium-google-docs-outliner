import React, { Dispatch, FC, SetStateAction, useContext } from "react";
// import { GoogleLogin, CredentialResponse, useGoogleLogin, CodeResponse } from "@react-oauth/google";
// import { UserAuthObject } from "../models";
import UserContext from "../context/user-context";
import { GoogleAuthDetails } from "../models";

// const clientId = process.env.REACT_CLIENT_ID || "";

// interface LoginProps {
//     setUserAuth: (authDetails: CodeResponse | undefined) => void;
// }

// const Login = (setUserAuth: { setUserAuth: React.Dispatch<React.SetStateAction<UserAuthObject>> }) => {
// const Login = (setUserAuth: (userAuth: CredentialResponse) => void) => {
const Login: FC = () => {
    const userCtx = useContext(UserContext);

    // const fetchAuth = () =>
    // useGoogleLogin({
    //     onSuccess: codeResponse => console.log("response useGoogleLogin:", codeResponse),
    //     flow: "auth-code",
    // })();

    // const handleLogin = useGoogleLogin({
    //     onSuccess: codeResponse => onSuccess(codeResponse),
    //     flow: "auth-code",
    // });

    // const onSuccess = (res: Omit<CodeResponse, "error" | "error_description" | "error_uri">) => {
    // const onSuccess = (res: CredentialResponse) => {
    //     console.log("Login Success :D ", res);

    //     // fetchAuth();
    //     // setUserAuth(res as CodeResponse);

    //     // if ("profileObj" in res) {
    //     //     console.log("Login Success. Current user:", res.profileObj);
    //     // } else {
    //     //     console.log("Login Success. User is offline.");
    //     // }
    // };

    // const onError = () => {
    //     console.log("Login failed :(");
    // };

    // const login = useGoogleLogin({
    //     onSuccess: tokenResponse => console.log(tokenResponse),
    // });

    const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // TODO: convert this response into valid type once we have final user object shape:
        chrome.runtime.sendMessage({ type: "getAuthToken" }, (response: any) => {
            // alert(response.token);
            console.log("repsonse fetched back at content.js!", response);
            console.log("token fetched back at content.js!", response.token);
            // setTok
            userCtx.updateUserDetails({ token: response.token } as GoogleAuthDetails);
        });
    };

    return (
        <div className="login-button">
            {/* <GoogleLogin
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
            /> */}
            {/* <button onClick={() => login()}>Sign in with Google 🚀 </button>; */}
            {/* <button onClick={() => setUserAuth({} as CodeResponse)}>Login v2</button> */}
            <button onClick={handleLogin}>Login v3</button>
        </div>
    );
};

export default Login;
