import React, { FC, useContext } from "react";
import SettingsContext from "../context/settings-context";
import { setLocalStorage } from "../helpers/setLocalStorage";
import { Settings } from "../models/settings";
import "./SettingsPanel.css";
import PlusIcon from "../../public/assets/plus-icon.svg";
import MinusIcon from "../../public/assets/minus-icon.svg";

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
                    <button onClick={() => incrementUserZoom()}>
                        <PlusIcon />
                    </button>
                    <button onClick={() => decrementUserZoom()}>
                        <MinusIcon />
                    </button>
                </div>

                <div className="headings-grid-container">
                    <button onClick={() => handleVisibleHeadings(1)}>H1</button>
                    <button onClick={() => handleVisibleHeadings(2)}>H2</button>
                    <button onClick={() => handleVisibleHeadings(3)}>H3</button>
                    <button onClick={() => handleVisibleHeadings(4)}>H4</button>
                    <button onClick={() => handleVisibleHeadings(5)}>H5</button>
                    <button onClick={() => handleVisibleHeadings(6)}>H6</button>
                </div>
            </div>

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
        </div>
    );
};

export default SettingsPanel;
