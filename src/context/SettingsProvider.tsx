import React, { ReactNode, useMemo, useState } from "react";
import SettingsContext, { defaultSettings } from "./settings-context";
import { Settings } from "../models/settings";

const SettingsProvider = (props: { children: ReactNode }) => {
    const [userSettings, setUserSettings] = useState<Settings>(defaultSettings);

    const updateUserSettings = (settings: Settings) => {
        setUserSettings(prevState => {
            return { ...prevState, ...settings };
        });
    };

    const incrementUserZoom = () => {
        setUserSettings(prevState => {
            return { ...prevState, userZoom: prevState.userZoom + 1 } as Settings;
        });
    };

    const decrementUserZoom = () => {
        setUserSettings(prevState => {
            return { ...prevState, userZoom: prevState.userZoom - 1 } as Settings;
        });
    };

    const settingsContext = useMemo(
        () => ({ userSettings, updateUserSettings, incrementUserZoom, decrementUserZoom }),
        [userSettings, updateUserSettings]
    );

    return <SettingsContext.Provider value={settingsContext}>{props.children}</SettingsContext.Provider>;
};

export default SettingsProvider;
