import React, { ReactNode, useEffect, useMemo, useState } from "react";
import SettingsContext, { defaultSettings } from "./settings-context";
import { Settings } from "../models/settings";

const SettingsProvider = (props: { children: ReactNode }) => {
    const [userSettings, setUserSettings] = useState<Settings>(defaultSettings);
    const { darkTheme } = userSettings;

    // TODO: extract each individual color out into json object so we can refer to them by like darktheme.fontcolor
    useEffect(() => {
        if (darkTheme) {
            document.documentElement.style.setProperty("--color1", "#070707");
            document.documentElement.style.setProperty("--color2", "#414141");
            document.documentElement.style.setProperty("--color3", "#242222");
            document.documentElement.style.setProperty("--font-color", "#e2e2e2");
        } else {
            document.documentElement.style.setProperty("--color1", "#edf2fa");
            document.documentElement.style.setProperty("--color2", "#efefef");
            document.documentElement.style.setProperty("--color3", "#a49f9f");
            document.documentElement.style.setProperty("--font-color", "#222222");
        }
    }, [darkTheme]);

    const updateUserSettings = (settings: Settings) => {
        setUserSettings(prevState => {
            return { ...prevState, ...settings };
        });
    };

    const incrementUserZoom = () => {
        setUserSettings(prevState => {
            return { ...prevState, userZoom: prevState.userZoom + 1 };
        });
    };

    const decrementUserZoom = () => {
        setUserSettings(prevState => {
            return { ...prevState, userZoom: prevState.userZoom - 1 };
        });
    };

    const toggleDarkMode = () => {
        setUserSettings(prevState => {
            return { ...prevState, darkTheme: !prevState.darkTheme };
        });
    };

    const settingsContext = useMemo(
        () => ({ userSettings, updateUserSettings, incrementUserZoom, decrementUserZoom, toggleDarkMode }),
        [userSettings, updateUserSettings]
    );

    return <SettingsContext.Provider value={settingsContext}>{props.children}</SettingsContext.Provider>;
};

export default SettingsProvider;
