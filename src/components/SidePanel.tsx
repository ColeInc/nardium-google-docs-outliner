import React, { useEffect, useState } from "react";
// import { gapi } from "gapi-script";
import { GoogleLogin, CredentialResponse, CodeResponse } from "@react-oauth/google";
// import { useGoogleAuth, useGoogleUser } from "react-gapi-auth2";
import { gapi, loadAuth2 } from "gapi-script";
import Login from "./Login";
import Logout from "./Logout";

const clientId = process.env.REACT_CLIENT_ID || "";
const scopes = "https://www.googleapis.com/auth/documents";
const apiKey = process.env.REACT_API_KEY || "";

const SidePanel = () => {
    // const { googleAuth } = useGoogleAuth();
    // const { currentUser } = useGoogleUser();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const [userAuth, setUserAuth] = useState<UserAuthObject | undefined>();
    const [userAuth, setUserAuth] = useState<CodeResponse | undefined>();

    const [accessToken, setAccessToken] = useState("");
    const [documentContent, setDocumentContent] = useState<any>();

    // const setAuth2 = async () => {
    //     // @ts-ignore
    //     const auth2 = await loadAuth2(gapi, clientId, scopes);
    //     console.log("auth2", auth2);
    //     if (auth2.isSignedIn.get()) {
    //         const userDetails = auth2.currentUser.get();
    //         // updateUser(auth2.currentUser.get());
    //         console.log("first user info back", userDetails);
    //         setUserAuth(userDetails);
    //     } else {
    //         console.log("user is not signed in - checked at useEffect");
    //         // attachSignin(document.getElementById("customBtn"), auth2);
    //     }
    // };

    // useEffect(() => {
    //     // const start = () => {
    //     //     gapi.client.init({ apiKey, clientId, scope: scopes });
    //     // };
    //     // gapi.load("client:auth2", start);

    //     setAuth2();
    // }, []);

    // useEffect(() => {
    //     // const start = () => {
    //     //     gapi.client.init({ apiKey, clientId, scope: scopes });
    //     // };
    //     // gapi.load("client:auth2", start);
    //     setAuth2();
    // }, [userAuth]);

    useEffect(() => {
        const start = () => {
            gapi.client.init({ apiKey, clientId, scope: scopes });
        };

        gapi.load("client:auth2", start);
    }, []);

    // extract items that are H1 or H2 or H3 from entire body
    const filterDocumentContent = (unfilteredContent: any) => {
        // const content = unfilteredContent.body.content.filter((item: any) => {
        //     const para = item.paragraph;
        //     if (!para) return false;
        //     const headingType = para.paragraphStyle?.namedStyleType;
        //     return headingType === "HEADING_1" || headingType === "HEADING_2" || headingType === "HEADING_3";
        //     // if (headingType === "HEADING_1" || headingType === "HEADING_2" || headingType === "HEADING_3") {
        //     //     return item
        //     // };
        // });
        // setDocumentContent(content);
    };

    // get access token of logged in user, then use it to call google docs API to fetch document info
    const fetchFileContents = () => {
        // get access token of logged in user, then use it to call google docs API to fetch document info
        // const fetchFileContents = () => {
        // Get the current user's Google Drive API access token
        // const authResponse = gapi.auth.getToken();
        const authResponse = gapi.auth.getToken();
        console.log("first resp", authResponse);
        const promise = Promise.resolve(authResponse);

        promise.then(authResponse => {
            console.log("2nd auth repsonse", authResponse);
            setAccessToken(authResponse.access_token);

            //TODO: make this dynamically fetched from user's current active page
            const documentId = "18tRHWnmXnJijMa8Q1JDmjvpWnc7BSt1R9Q5iGeqs9Ok";

            console.log("access token", accessToken);

            fetch("https://docs.googleapis.com/v1/documents/" + documentId, {
                method: "GET",
                headers: new Headers({ Authorization: "Bearer " + authResponse.access_token }),
            })
                .then(res => {
                    const response = res.json();
                    console.log("response", response);
                    return response;
                })
                .then(contents => {
                    // console.log("content", JSON.stringify(contents));
                    filterDocumentContent(contents);
                });
        });
        // };

        // Get the current user's Google Drive API access token
        // const authResponse = currentUser;
        // // console.log("currentUser Obj:", authResponse);
        // // // const authResponse = gapi.auth.getToken();
        // // const promise = Promise.resolve(authResponse);
        // // promise.then(authResponse => {
        // //     // setAccessToken(authResponse?.access_token || "");
        // //     //TODO: make this dynamically fetched from user's current active page
        // //     const documentId = "18tRHWnmXnJijMa8Q1JDmjvpWnc7BSt1R9Q5iGeqs9Ok";
        // //     console.log("access token", accessToken);
        // //     fetch("https://docs.googleapis.com/v1/documents/" + documentId, {
        // //         method: "GET",
        // //         headers: new Headers({ Authorization: "Bearer " + userAuth?.credential }),
        // //         // headers: new Headers({ Authorization: "Bearer " + authResponse.access_token }),
        // //     })
        // //         .then(res => {
        // //             const response = res.json();
        // //             console.log("response", response);
        // //             return response;
        // //         })
        // //         .then(contents => {
        // //             // console.log("content", JSON.stringify(contents));
        // //             filterDocumentContent(contents);
        // //         });
        // // });
        // // // // // //TODO: make this dynamically fetched from user's current active page
        // // // // // const documentId = "18tRHWnmXnJijMa8Q1JDmjvpWnc7BSt1R9Q5iGeqs9Ok";
        // // // // // console.log("should be credential:", userAuth?.code);
        // // // // // fetch("https://docs.googleapis.com/v1/documents/" + documentId, {
        // // // // //     method: "GET",
        // // // // //     headers: new Headers({ Authorization: "Bearer " + userAuth?.code }),
        // // // // //     // headers: new Headers({ Authorization: "Bearer " + authResponse.access_token }),
        // // // // // })
        // // // // //     .then(res => {
        // // // // //         const response = res.json();
        // // // // //         console.log("response", response);
        // // // // //         return response;
        // // // // //     })
        // // // // //     .then(contents => {
        // // // // //         // console.log("content", JSON.stringify(contents));
        // // // // //         filterDocumentContent(contents);
        // // // // //     });
    };

    // async function handleAuthenticate() {
    //     const authUrl = getAuthUrl();
    //     window.location.href = authUrl;
    // }

    //TODO: remove unneeded parameter here now
    const handleUserLogin = (authDetails: CodeResponse | undefined) => {
        // setAuth2();
        // setUserAuth(authDetails);
    };

    const fetchUserInfo = async () => {
        // setAuth2();
        // // // // @ts-ignore
        // // // const auth2 = await loadAuth2(gapi, clientId, "");
        // // // console.log("bing  gets here 3");
        // // // if (auth2.isSignedIn.get()) {
        // // //     // updateUser(auth2.currentUser.get());
        // // //     console.log("first user info back", auth2.currentUser.get());
        // // //     // setUserAuth(auth2.currentUser.get())
        // // // } else {
        // // //     console.log("user is not signed in - checked at useEffect");
        // // //     // attachSignin(document.getElementById("customBtn"), auth2);
        // // // }
    };

    return (
        <div>
            {/* <div onClick={() => handleAuthenticate()}>Sign In</div> */}
            <Login setUserAuth={handleUserLogin} />
            <Logout setUserAuth={handleUserLogin} />
            {/* {googleAuth && googleAuth.isSignedIn && <button onClick={fetchFileContents}>Fetch Contents!</button>} */}
            {/* <button onClick={() => googleAuth?.signIn()}>Sign In V3</button> */}
            <button onClick={fetchFileContents}>Fetch Contents!</button>
            <button onClick={fetchUserInfo}>try get user info</button>
            <div>
                {documentContent &&
                    documentContent.map((item: any, index: number) => {
                        const para = item.paragraph;
                        const headingType = para.paragraphStyle?.namedStyleType;
                        const headingDigit = headingType.substr(headingType.length - 1);

                        return (
                            <p key={para.paragraphStyle?.headingId}>
                                {"\u00A0".repeat((+headingDigit - 1) * 10) +
                                    headingDigit +
                                    "> " +
                                    para.elements[0].textRun.content}
                            </p>
                        );
                    })}
            </div>
        </div>
    );
};

export default SidePanel;
