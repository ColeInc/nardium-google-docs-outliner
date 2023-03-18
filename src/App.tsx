import React, { useEffect, useState } from "react";
import SidePanel from "./components/SidePanel";
import "./App.css";
import { gapi } from "gapi-script";

const clientId = process.env.REACT_CLIENT_ID || "";
const apiKey = process.env.REACT_API_KEY || "";
const scopes = "https://www.googleapis.com/auth/documents";

function App() {
    const [accessToken, setAccessToken] = useState("");
    const [documentContent, setDocumentContent] = useState<any>();

    useEffect(() => {
        const start = () => {
            gapi.client.init({ apiKey, clientId, scope: scopes });
        };

        gapi.load("client:auth2", start);
    }, []);

    // extract items that are H1 or H2 or H3 from entire body
    const filterDocumentContent = (unfilteredContent: any) => {
        const content = unfilteredContent.body.content.filter((item: any) => {
            const para = item.paragraph;
            if (!para) return false;
            const headingType = para.paragraphStyle?.namedStyleType;
            return headingType === "HEADING_1" || headingType === "HEADING_2" || headingType === "HEADING_3";
            // if (headingType === "HEADING_1" || headingType === "HEADING_2" || headingType === "HEADING_3") {
            //     return item
            // };
        });
        setDocumentContent(content);
    };

    // get access token of logged in user, then use it to call google docs API to fetch document info
    const fetchFileContents = () => {
        // Get the current user's Google Drive API access token
        const authResponse = gapi.auth.getToken();
        const promise = Promise.resolve(authResponse);

        promise.then(authResponse => {
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
    };

    return (
        <div className="app-container">
            <h1>Nardium</h1>
            <SidePanel />
            <button onClick={fetchFileContents}>Fetch Contents!</button>
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
}

export default App;
