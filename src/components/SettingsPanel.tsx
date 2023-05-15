import React, { useContext } from "react";
import "./SettingsPanel.css";
import SettingsContext from "../context/settings-context";
import { setLocalStorage } from "../helpers/setLocalStorage";
import { Settings } from "../models/settings";

export const SettingsPanel = () => {
    const settingsCtx = useContext(SettingsContext);
    const { updateUserSettings, incrementUserZoom, decrementUserZoom } = settingsCtx;

    const handleVisibleHeadings = (headingLvl: number) => {
        updateUserSettings({ userHeadingLvl: headingLvl } as Settings);

        // save current user hierarchy into LocalStorage:
        setLocalStorage("userHeadingLvl", { userHeadingLvl: headingLvl });
    };

    return (
        <div className="settings-container">
            <div className="zoom-controls-container">
                {/* <button onClick={() => setUserZoom(s => ++s)}>+</button>
                <button onClick={() => setUserZoom(s => --s)}>-</button> */}
                <button onClick={() => incrementUserZoom()}>+</button>
                <button onClick={() => decrementUserZoom()}>-</button>
            </div>

            <div className="headings-grid-container">
                <button onClick={() => handleVisibleHeadings(1)}>H1</button>
                <button onClick={() => handleVisibleHeadings(2)}>H2</button>
                <button onClick={() => handleVisibleHeadings(3)}>H3</button>
                <button onClick={() => handleVisibleHeadings(4)}>H4</button>
                <button onClick={() => handleVisibleHeadings(5)}>H5</button>
                <button onClick={() => handleVisibleHeadings(6)}>H6</button>
            </div>
            <br />
        </div>
    );
};

export default SettingsPanel;
