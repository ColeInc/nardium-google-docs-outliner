import React, { useContext } from "react";
import SettingsContext from "../context/settings-context";
import { setLocalStorage } from "../helpers/setLocalStorage";
import PlusIcon from "../../public/assets/plus-icon.svg";
import MinusIcon from "../../public/assets/minus-icon.svg";
import { Settings } from "../models/settings";
import "./SettingsPanel.css";
import Logout from "./Logout";

const SUB_HEADINGS = [1, 2, 3, 4, 5, 6];

export const SettingsPanel = ({ isVisible }: { isVisible: boolean }) => {
    const settingsCtx = useContext(SettingsContext);
    const { userSettings, updateUserSettings, incrementUserZoom, decrementUserZoom, toggleDarkMode } = settingsCtx;

    const handleVisibleHeadings = (headingLvl: number) => {
        updateUserSettings({ userHeadingLvl: headingLvl } as Settings);
        // save current user hierarchy into LocalStorage:
        setLocalStorage("userHeadingLvl", { userHeadingLvl: headingLvl });
    };

    return (
        <div className={`${!isVisible ? "settings-hidden" : ""} settings-container`}>
            <div className="settings-controls-row">
                <div className="zoom-controls-container">
                    <button onClick={() => incrementUserZoom()} title="Zoom In">
                        <PlusIcon />
                    </button>
                    <button onClick={() => decrementUserZoom()} title="Zoom Out">
                        <MinusIcon />
                    </button>
                </div>

                <div className="headings-grid-container">
                    {SUB_HEADINGS.map(headingDigit => {
                        const active = userSettings.userHeadingLvl === headingDigit;
                        return (
                            <button
                                onClick={() => handleVisibleHeadings(headingDigit)}
                                className={active ? "settings-grid-active" : ""}
                                title={`Display Heading ${headingDigit}`}
                            >{`H${headingDigit}`}</button>
                        );
                    })}
                </div>
            </div>

            <div className="settings-darkmode-logout-row">
                <div className="dark-theme-switch">
                    <input
                        id="theme-switch"
                        className="switch"
                        type="checkbox"
                        checked={userSettings.darkTheme}
                        onChange={() => toggleDarkMode()}
                    />
                    <label htmlFor="theme-switch"></label>
                    <p>Dark Mode</p>
                </div>

                <Logout />
            </div>
        </div>
    );
};

export default SettingsPanel;
