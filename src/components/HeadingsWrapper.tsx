import React, { FC, useContext, useEffect } from "react";
import DocumentContext from "../context/document-context";
import SettingsContext from "../context/settings-context";
import Headings from "./Headings";
import "./HeadingsWrapper.css";

const HeadingsWrapper: FC = () => {
    const documentCtx = useContext(DocumentContext);
    const { documentContent } = documentCtx.documentDetails;

    const settingsCtx = useContext(SettingsContext);
    const { userSettings } = settingsCtx;
    const { userZoom } = userSettings;

    // any time user clicks +/- zoom buttons, update corresponding --user-zoom CSS variable
    useEffect(() => {
        document.documentElement.style.setProperty("--user-zoom", `${userZoom}px`);
    }, [userZoom]);

    return (
        <>
            {documentContent && (
                <div className="headings">
                    <ul>
                        <Headings headings={documentContent} />
                    </ul>
                </div>
            )}
        </>
    );
};

export default HeadingsWrapper;
