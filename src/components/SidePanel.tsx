import React, { ReactNode, useContext, useEffect, useState } from "react";
// import { gapi } from "gapi-script";
import { GoogleLogin, CredentialResponse, CodeResponse } from "@react-oauth/google";
// import { useGoogleAuth, useGoogleUser } from "react-gapi-auth2";
import UserContext from "../context/user-context";
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
    const [thirdPartyCookiesEnabled, setThirdPartyCookiesEnabled] = useState(false);

    const userCtx = useContext(UserContext);

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
        console.log("navigator.cookieEnabled", navigator.cookieEnabled);

        if (navigator.cookieEnabled) {
            try {
                const start = () => {
                    gapi.client.init({ apiKey, clientId, scope: scopes });
                };
                gapi.load("client:auth2", start);
            } catch (e) {
                console.log("error logging in boi:\n", e);
            }
            setThirdPartyCookiesEnabled(false);
        } else {
            setThirdPartyCookiesEnabled(true);
            console.error("Cookies are not enabled in the current environment.");
            alert("please enable 3rd party cookies!");
        }
        // try {
        //     const start = () => {
        //         gapi.client.init({ apiKey, clientId, scope: scopes });
        //     };

        //     gapi.load("client:auth2", start);
        // } catch (e) {
        //     console.log("error logging in boi:\n", e);
        // }
    }, []);

    // get access token of logged in user, then use it to call google docs API to fetch document info
    const fetchFileContents = () => {
        try {
            // get access token of logged in user, then use it to call google docs API to fetch document info
            // const fetchFileContents = () => {
            // Get the current user's Google Drive API access token
            // const authResponse = gapi.auth.getToken();
            const authResponse = gapi.auth.getToken();
            // console.log("first resp", JSON.stringify(authResponse));
            userCtx.updateUserDetails(authResponse);
            setAccessToken(authResponse.access_token);
            const promise = Promise.resolve(authResponse);

            promise.then(authResponse => {
                console.log("2nd auth repsonse", authResponse);
                setAccessToken(authResponse.access_token);

                //TODO: make this dynamically fetched from user's current active page
                // const documentId = "18tRHWnmXnJijMa8Q1JDmjvpWnc7BSt1R9Q5iGeqs9Ok";
                // const documentId = "1all-QMqoXTWuSinTsBdCathMXOty31FWHK9kLGK-8Qs";
                const documentId = "1fMp6Wfal8e-AMH5F5gj-wscCFpYFp6CXMwrcZIFyatw";

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
        } catch (e) {
            console.log("error sending req ripppp:\n", e);
        }

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

        // const li = (
        //     <li>
        //         <h1>{currentHeading.headingText}</h1>
        //         <ul>
        //                <li key={heading.headingText}>{heading.headingText}</li>;
        //                <li key={heading.headingText}>{heading.headingText}</li>;
        //                <li key={heading.headingText}>{heading.headingText}</li>;
        //                <li>
        //                     <h1>{currentHeading.headingText}</h1>
        //                     <ul>
        //                        <li key={heading.headingText}>{heading.headingText}</li>;
        //                        <li key={heading.headingText}>{heading.headingText}</li>;
        //                 </ul>
        //         </ul>
        //     </li>
        // );
    };

    // extract items that are H1 or H2 or H3 from entire body
    //TODO: convert all any's here to corresponding interface
    const filterDocumentContent = (unfilteredContent: any) => {
        const filteredHeadings = unfilteredContent.body.content.filter((item: any) => {
            const para = item.paragraph;
            if (!para) return false;
            const headingType = para.paragraphStyle?.namedStyleType;
            return headingType.startsWith("HEADING_");
            // if (headingType === "HEADING_1" || headingType === "HEADING_2" || headingType === "HEADING_3") {
            //     return item
            // };
        });

        // console.log("filteredHeadings", JSON.stringify(filteredHeadings));

        const appendToParentPath = (segment: string) => {
            currentParentPath.push(segment);
            // if (currentParentPath) {
            //     currentParentPath.push(segment);
            // }
            // else {
            //     currentParentPath[segment] = segment;
            // }
            console.log("latest official path stored:", currentParentPath);
        };

        const popParentPath = (numTimes = 1) => {
            currentParentPath.slice(0, -numTimes);
        };

        const dummyArray: Heading[] = [
            {
                headingId: "1",
                headingText: "Heading 1",
                children: [
                    {
                        headingId: "1.1",
                        headingText: "Heading 1.1",
                        children: [
                            {
                                headingId: "1.1.1",
                                headingText: "Heading 1.1.1",
                            },
                            {
                                headingId: "1.1.2",
                                headingText: "Heading 1.1.2",
                            },
                        ],
                    },
                    {
                        headingId: "1.2",
                        headingText: "Heading 1.2",
                    },
                ],
            },
            {
                headingId: "2",
                headingText: "Heading 2",
                children: [
                    {
                        headingId: "2.1",
                        headingText: "Heading 2.1",
                    },
                    {
                        headingId: "2.2",
                        headingText: "Heading 2.2",
                    },
                ],
            },
        ];

        //TODO: use this and pass info through as attributes:
        //TODO: make these fields all mandatory (except children) and fill them in corresponding places
        interface Heading {
            headingId: string;
            headingDigit?: number;
            headingText?: string;
            children?: Heading[];
        }

        const placeholderChild = (): Heading => {
            const randomString = "PLACEHOLDER_" + Math.random().toString(32).substring(2, 12);
            return {
                headingId: randomString,
                headingDigit: 0,
                headingText: randomString,
            };
        };

        // interface Heading extends Array<Heading> {
        //     headingId: string;
        //     headingDigit?: number;
        //     headingText?: string;
        //     children?: Heading;
        // }

        // type IHeading = Array<[string, string[]?]>;

        // const headingsHierarchy: IHeading[] = [];

        // const headingsHierarchy: string[] = [];
        // const headingsHierarchy: Array<[Heading[], Heading[]?]> = [];
        // const headingsHierarchy: Array<[string[], string[]?]> = [];

        const calcHeadingDiff = (parent: Heading, child: Heading) => {
            let diff = 0;
            if (parent.headingDigit && child.headingDigit) {
                // diff = Math.abs(parent.headingDigit - child.headingDigit);
                diff = parent.headingDigit - child.headingDigit;
            }
            return diff;
        };

        const appendChildHeading = (child: Heading) => {
            let currentParentHeading: Heading | undefined;

            // first find the parent we want to append to:
            currentParentPath.forEach((pathItem: string) => {
                const headingFound = headingsHierarchy.find(element => element.headingId === pathItem);
                // if we search all headings at this level of headingsHierarchy and find a match, assign new currentParentHeading:
                if (headingFound) {
                    currentParentHeading = headingFound;
                }
            });
            console.log("final Heading found:", currentParentHeading);

            // if we find a valid final parent heading, append the new child to it:
            if (currentParentHeading) {
                // first calculate how many children down we need to nest this child
                const diff = calcHeadingDiff(currentParentHeading, child);

                // iterate and nest children till we hit the correct level heading should be at:
                for (let i = 0; i < diff; i++) {
                    // if we are on last iteration insert the real child heading itself, else insert PLACEHOLDER
                    const heading = i === diff - 1 ? child : placeholderChild();

                    if (currentParentHeading?.children) {
                        currentParentHeading?.children.push(heading);
                    } else {
                        currentParentHeading["children"] = [heading];
                    }

                    // assign this new child to be the updated parent:
                    const newParent: Heading | undefined = currentParentHeading?.children.find(
                        element => element.headingId === heading.headingId
                    );
                    currentParentHeading = newParent ? newParent : currentParentHeading;

                    appendToParentPath(heading.headingId);
                }
            } else {
                console.error("No heading found.");
            }

            console.log("final headingsHierarchy", JSON.stringify(headingsHierarchy));
        };

        let headingsHierarchy: Heading[] = [];
        let currentParentPath: string[] = [];
        let prevHeadingDigit = 0;

        // TODO: remove these 2, just hardcoded tests:
        headingsHierarchy = dummyArray;
        currentParentPath = ["2", "2.1"];

        filteredHeadings.forEach((heading: any) => {
            const para = heading.paragraph;
            const headingType = para.paragraphStyle?.namedStyleType;
            const currHeadingDigit = headingType.substr(headingType.length - 1);
            const headingText = para.elements[0].textRun.content;
            const headingId = para.paragraphStyle?.headingId;

            const newChild = {
                headingId,
                headingText,
                headingDigit: currHeadingDigit,
            };

            // 0) base case - if our heading is a top lvl H1 OR if there is nothing currently stored in currentParentPath, then create a new item in our final array of arrays:
            if (currHeadingDigit === 1 || !currentParentPath) {
                //
                headingsHierarchy[heading] = heading;
                // currentParentPath = headingsHierachy[heading];
                appendToParentPath(heading);
            }

            //  1) if the current heading IS going to be a child of parent (E.g. we go from Heading2 to Heading3):
            else if (currHeadingDigit > prevHeadingDigit) {
                // console.log("1)", headingText, "prev", prevHeadingDigit, "curr", currHeadingDigit);
                // console.log("original headingsHierarchy", headingsHierarchy);

                // add new child to current parent:
                appendChildHeading(newChild);
            }

            // 2) else if previous heading & this heading should be on same level
            else if (currHeadingDigit === prevHeadingDigit) {
                // console.log("2)", headingText, "prev", prevHeadingDigit, "curr", currHeadingDigit);

                // pop one from parent path
                popParentPath();
                // add new child to current parent
                appendChildHeading(newChild);
            }

            // 3) else if current heading is bigger than previous heading (E.g. we go from Heading2 to Heading1)
            else if (currHeadingDigit < prevHeadingDigit) {
                const headingDiff = prevHeadingDigit - currHeadingDigit;

                // pop n from parent path where n is the diff between prev and curr heading digit
                popParentPath(headingDiff);
                // append new child at this level
                appendChildHeading(newChild);
            }

            prevHeadingDigit = currHeadingDigit;
        });

        // // // const finalListItems: JSX.Element[] = [];

        // // let newChild = false;
        // // let numRemaining = filteredHeadings.length;

        // // const calculateCurrentListItem = (remainingHeadings: any, prevHeadingDigit: number): JSX.Element => {
        // //     const para = remainingHeadings[0].paragraph;
        // //     const headingType = para.paragraphStyle?.namedStyleType;
        // //     const currHeadingDigit = headingType.substr(headingType.length - 1);
        // //     const headingText = para.elements[0].textRun.content;
        // //     const headingId = para.paragraphStyle?.headingId;
        // //     numRemaining--;

        // //     // let li = <></>;

        // //     // const li = (
        // //     //     <li>
        // //     //         <h1>{currentHeading.headingText}</h1>
        // //     //         <ul>
        // //     //             {currentList &&
        // //     //                 currentList.map(heading => {
        // //     //                     <li key={heading.headingText}>{heading.headingText}</li>;
        // //     //                 })}
        // //     //         </ul>
        // //     //     </li>
        // //     // );

        // //     // 0) base case
        // //     if (remainingHeadings.length === 1) {
        // //         console.log("0) basecase:", headingText, "prev", prevHeadingDigit, "curr", currHeadingDigit);

        // //         return (
        // //             <li key={headingId}>
        // //                 <h1>{headingText}</h1>
        // //             </li>
        // //         );
        // //     }

        // //     // 1) if the current heading IS going to be a child of parent (E.g. we go from Heading2 to Heading3):
        // //     if (currHeadingDigit > prevHeadingDigit) {
        // //         console.log("1)", headingText, "prev", prevHeadingDigit, "curr", currHeadingDigit);
        // //         let child = calculateCurrentListItem(remainingHeadings.slice(1), currHeadingDigit);

        // //         const childListItems: JSX.Element[] = [];
        // //         while (newChild) {
        // //             childListItems.push(child);
        // //             child = calculateCurrentListItem(filteredHeadings.slice(numRemaining), currHeadingDigit);
        // //         }

        // //         return (
        // //             <>
        // //                 <li key={headingId}>
        // //                     <h1>{headingText}</h1>
        // //                     <ul>
        // //                         {childListItems}
        // //                         {/* // ^^^ remove the first item in remainingHeadings and pass it recursively */}
        // //                     </ul>
        // //                 </li>
        // //                 {/* {newChild ? {calculateCurrentListItem(filteredHeadings.slice(numRemaining), currHeadingDigit)}:<></>} */}
        // //             </>
        // //         );

        // //         // if (newChild) {
        // //         //     newChild = false;

        // //         //     return (
        // //         //         <>
        // //         //             <li key={headingId}>
        // //         //                 <h1>{headingText}</h1>
        // //         //                 <ul>
        // //         //                     {}
        // //         //                     {/* // ^^^ remove the first item in remainingHeadings and pass it recursively */}
        // //         //                 </ul>
        // //         //             </li>
        // //         //             {calculateCurrentListItem(filteredHeadings.slice(numRemaining), currHeadingDigit)}
        // //         //         </>
        // //         //     );
        // //         // } else {
        // //         //     return (
        // //         //         <li key={headingId}>
        // //         //             <h1>{headingText}</h1>
        // //         //             <ul>
        // //         //                 {calculateCurrentListItem(remainingHeadings.slice(1), currHeadingDigit)}
        // //         //                 {/* // ^^^ remove the first item in remainingHeadings and pass it recursively */}
        // //         //             </ul>
        // //         //         </li>
        // //         //     );
        // //         // }
        // //         // finalListItems.push(li);
        // //         // return li;
        // //     }
        // //     // 2) else if previous heading & this heading should be on same level
        // //     else if (currHeadingDigit === prevHeadingDigit) {
        // //         console.log("2)", headingText, "prev", prevHeadingDigit, "curr", currHeadingDigit);

        // //         // return nothing so that current <li> finishes
        // //         // const li = (
        // //         //     <li>
        // //         //         <h1>{JSON.stringify(para)}</h1>
        // //         //     </li>
        // //         // );
        // //         // finalListItems.push(li);
        // //         // create a new call in next iteration with the next heading so that it creates the next LI
        // //         // calculateCurrentListItem(remainingHeadings.slice(1), currHeadingDigit);
        // //         // return currentLi;
        // //         return (
        // //             <>
        // //                 <li key={headingId}>
        // //                     <h1>{headingText}</h1>
        // //                 </li>
        // //                 {calculateCurrentListItem(remainingHeadings.slice(1), currHeadingDigit)}
        // //             </>
        // //         );
        // //     }
        // //     // 3) else if current heading is bigger than previous heading (E.g. we go from Heading2 to Heading1)
        // //     else if (currHeadingDigit < prevHeadingDigit) {
        // //         console.log("3)", headingText, "prev", prevHeadingDigit, "curr", currHeadingDigit);

        // //         // return nothing here because it will iterate back up and in next cycle up it should catch it in the 2) second if condition right?
        // //         return <></>;
        // //         if (currHeadingDigit === 1) {
        // //         }
        // //     } else {
        // //         // just to keep typescript happy:
        // //         newChild = true;
        // //         return <></>;
        // //     }
        // //     // return li;
        // // };

        // // // const finalListItems: JSX.Element[] = filteredHeadings.map((item: any) => {
        // // //     calculateCurrentListItem(item, 0); // pass prevHeading as 0 by default to tell function this is the first heading
        // // // });
        // // const finalResponse = (
        // //     <ul>
        // //         {
        // //             calculateCurrentListItem(filteredHeadings, 0) // pass prevHeading as 0 by default to tell function this is the first heading
        // //         }
        // //     </ul>
        // // );

        // const finalResponse = <ul>{finalListItems.map(item => item)}</ul>;

        // // // //         const fetchHeadingRun = (currentHeading: Heading, filteredHeadings: string): JSX.Element => {
        // // // //             let currentList: Heading[] = [];

        // // // //         filteredHeadings.map((item: any, index: number) => {
        // // // //             const para = item.paragraph;
        // // // //             const headingType = para.paragraphStyle?.namedStyleType;
        // // // //             const currHeadingDigit = headingType.substr(headingType.length - 1);

        // // // //             if (currentHeading.headingDigit < currHeadingDigit ) {
        // // // // fetchHeadingRun({headingDigit: currHeadingDigit,
        // // // //     headingText: para.elements[0].textRun.content,
        // // // //     headingId: para.paragraphStyle?.headingId,
        // // // // }, filteredHeadings.substring(index))
        // // // //             }

        // // // //             // return final <ul>
        // // // //             return (
        // // // //                 <li>
        // // // //                     <h1>{currentHeading.headingText}</h1>
        // // // //                     <ul>
        // // // //                         {currentList &&
        // // // //                             currentList.map(heading => {
        // // // //                                 <li key={heading.headingText}>{heading.headingText}</li>;
        // // // //                             })}
        // // // //                     </ul>
        // // // //                 </li>
        // // // //             );
        // // // //         };

        // // // //         const listItemArray: ReactNode[] = [];
        // // // //         let prevHeadingDigit = 0;

        // // // //         filteredHeadings.map((item: any, index: number) => {
        // // // //             const para = item.paragraph;
        // // // //             const headingType = para.paragraphStyle?.namedStyleType;
        // // // //             const currHeadingDigit = headingType.substr(headingType.length - 1);

        // // // //             if (currHeadingDigit > prevHeadingDigit) {
        // // // //                 currentList.push({headingDigit: currHeadingDigit,
        // // // //                     headingText: para.elements[0].textRun.content,
        // // // //                     headingId: para.paragraphStyle?.headingId,
        // // // //                 });
        // // // //             } else if (currHeadingDigit === prevHeadingDigit) {
        // // // //             } else if (currHeadingDigit < prevHeadingDigit) {
        // // // //             }

        // return (
        //     <p key={para.paragraphStyle?.headingId}>
        //         {"\u00A0".repeat((+currHeadingDigit - 1) * 10) + currHeadingDigit + "> " + para.elements[0].textRun.content}
        //     </p>
        // );
        // });
        console.log("final filteredContent", filteredHeadings);
        // setDocumentContent(filteredHeadings);
        setDocumentContent(finalResponse);
    };

    // async function handleAuthenticate() {
    //     const authUrl = getAuthUrl();
    //     window.location.href = authUrl;
    // }

    //TODO: remove unneeded parameter here now
    const handleUserLogin = (authDetails: CodeResponse | undefined) => {
        try {
            const authInstance = gapi.auth2.getAuthInstance();
            authInstance.signIn();
            // setAuth2();
            // setUserAuth(authDetails);
        } catch (e) {
            console.log("error running gapi.auth2.getAuthInstance():\n", e);
        }
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

    return thirdPartyCookiesEnabled ? (
        <div className="message">
            <p>Third-party cookies are disabled in your browser. Please enable them to continue using this site.</p>
        </div>
    ) : (
        <div>
            {/* <div onClick={() => handleAuthenticate()}>Sign In</div> */}
            <Login setUserAuth={handleUserLogin} />
            <Logout setUserAuth={handleUserLogin} />
            {/* {googleAuth && googleAuth.isSignedIn && <button onClick={fetchFileContents}>Fetch Contents!</button>} */}
            {/* <button onClick={() => googleAuth?.signIn()}>Sign In V3</button> */}
            <button onClick={fetchFileContents}>Fetch Contents!</button>
            <button onClick={fetchUserInfo}>try get user info</button>
            <div>
                {documentContent}
                {/* {documentContent &&
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
                    })} */}
            </div>
        </div>
    );
};

export default SidePanel;
