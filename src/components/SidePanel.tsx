import React, { ReactNode, useContext, useEffect, useState } from "react";
// import { gapi } from "gapi-script";
// import { GoogleLogin, CredentialResponse, CodeResponse } from "@react-oauth/google";
// import { useGoogleAuth, useGoogleUser } from "react-gapi-auth2";
import DocumentContext from "../context/document-context";
// import { gapi, loadAuth2 } from "gapi-script";
import Login from "./Login";
import Logout from "./Logout";
import { IHeading } from "../models/heading";
import Headings from "./Headings";
// import { getDocumentId } from "../lib/getDocumentId";
import { DocumentInfo } from "../models";

const clientId = process.env.REACT_CLIENT_ID || "";
const scopes = "https://www.googleapis.com/auth/documents";
const apiKey = process.env.REACT_API_KEY || "";

const SidePanel = () => {
    // const { googleAuth } = useGoogleAuth();
    // const { currentUser } = useGoogleUser();

    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const [userAuth, setUserAuth] = useState<UserAuthObject | undefined>();
    // const [userAuth, setUserAuth] = useState<CodeResponse | undefined>();
    // const [user, setUser] = React.useState(undefined);

    // const [accessToken, setAccessToken] = useState("");
    const [documentContent, setDocumentContent] = useState<IHeading[]>();
    const [thirdPartyCookiesEnabled, setThirdPartyCookiesEnabled] = useState(false);
    const [activeDoc, setActiveDoc] = useState(null);

    const userCtx = useContext(DocumentContext);

    // const setAuth2 = async () => {
    //     // @ts-ignore
    //     const auth2 = await loadAuth2(gapi, clientId, scopes);
    //     console.log("auth2", auth2);
    //     if (auth2.isSignedIn.get()) {
    //         const documentDetails = auth2.currentUser.get();
    //         // updateUser(auth2.currentUser.get());
    //         console.log("first user info back", documentDetails);
    //         setUserAuth(documentDetails);
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

    //     useEffect(() =>
    //   {
    //     auth.onAuthStateChanged(user =>
    //     {
    //       setUser(user && user.uid ? user : null)
    //     })
    //   }, [])

    //   if ( undefined === user )
    //     return <h1>Loading...</h1>

    //   if ( user != null )
    //     return (
    //       <div>
    //         <h1>Signed in as {user.displayName}.</h1>
    //         <button onClick={auth.signOut.bind(auth)}>Sign Out?</button>
    //       </div>
    //     )

    //   return (
    //     <button onClick={signIn}>Sign In with Google</button>
    //   )
    // }

    useEffect(() => {
        console.log("navigator.cookieEnabled", navigator.cookieEnabled);

        if (navigator.cookieEnabled) {
            // try {
            //     const start = () => {
            //         gapi.client.init({ apiKey, clientId, scope: scopes });
            //     };
            //     gapi.load("client:auth2", start);
            // } catch (e) {
            //     console.log("error logging in boi:\n", e);
            // }
            setThirdPartyCookiesEnabled(false);
        } else {
            setThirdPartyCookiesEnabled(true);
            console.error("Cookies are not enabled in the current environment.");
            // alert("please enable 3rd party cookies!");
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

    // // const getDocumentId = () => {
    // //     console.log("triggering req to getDocumentId");
    // //     chrome.runtime.sendMessage({ type: "getDocumentId" }, (response: any) => {
    // //         // userCtx.updateDocumentDetails({ documentId: response.documentId } as DocumentInfo);

    // //         console.log("fetched dis documentId (back at content.js!)", response.documentId);
    // //         response.documentId
    // //             ? userCtx.updateDocumentDetails({ documentId: response.documentId } as DocumentInfo)
    // //             : null;
    // //         console.log("2)");
    // //     });
    // // };

    // get access token of logged in user, then use it to call google docs API to fetch document info
    const fetchFileContents = () => {
        //  MOCK TODO: remove dis:
        const contents = {
            title: "Nardium Headlines Testing",
            body: {
                content: [
                    {
                        endIndex: 1,
                        sectionBreak: {
                            sectionStyle: {
                                columnSeparatorStyle: "NONE",
                                contentDirection: "LEFT_TO_RIGHT",
                                sectionType: "CONTINUOUS",
                            },
                        },
                    },
                    {
                        startIndex: 1,
                        endIndex: 8,
                        paragraph: {
                            elements: [{ startIndex: 1, endIndex: 8, textRun: { content: "H1 - 1\n", textStyle: {} } }],
                            paragraphStyle: {
                                headingId: "h.opb284gdria0",
                                namedStyleType: "HEADING_1",
                                direction: "LEFT_TO_RIGHT",
                            },
                        },
                    },
                    {
                        startIndex: 8,
                        endIndex: 15,
                        paragraph: {
                            elements: [
                                { startIndex: 8, endIndex: 15, textRun: { content: "H2 - 2\n", textStyle: {} } },
                            ],
                            paragraphStyle: {
                                headingId: "h.6z3v76uflp1r",
                                namedStyleType: "HEADING_2",
                                direction: "LEFT_TO_RIGHT",
                            },
                        },
                    },
                    {
                        startIndex: 15,
                        endIndex: 22,
                        paragraph: {
                            elements: [
                                { startIndex: 15, endIndex: 22, textRun: { content: "H3 - 3\n", textStyle: {} } },
                            ],
                            paragraphStyle: {
                                headingId: "h.i8wwhibh4v7v",
                                namedStyleType: "HEADING_3",
                                direction: "LEFT_TO_RIGHT",
                            },
                        },
                    },
                    {
                        startIndex: 22,
                        endIndex: 29,
                        paragraph: {
                            elements: [
                                { startIndex: 22, endIndex: 29, textRun: { content: "H4 - 4\n", textStyle: {} } },
                            ],
                            paragraphStyle: {
                                headingId: "h.jg2jpfu79bzz",
                                namedStyleType: "HEADING_4",
                                direction: "LEFT_TO_RIGHT",
                            },
                        },
                    },
                    {
                        startIndex: 29,
                        endIndex: 36,
                        paragraph: {
                            elements: [
                                { startIndex: 29, endIndex: 36, textRun: { content: "H1 - 5\n", textStyle: {} } },
                            ],
                            paragraphStyle: {
                                headingId: "h.ux7bmvz95wyy",
                                namedStyleType: "HEADING_1",
                                direction: "LEFT_TO_RIGHT",
                            },
                        },
                    },
                    {
                        startIndex: 36,
                        endIndex: 43,
                        paragraph: {
                            elements: [
                                { startIndex: 36, endIndex: 43, textRun: { content: "H2 - 6\n", textStyle: {} } },
                            ],
                            paragraphStyle: {
                                headingId: "h.i6zu16fw3tuj",
                                namedStyleType: "HEADING_2",
                                direction: "LEFT_TO_RIGHT",
                            },
                        },
                    },
                    {
                        startIndex: 43,
                        endIndex: 50,
                        paragraph: {
                            elements: [
                                { startIndex: 43, endIndex: 50, textRun: { content: "H3 - 7\n", textStyle: {} } },
                            ],
                            paragraphStyle: {
                                headingId: "h.vbp8nl9eg1s",
                                namedStyleType: "HEADING_3",
                                direction: "LEFT_TO_RIGHT",
                            },
                        },
                    },
                    {
                        startIndex: 50,
                        endIndex: 57,
                        paragraph: {
                            elements: [
                                { startIndex: 50, endIndex: 57, textRun: { content: "H4 - 8\n", textStyle: {} } },
                            ],
                            paragraphStyle: {
                                headingId: "h.2x3fvugxehv6",
                                namedStyleType: "HEADING_4",
                                direction: "LEFT_TO_RIGHT",
                            },
                        },
                    },
                    {
                        startIndex: 57,
                        endIndex: 64,
                        paragraph: {
                            elements: [
                                { startIndex: 57, endIndex: 64, textRun: { content: "H5 - 9\n", textStyle: {} } },
                            ],
                            paragraphStyle: {
                                headingId: "h.dyh4t2z0z770",
                                namedStyleType: "HEADING_5",
                                direction: "LEFT_TO_RIGHT",
                            },
                        },
                    },
                    {
                        startIndex: 64,
                        endIndex: 72,
                        paragraph: {
                            elements: [
                                { startIndex: 64, endIndex: 72, textRun: { content: "H2 - 10\n", textStyle: {} } },
                            ],
                            paragraphStyle: {
                                headingId: "h.2jd7ibwmaahh",
                                namedStyleType: "HEADING_2",
                                direction: "LEFT_TO_RIGHT",
                            },
                        },
                    },
                    {
                        startIndex: 72,
                        endIndex: 80,
                        paragraph: {
                            elements: [
                                { startIndex: 72, endIndex: 80, textRun: { content: "H1 - 11\n", textStyle: {} } },
                            ],
                            paragraphStyle: {
                                headingId: "h.gd6zllnwyt32",
                                namedStyleType: "HEADING_1",
                                direction: "LEFT_TO_RIGHT",
                            },
                        },
                    },
                    {
                        startIndex: 80,
                        endIndex: 88,
                        paragraph: {
                            elements: [
                                { startIndex: 80, endIndex: 88, textRun: { content: "H2 - 12\n", textStyle: {} } },
                            ],
                            paragraphStyle: {
                                headingId: "h.2pt74a6zl0ii",
                                namedStyleType: "HEADING_2",
                                direction: "LEFT_TO_RIGHT",
                            },
                        },
                    },
                    {
                        startIndex: 88,
                        endIndex: 96,
                        paragraph: {
                            elements: [
                                { startIndex: 88, endIndex: 96, textRun: { content: "H1 - 13\n", textStyle: {} } },
                            ],
                            paragraphStyle: {
                                headingId: "h.b70vuc8fttbq",
                                namedStyleType: "HEADING_1",
                                direction: "LEFT_TO_RIGHT",
                            },
                        },
                    },
                    {
                        startIndex: 96,
                        endIndex: 97,
                        paragraph: {
                            elements: [{ startIndex: 96, endIndex: 97, textRun: { content: "\n", textStyle: {} } }],
                            paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
                        },
                    },
                    {
                        startIndex: 97,
                        endIndex: 98,
                        paragraph: {
                            elements: [{ startIndex: 97, endIndex: 98, textRun: { content: "\n", textStyle: {} } }],
                            paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
                        },
                    },
                    {
                        startIndex: 98,
                        endIndex: 99,
                        paragraph: {
                            elements: [{ startIndex: 98, endIndex: 99, textRun: { content: "\n", textStyle: {} } }],
                            paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
                        },
                    },
                    {
                        startIndex: 99,
                        endIndex: 100,
                        paragraph: {
                            elements: [{ startIndex: 99, endIndex: 100, textRun: { content: "\n", textStyle: {} } }],
                            paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
                        },
                    },
                    {
                        startIndex: 100,
                        endIndex: 101,
                        paragraph: {
                            elements: [{ startIndex: 100, endIndex: 101, textRun: { content: "\n", textStyle: {} } }],
                            paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
                        },
                    },
                    {
                        startIndex: 101,
                        endIndex: 102,
                        paragraph: {
                            elements: [{ startIndex: 101, endIndex: 102, textRun: { content: "\n", textStyle: {} } }],
                            paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
                        },
                    },
                    {
                        startIndex: 102,
                        endIndex: 103,
                        paragraph: {
                            elements: [{ startIndex: 102, endIndex: 103, textRun: { content: "\n", textStyle: {} } }],
                            paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
                        },
                    },
                    {
                        startIndex: 103,
                        endIndex: 104,
                        paragraph: {
                            elements: [{ startIndex: 103, endIndex: 104, textRun: { content: "\n", textStyle: {} } }],
                            paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
                        },
                    },
                    {
                        startIndex: 104,
                        endIndex: 105,
                        paragraph: {
                            elements: [{ startIndex: 104, endIndex: 105, textRun: { content: "\n", textStyle: {} } }],
                            paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
                        },
                    },
                    {
                        startIndex: 105,
                        endIndex: 106,
                        paragraph: {
                            elements: [{ startIndex: 105, endIndex: 106, textRun: { content: "\n", textStyle: {} } }],
                            paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
                        },
                    },
                ],
            },
            documentStyle: {
                background: { color: {} },
                pageNumberStart: 1,
                marginTop: { magnitude: 72, unit: "PT" },
                marginBottom: { magnitude: 72, unit: "PT" },
                marginRight: { magnitude: 72, unit: "PT" },
                marginLeft: { magnitude: 72, unit: "PT" },
                pageSize: { height: { magnitude: 792, unit: "PT" }, width: { magnitude: 612, unit: "PT" } },
                marginHeader: { magnitude: 36, unit: "PT" },
                marginFooter: { magnitude: 36, unit: "PT" },
                useCustomHeaderFooterMargins: true,
            },
            namedStyles: {
                styles: [
                    {
                        namedStyleType: "NORMAL_TEXT",
                        textStyle: {
                            bold: false,
                            italic: false,
                            underline: false,
                            strikethrough: false,
                            smallCaps: false,
                            backgroundColor: {},
                            foregroundColor: { color: { rgbColor: {} } },
                            fontSize: { magnitude: 11, unit: "PT" },
                            weightedFontFamily: { fontFamily: "Arial", weight: 400 },
                            baselineOffset: "NONE",
                        },
                        paragraphStyle: {
                            namedStyleType: "NORMAL_TEXT",
                            alignment: "START",
                            lineSpacing: 115,
                            direction: "LEFT_TO_RIGHT",
                            spacingMode: "COLLAPSE_LISTS",
                            spaceAbove: { unit: "PT" },
                            spaceBelow: { unit: "PT" },
                            borderBetween: {
                                color: {},
                                width: { unit: "PT" },
                                padding: { unit: "PT" },
                                dashStyle: "SOLID",
                            },
                            borderTop: {
                                color: {},
                                width: { unit: "PT" },
                                padding: { unit: "PT" },
                                dashStyle: "SOLID",
                            },
                            borderBottom: {
                                color: {},
                                width: { unit: "PT" },
                                padding: { unit: "PT" },
                                dashStyle: "SOLID",
                            },
                            borderLeft: {
                                color: {},
                                width: { unit: "PT" },
                                padding: { unit: "PT" },
                                dashStyle: "SOLID",
                            },
                            borderRight: {
                                color: {},
                                width: { unit: "PT" },
                                padding: { unit: "PT" },
                                dashStyle: "SOLID",
                            },
                            indentFirstLine: { unit: "PT" },
                            indentStart: { unit: "PT" },
                            indentEnd: { unit: "PT" },
                            keepLinesTogether: false,
                            keepWithNext: false,
                            avoidWidowAndOrphan: true,
                            shading: { backgroundColor: {} },
                            pageBreakBefore: false,
                        },
                    },
                    {
                        namedStyleType: "HEADING_1",
                        textStyle: { fontSize: { magnitude: 20, unit: "PT" } },
                        paragraphStyle: {
                            namedStyleType: "NORMAL_TEXT",
                            direction: "LEFT_TO_RIGHT",
                            spaceAbove: { magnitude: 20, unit: "PT" },
                            spaceBelow: { magnitude: 6, unit: "PT" },
                            keepLinesTogether: true,
                            keepWithNext: true,
                            pageBreakBefore: false,
                        },
                    },
                    {
                        namedStyleType: "HEADING_2",
                        textStyle: { bold: false, fontSize: { magnitude: 16, unit: "PT" } },
                        paragraphStyle: {
                            namedStyleType: "NORMAL_TEXT",
                            direction: "LEFT_TO_RIGHT",
                            spaceAbove: { magnitude: 18, unit: "PT" },
                            spaceBelow: { magnitude: 6, unit: "PT" },
                            keepLinesTogether: true,
                            keepWithNext: true,
                            pageBreakBefore: false,
                        },
                    },
                    {
                        namedStyleType: "HEADING_3",
                        textStyle: {
                            bold: false,
                            foregroundColor: {
                                color: { rgbColor: { red: 0.2627451, green: 0.2627451, blue: 0.2627451 } },
                            },
                            fontSize: { magnitude: 14, unit: "PT" },
                        },
                        paragraphStyle: {
                            namedStyleType: "NORMAL_TEXT",
                            direction: "LEFT_TO_RIGHT",
                            spaceAbove: { magnitude: 16, unit: "PT" },
                            spaceBelow: { magnitude: 4, unit: "PT" },
                            keepLinesTogether: true,
                            keepWithNext: true,
                            pageBreakBefore: false,
                        },
                    },
                    {
                        namedStyleType: "HEADING_4",
                        textStyle: {
                            foregroundColor: { color: { rgbColor: { red: 0.4, green: 0.4, blue: 0.4 } } },
                            fontSize: { magnitude: 12, unit: "PT" },
                        },
                        paragraphStyle: {
                            namedStyleType: "NORMAL_TEXT",
                            direction: "LEFT_TO_RIGHT",
                            spaceAbove: { magnitude: 14, unit: "PT" },
                            spaceBelow: { magnitude: 4, unit: "PT" },
                            keepLinesTogether: true,
                            keepWithNext: true,
                            pageBreakBefore: false,
                        },
                    },
                    {
                        namedStyleType: "HEADING_5",
                        textStyle: {
                            foregroundColor: { color: { rgbColor: { red: 0.4, green: 0.4, blue: 0.4 } } },
                            fontSize: { magnitude: 11, unit: "PT" },
                        },
                        paragraphStyle: {
                            namedStyleType: "NORMAL_TEXT",
                            direction: "LEFT_TO_RIGHT",
                            spaceAbove: { magnitude: 12, unit: "PT" },
                            spaceBelow: { magnitude: 4, unit: "PT" },
                            keepLinesTogether: true,
                            keepWithNext: true,
                            pageBreakBefore: false,
                        },
                    },
                    {
                        namedStyleType: "HEADING_6",
                        textStyle: {
                            italic: true,
                            foregroundColor: { color: { rgbColor: { red: 0.4, green: 0.4, blue: 0.4 } } },
                            fontSize: { magnitude: 11, unit: "PT" },
                        },
                        paragraphStyle: {
                            namedStyleType: "NORMAL_TEXT",
                            direction: "LEFT_TO_RIGHT",
                            spaceAbove: { magnitude: 12, unit: "PT" },
                            spaceBelow: { magnitude: 4, unit: "PT" },
                            keepLinesTogether: true,
                            keepWithNext: true,
                            pageBreakBefore: false,
                        },
                    },
                    {
                        namedStyleType: "TITLE",
                        textStyle: { fontSize: { magnitude: 26, unit: "PT" } },
                        paragraphStyle: {
                            namedStyleType: "NORMAL_TEXT",
                            direction: "LEFT_TO_RIGHT",
                            spaceAbove: { unit: "PT" },
                            spaceBelow: { magnitude: 3, unit: "PT" },
                            keepLinesTogether: true,
                            keepWithNext: true,
                            pageBreakBefore: false,
                        },
                    },
                    {
                        namedStyleType: "SUBTITLE",
                        textStyle: {
                            italic: false,
                            foregroundColor: { color: { rgbColor: { red: 0.4, green: 0.4, blue: 0.4 } } },
                            fontSize: { magnitude: 15, unit: "PT" },
                            weightedFontFamily: { fontFamily: "Arial", weight: 400 },
                        },
                        paragraphStyle: {
                            namedStyleType: "NORMAL_TEXT",
                            direction: "LEFT_TO_RIGHT",
                            spaceAbove: { unit: "PT" },
                            spaceBelow: { magnitude: 16, unit: "PT" },
                            keepLinesTogether: true,
                            keepWithNext: true,
                            pageBreakBefore: false,
                        },
                    },
                ],
            },
            revisionId: "ANeT5PQlsUDwq3soyg43Z1ryEgbH-MeWooo8R-swFY24aWKPhc9cOoKFGx8POPTXM5nyPMJp5Lj_2Bd5f2N3Xw",
            suggestionsViewMode: "SUGGESTIONS_INLINE",
            documentId: "1fMp6Wfal8e-AMH5F5gj-wscCFpYFp6CXMwrcZIFyatw",
        };
        userCtx.updateDocumentDetails({ documentContent: contents } as DocumentInfo);
        filterDocumentContent(contents);
        return;

        try {
            // const documentId = "1fMp6Wfal8e-AMH5F5gj-wscCFpYFp6CXMwrcZIFyatw";
            // const documentId = getDocumentId();

            const { token, documentId } = userCtx.documentDetails;
            if (token && documentId) {
                console.log("going wid deeze", token, "\n/////\n", documentId);
                console.log("4)");

                fetch("https://docs.googleapis.com/v1/documents/" + documentId, {
                    method: "GET",
                    headers: new Headers({ Authorization: "Bearer " + token }),
                })
                    .then(res => {
                        const response = res.json();
                        // console.log("response", response);
                        return response;
                    })
                    .then(contents => {
                        console.log("docs API call response (content)", JSON.stringify(contents));
                        userCtx.updateDocumentDetails({ documentContent: contents } as DocumentInfo);
                        filterDocumentContent(contents);
                    });
            } else {
                console.log("No authToken or google docs documentId found");
            }
        } catch (e) {
            console.log("error sending req ripppp:\n", e);
        }
    };

    // extract items that are H1 or H2 or H3 from entire body
    //TODO: convert all any's here to corresponding interface
    const filterDocumentContent = (unfilteredContent: any) => {
        const filteredHeadings = unfilteredContent.body.content.filter((item: any) => {
            const para = item.paragraph;
            if (!para) return false;
            const headingType = para.paragraphStyle?.namedStyleType;
            // return anything to this .filter() that starts with "HEADING_"
            return headingType.startsWith("HEADING_");
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
            console.log("popParentPath NUM TIMES", numTimes);
            console.log("popParentPath BEFORE", currentParentPath);
            currentParentPath = currentParentPath.slice(0, -numTimes);
            console.log("popParentPath AFTER", currentParentPath);
        };

        const dummyArray: IHeading[] = [
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

        const placeholderChild = (): IHeading => {
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

        // const headingsHierarchy: IIHeading[] = [];

        // const headingsHierarchy: string[] = [];
        // const headingsHierarchy: Array<[IHeading[], IHeading[]?]> = [];
        // const headingsHierarchy: Array<[string[], string[]?]> = [];

        const calcHeadingDiff = (parent: IHeading, child: IHeading) => {
            let diff = 0;
            if (parent.headingDigit && child.headingDigit) {
                diff = parent.headingDigit - child.headingDigit;
                // if the difference is a negative number (E.g. goes H1 to H2), just return 0 instead:
                diff = diff < 0 ? 0 : diff;
            }
            return diff;
        };

        const appendChildHeading = (child: IHeading) => {
            let currentHeadingLayer = headingsHierarchy;
            let currentParentHeading: IHeading | undefined;
            // let currentParentHeading = headingsHierarchy[0];

            // first find the parent we want to append to:
            currentParentPath.forEach((pathItem: string) => {
                // console.log("headingsHierarchy being searched:", JSON.stringify(currentHeadingLayer));
                const headingFound = currentHeadingLayer.find(element => element.headingId === pathItem);
                // console.log("headingFound", headingFound);
                // if we search all headings at this level of headingsHierarchy and find a match, assign new currentParentHeading:
                if (headingFound) {
                    currentParentHeading = headingFound;
                    // if there is another child to search, assign the found heading's child element to currentHeadingLayer to be searched on next iteration:
                    if (headingFound.children) {
                        currentHeadingLayer = headingFound.children;
                    }
                }
            });
            console.log("final parent Heading found:", currentParentHeading);

            // if we find a valid final parent heading, append the new child to it:
            if (currentParentHeading) {
                // first calculate how many children down we need to nest this child
                let diff = calcHeadingDiff(currentParentHeading, child);
                console.log("diff between headings", diff);

                // iterate and nest children till we hit the correct level heading should be at:
                for (let i = 0; i <= diff; i++) {
                    // if we are on last iteration insert the real child heading itself, else insert PLACEHOLDER
                    const heading = i === diff ? child : placeholderChild();
                    console.log("child getting appended", heading);

                    if (currentParentHeading?.children) {
                        currentParentHeading?.children.push(heading);
                    } else {
                        currentParentHeading["children"] = [heading];
                    }

                    // assign this new child to be the updated parent:
                    const newParent: IHeading | undefined = currentParentHeading?.children.find(
                        (element: IHeading) => element.headingId === heading.headingId
                    );
                    currentParentHeading = newParent ? newParent : currentParentHeading;

                    appendToParentPath(heading.headingId);
                }
            } else {
                console.error("No heading found.");
            }

            console.log("final headingsHierarchy", JSON.stringify(headingsHierarchy));
        };

        let headingsHierarchy: IHeading[] = [];
        let currentParentPath: string[] = [];
        let prevHeadingDigit = 0;

        // TODO: remove these 2, just hardcoded tests:
        // headingsHierarchy = dummyArray;
        // currentParentPath = ["2", "2.1"];

        // TODO: remove any here
        filteredHeadings.forEach((heading: any) => {
            // console.log("foreach heading", heading);
            const para = heading.paragraph;
            const headingType = para.paragraphStyle?.namedStyleType;
            const headingId = para.paragraphStyle?.headingId;
            const headingText = para.elements[0].textRun.content;
            const currHeadingDigit = headingType.substr(headingType.length - 1);
            const startIndex = heading.startIndex;
            const endIndex = heading.endIndex;

            const newChild = {
                headingId,
                headingText,
                headingDigit: currHeadingDigit,
                startIndex,
                endIndex,
            };

            console.log("current heading", currHeadingDigit, currentParentPath);

            // 0) base case - if our heading is a top lvl H1 OR if there is nothing currently stored in currentParentPath, then create a new item in our final array of arrays:
            if (currHeadingDigit === "1" || !currentParentPath) {
                console.log("0) base", headingText, "prev", prevHeadingDigit, "curr", currHeadingDigit);

                const headingDiff = prevHeadingDigit - currHeadingDigit;
                console.log("basecase headingDiff", headingDiff);
                // pop n from parent path where n is the diff between prev and curr heading digit
                popParentPath(headingDiff + 1);
                console.log("basecase new parent path:", currentParentPath);

                headingsHierarchy.push(newChild);
                // currentParentPath = headingsHierachy[heading];
                appendToParentPath(headingId);

                console.log("final headingsHierarchy", JSON.stringify(headingsHierarchy));
            }

            //  1) if the current heading IS going to be a child of parent (E.g. we go from Heading2 to Heading3):
            else if (currHeadingDigit > prevHeadingDigit) {
                console.log("1)", headingText, "prev", prevHeadingDigit, "curr", currHeadingDigit);
                // console.log("original headingsHierarchy", headingsHierarchy);

                // add new child to current parent:
                appendChildHeading(newChild);
            }

            // 2) else if previous heading & this heading should be on same level
            else if (currHeadingDigit === prevHeadingDigit) {
                console.log("2)", headingText, "prev", prevHeadingDigit, "curr", currHeadingDigit);

                // pop one from parent path
                popParentPath();
                // add new child to current parent
                appendChildHeading(newChild);
            }

            // 3) else if current heading is bigger than previous heading (E.g. we go from Heading2 to Heading1)
            else if (currHeadingDigit < prevHeadingDigit) {
                console.log("3)", headingText, "prev", prevHeadingDigit, "curr", currHeadingDigit);
                const headingDiff = prevHeadingDigit - currHeadingDigit;

                // pop n from parent path where n is the diff between prev and curr heading digit
                popParentPath(headingDiff + 1);
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
        // // // //             let currentList: IHeading[] = [];

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
        console.log("final filteredContent", JSON.stringify(headingsHierarchy));
        setDocumentContent(headingsHierarchy);
        // setDocumentContent(finalResponse);
    };

    // async function handleAuthenticate() {
    //     const authUrl = getAuthUrl();
    //     window.location.href = authUrl;
    // }

    //TODO: remove unneeded parameter here now
    // const handleUserLogin = (authDetails: CodeResponse | undefined) => {
    //     try {
    //         const authInstance = gapi.auth2.getAuthInstance();
    //         authInstance.signIn();
    //         // setAuth2();
    //         // setUserAuth(authDetails);
    //     } catch (e) {
    //         console.log("error running gapi.auth2.getAuthInstance():\n", e);
    //     }
    // };

    // main set of steps to fire on load of extension:
    const onLoad = () => {
        console.log("1)");
        // getDocumentId();
        console.log("3)");
        fetchFileContents();
    };

    return thirdPartyCookiesEnabled ? (
        <div className="message">
            <p>Third-party cookies are disabled in your browser. Please enable them to continue using this site.</p>
        </div>
    ) : (
        <div>
            {/* <div onClick={() => handleAuthenticate()}>Sign In</div> */}
            <Login />
            <Logout />
            {/* {googleAuth && googleAuth.isSignedIn && <button onClick={fetchFileContents}>Fetch Contents!</button>} */}
            {/* <button onClick={() => googleAuth?.signIn()}>Sign In V3</button> */}
            <button onClick={onLoad}>Fetch Contents!</button>
            <div className="headings">
                <ul>
                    <Headings headings={documentContent} />
                </ul>
            </div>
        </div>
    );
};

export default SidePanel;
