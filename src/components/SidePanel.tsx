import React, { useContext, useEffect, useState } from "react";
import DocumentContext from "../context/document-context";
import HeadingsWrapper from "./HeadingsWrapper";
import Login from "./Login";
import "./SidePanel.css";

const SidePanel = () => {
    const documentCtx = useContext(DocumentContext);
    const { isLoggedIn } = documentCtx.documentDetails;
    const [thirdPartyCookiesEnabled, setThirdPartyCookiesEnabled] = useState(false);

    useEffect(() => {
        console.log("cookies enabled?", navigator.cookieEnabled);

        if (navigator.cookieEnabled) {
            setThirdPartyCookiesEnabled(false);
        } else {
            setThirdPartyCookiesEnabled(true);
            console.error("Cookies are not enabled in the current environment.");
            // alert("please enable 3rd party cookies!");
        }
    }, []);

    // main set of steps to fire on load of extension:
    // const onLoad = () => {
    //     console.log("1)");
    //     getDocumentId();
    //     console.log("3)");
    //     fetchFileContents();
    // };

    if (thirdPartyCookiesEnabled) {
        return (
            <div className="message">
                <p>Third-party cookies are disabled in your browser. Please enable them to continue using this site.</p>
            </div>
        );
    }

    return (
        <div className="side-panel-container">
            <div className="side-panel">
                <h1>Nardium</h1>

                {!isLoggedIn ? <Login /> : <HeadingsWrapper />}

                <button>SETTINGS</button>
            </div>
        </div>
    );
};

export default SidePanel;
