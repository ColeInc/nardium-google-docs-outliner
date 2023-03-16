import React, { useEffect, useState } from "react";
import SidePanel from "./components/SidePanel";
import "./App.css";
import { gapi } from "gapi-script";

const clientId = process.env.REACT_CLIENT_ID || "";
const apiKey = process.env.REACT_API_KEY || "";
const scopes = "https://www.googleapis.com/auth/documents";

function App() {
    const [accessToken, setAccessToken] = useState("");
    const [documentContent, setDocumentContent] = useState();

    useEffect(() => {
        const start = () => {
            gapi.client.init({ apiKey, clientId, scope: scopes });
        };

        gapi.load("client:auth2", start);
    }, []);

    const fetchFileContents = () => {
        setAccessToken(gapi.auth.getToken().access_token);
        const documentId = "18tRHWnmXnJijMa8Q1JDmjvpWnc7BSt1R9Q5iGeqs9Ok";

        console.log("access token", accessToken);

        fetch("https://docs.googleapis.com/v1/documents/" + documentId, {
            method: "GET",
            headers: new Headers({ Authorization: "Bearer " + accessToken }),
        })
            .then(res => {
                const response = res.json();
                console.log("response", response);
                return response;
            })
            .then(contents => {
                console.log("content", contents);
                setDocumentContent(contents);
            });
    };

    return (
        <div className="app-container">
            <h1>Nardium yo yo</h1>
            <SidePanel />
            <button onClick={fetchFileContents}>Fetch Contents!</button>
            <p>{documentContent}</p>
        </div>
    );
}

export default App;
