import React, { ReactNode, useEffect, useMemo, useState } from "react";
import SettingsContext, { defaultSettings } from "./settings-context";
import { setLocalStorage } from "../helpers/setLocalStorage";
import { getLocalStorage } from "../helpers/getLocalStorage";
import { Settings } from "../models/settings";

const SettingsProvider = (props: { children: ReactNode }) => {
    const [userSettings, setUserSettings] = useState<Settings>(defaultSettings);
    const { darkTheme } = userSettings;

    // On initial page load check localStorage for all settings, and if anything is found then overwrite default settings:
    useEffect(() => {
        Promise.allSettled([
            getLocalStorage("userZoom"),
            getLocalStorage("userHeadingLvl"),
            getLocalStorage("darkTheme"),
            getLocalStorage("mainPanelCollapsed"),
            getLocalStorage("settingsPanelCollapsed"),
        ])
            .then(results => {
                const settings = defaultSettings;
                settings.mainPanelCollapsed = false; // having this change here prevents the 1 second flash displaying panel before localStorage loads and shows user had it collapsed.

                results.forEach(result => {
                    if (result.status === "fulfilled") {
                        if (result.value.error) {
                            return;
                        }

                        const { data } = result.value;
                        // console.log("cole localstorage:", data);
                        if (data["userZoom"]) {
                            settings.userZoom = data["userZoom"];
                        }
                        if (data["userHeadingLvl"]) {
                            settings.userHeadingLvl = data["userHeadingLvl"];
                        }
                        if (data["darkTheme"]) {
                            settings.darkTheme = data["darkTheme"];
                        }
                        if (data["mainPanelCollapsed"]) {
                            settings.mainPanelCollapsed = data["mainPanelCollapsed"];
                        }
                        if (data["settingsPanelCollapsed"]) {
                            settings.settingsPanelCollapsed = data["settingsPanelCollapsed"];
                        }
                    } else if (result.status === "rejected") {
                        console.error(result.reason); // handle individual promise failure
                    }
                });

                // console.log("final loaded settings", settings);
                updateUserSettings(settings);
            })
            .catch(error => {
                console.log("Unable to fetch item from localStorage. Error given was:", error);
            });
    }, []);

    // TODO: extract each individual color out into json object so we can refer to them by like darktheme.fontcolor
    useEffect(() => {
        if (darkTheme) {
            document.documentElement.style.setProperty("--color1", "#070707");
            document.documentElement.style.setProperty("--color2", "#414141");
            document.documentElement.style.setProperty("--color3", "#242222");
            document.documentElement.style.setProperty("--color4", "#242222");
            document.documentElement.style.setProperty("--font-color", "#e2e2e2");
            document.documentElement.style.setProperty("--font-highlighted-color", "#f6f3f3");
            document.documentElement.style.setProperty("--chevron-color", "#414141");
            document.documentElement.style.setProperty("--chevron-highlighted-color", "#c8bebe");
        } else {
            document.documentElement.style.setProperty("--color1", "#edf2fa");
            document.documentElement.style.setProperty("--color2", "#e1e4e7");
            document.documentElement.style.setProperty("--color3", "#cbcfd1");
            document.documentElement.style.setProperty("--color4", "#fff");
            document.documentElement.style.setProperty("--font-color", "#262424");
            document.documentElement.style.setProperty("--font-highlighted-color", "#000000");
            document.documentElement.style.setProperty("--chevron-color", "#c9bcbc");
            document.documentElement.style.setProperty("--chevron-highlighted-color", "#5c5959");
        }
    }, [darkTheme]);

    const updateUserSettings = (settings: Settings) => {
        setUserSettings(prevState => {
            return { ...prevState, ...settings };
        });
    };

    const incrementUserZoom = () => {
        setUserSettings(prevState => {
            const userZoom = prevState.userZoom + 0.25;
            setLocalStorage("userZoom", { userZoom });
            return { ...prevState, userZoom };
        });
    };

    const decrementUserZoom = () => {
        setUserSettings(prevState => {
            const userZoom = prevState.userZoom - 0.25;
            setLocalStorage("userZoom", { userZoom });
            return { ...prevState, userZoom };
        });
    };

    const toggleDarkMode = () => {
        setUserSettings(prevState => {
            const darkTheme = !prevState.darkTheme;
            setLocalStorage("darkTheme", { darkTheme }); // persist settings to localStorage
            return { ...prevState, darkTheme };
        });
    };

    const toggleMainPanel = () => {
        setUserSettings(prevState => {
            const mainPanelCollapsed = !prevState.mainPanelCollapsed;
            setLocalStorage("mainPanelCollapsed", { mainPanelCollapsed }); // persist settings to localStorage
            return { ...prevState, mainPanelCollapsed };
        });
    };

    const toggleSettingsPanel = () => {
        setUserSettings(prevState => {
            const settingsPanelCollapsed = !prevState.settingsPanelCollapsed;
            setLocalStorage("settingsPanelCollapsed", { settingsPanelCollapsed }); // persist settings to localStorage
            return { ...prevState, settingsPanelCollapsed };
        });
    };

    const settingsContext = useMemo(
        () => ({
            userSettings,
            updateUserSettings,
            incrementUserZoom,
            decrementUserZoom,
            toggleDarkMode,
            toggleMainPanel,
            toggleSettingsPanel,
        }),
        [userSettings, updateUserSettings]
    );

    return <SettingsContext.Provider value={settingsContext}>{props.children}</SettingsContext.Provider>;
};

export default SettingsProvider;
