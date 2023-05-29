import React, { useContext, useEffect, useRef, useState } from "react";
import SettingsContext from "../context/settings-context";
import { useInitialAppLoad } from "../hooks/useInitialAppLoad";
import DocumentContext from "../context/document-context";
import LoadingContext from "../context/loading-context";
import SettingsGear from "../../public/assets/settings-gear.svg";
import Chevron from "../../public/assets/chevron.svg";
import HeadingsWrapper from "./HeadingsWrapper";
import LoadingSpinner from "./LoadingSpinner";
import SettingsPanel from "./SettingsPanel";
import Login from "./Login";
import "./SidePanel.css";

const SidePanel = () => {
    const [thirdPartyCookiesEnabled, setThirdPartyCookiesEnabled] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // const [isLoading, setIsLoading] = useState(true);
    const isFirstRender = useRef(true);

    const documentCtx = useContext(DocumentContext);
    const { isLoggedIn } = documentCtx.documentDetails;

    const settingsCtx = useContext(SettingsContext);
    const { userSettings, toggleMainPanel, toggleSettingsPanel } = settingsCtx;
    const { mainPanelCollapsed, settingsPanelCollapsed } = userSettings;

    const loadingCtx = useContext(LoadingContext);
    const { loadingState } = loadingCtx;
    const isLoading = loadingState.loginLoading;

    const VERSION_NUMBER = "v0.1.0";

    useInitialAppLoad(); // trigger all logic that should run on first app load

    // calculate appropriate side panel px width:
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

    // TODO: delete this useless print statement
    useEffect(() => {
        console.log("isLoading = ", isLoading);
    }, [isLoading]);

    // dynamically calculate sidepanel total width depending on page width:
    const sidePanelWidth = windowWidth > 1460 ? 285 + 0.5 * (windowWidth - 1600) : 285;

    return (
        <>
            <div
                className={`${mainPanelCollapsed ? "side-panel-collapsed" : ""} side-panel-container`}
                style={{ width: sidePanelWidth }}
            >
                <div className="side-panel">
                    {isLoading && (
                        <div className="loading-spinner-container">
                            <LoadingSpinner />
                        </div>
                    )}

                    {!isLoggedIn && <Login isLoading={isLoading} isFirstRender={isFirstRender} />}
                    {isLoggedIn && <HeadingsWrapper />}

                    <div className="side-panel-config-container">
                        <SettingsPanel isVisible={isLoggedIn && settingsPanelCollapsed} />
                        <div className="side-panel-bottom-banner">
                            <h1>Nardium</h1>
                            <p>{VERSION_NUMBER}</p>

                            {isLoggedIn && (
                                <button
                                    className="toggle-settings-button"
                                    onClick={toggleSettingsPanel}
                                    title="Settings"
                                >
                                    <SettingsGear />
                                </button>
                            )}

                            <button
                                className="collapse-button"
                                onClick={toggleMainPanel}
                                title="Hide Document Outline Panel"
                            >
                                <Chevron />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <button
                className={`${mainPanelCollapsed ? "side-panel-collapsed" : ""} expand-button`}
                onClick={toggleMainPanel}
                title="Show Document Outline"
            >
                <Chevron />
            </button>
        </>
    );
};

export default SidePanel;
