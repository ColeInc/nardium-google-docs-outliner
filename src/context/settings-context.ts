import React from "react";
import { Settings } from "../models/settings";

export const defaultSettings: Settings = {
    userZoom: 11,
    userHeadingLvl: 3,
    darkTheme: false,
    mainPanelCollapsed: false,
    settingsPanelCollapsed: false,
};

const SettingsContext = React.createContext({
    userSettings: defaultSettings,
    updateUserSettings: (settings: Settings) => {},
    incrementUserZoom: () => {},
    decrementUserZoom: () => {},
    toggleDarkMode: () => {},
    toggleMainPanel: () => {},
    toggleSettingsPanel: () => {},
});

export default SettingsContext;
