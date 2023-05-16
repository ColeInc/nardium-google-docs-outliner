import React, { useContext, useEffect, useState } from "react";
import Chevron from "../../public/assets/chevron.svg";
import DocumentContext from "../context/document-context";
import HeadingsWrapper from "./HeadingsWrapper";
import LoadingSpinner from "./LoadingSpinner";
import SettingsPanel from "./SettingsPanel";
import Login from "./Login";
import "./SidePanel.css";

const SidePanel = () => {
    const documentCtx = useContext(DocumentContext);
    const { isLoggedIn } = documentCtx.documentDetails;
    const [thirdPartyCookiesEnabled, setThirdPartyCookiesEnabled] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isLoading, setIsLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const version = "v0.1.0";

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        console.log("cookies enabled?", navigator.cookieEnabled);

        if (navigator.cookieEnabled) {
            setThirdPartyCookiesEnabled(false);
        } else {
            setThirdPartyCookiesEnabled(true);
            console.error("Cookies are not enabled in the current environment.");
        }
    }, []);

    if (thirdPartyCookiesEnabled) {
        return (
            <div className="message">
                <p>Third-party cookies are disabled in your browser. Please enable them to continue using this site.</p>
            </div>
        );
    }

    const togglePanelCollapsed = () => {
        setIsCollapsed(s => !s);
    };

    // dynamically calculate sidepanel total width depending on page width:
    const sidePanelWidth = windowWidth > 1460 ? 285 + 0.5 * (windowWidth - 1600) : 285;

    return (
        <>
            <div
                className={`${isCollapsed ? "side-panel-collapsed" : ""} side-panel-container`}
                style={{ width: sidePanelWidth }}
            >
                <div className="side-panel">
                    {isLoading && (
                        <div className="loading-spinner-container">
                            <LoadingSpinner />
                        </div>
                    )}

                    {/* TODO: perhaps global loading provider LoadingProvider */}
                    {!isLoggedIn ? (
                        <Login setIsLoading={setIsLoading} />
                    ) : (
                        <HeadingsWrapper setIsLoading={setIsLoading} />
                    )}

                    <div className="side-panel-config-container">
                        <SettingsPanel />
                        <div className="side-panel-bottom-banner">
                            <h1>Nardium</h1>
                            <p>{version}</p>
                            <button className="collapse-button" onClick={togglePanelCollapsed}>
                                <Chevron />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div style={{ position: "relative" }}> */}
            <button
                className={`${isCollapsed ? "side-panel-collapsed" : ""} expand-button`}
                onClick={togglePanelCollapsed}
                title="Show Document Outline"
            >
                <Chevron />
            </button>
            {/* </div> */}
        </>
    );
};

export default SidePanel;
