import React, { ReactNode, useEffect, useMemo, useState } from "react";
import SettingsContext, { defaultSettings } from "./settings-context";
import { Settings } from "../models/settings";
import { setLocalStorage } from "../helpers/setLocalStorage";
import { getLocalStorage } from "../helpers/getLocalStorage";

const SettingsProvider = (props: { children: ReactNode }) => {
    const [userSettings, setUserSettings] = useState<Settings>(defaultSettings);
    const { darkTheme } = userSettings;

    // // // On initial page load check localStorage for all settings, and if anything is found then overwrite default settings:
    // // useEffect(() => {
    // //     getLocalStorage("userZoom")
    // //         .then(response => {
    // //             updateUserSettings({ userZoom: response.data["userZoom"] } as Settings);
    // //         })
    // //         .catch(error => {
    // //             console.error(error);
    // //         });
    // //     getLocalStorage("userHeadingLvl")
    // //         .then(response => {
    // //             updateUserSettings({ userHeadingLvl: response.data["userHeadingLvl"] } as Settings);
    // //         })
    // //         .catch(error => {
    // //             console.error(error);
    // //         });
    // //     getLocalStorage("darkTheme")
    // //         .then(response => {
    // //             // response.data["darkTheme"] ? toggleDarkMode() : null;
    // //             updateUserSettings({ darkTheme: response.data["darkTheme"] } as Settings);
    // //         })
    // //         .catch(error => {
    // //             console.error(error);
    // //         });
    // //     getLocalStorage("mainPanelCollapsed")
    // //         .then(response => {
    // //             updateUserSettings({ mainPanelCollapsed: response.data["mainPanelCollapsed"] } as Settings);
    // //         })
    // //         .catch(error => {
    // //             console.error(error);
    // //         });
    // //     getLocalStorage("sidePanelCollapsed")
    // //         .then(response => {
    // //             updateUserSettings({ settingsPanelCollapsed: response.data["sidePanelCollapsed"] } as Settings);
    // //         })
    // //         .catch(error => {
    // //             console.error(error);
    // //         });
    // // }, []);

    // // // On initial page load check localStorage for all settings, and if anything is found then overwrite default settings:
    // // useEffect(() => {
    // //     Promise.all([
    // //         getLocalStorage("userZoom"),
    // //         getLocalStorage("userHeadingLvl"),
    // //         getLocalStorage("darkTheme"),
    // //         getLocalStorage("mainPanelCollapsed"),
    // //         getLocalStorage("sidePanelCollapsed"),
    // //     ])
    // //         .then(
    // //             ([
    // //                 userZoomResponse,
    // //                 userHeadingLvlResponse,
    // //                 darkThemeResponse,
    // //                 mainPanelResponse,
    // //                 sidePanelResponse,
    // //             ]) => {
    // //                 const settings = defaultSettings;

    // //                 console.log("userZoomResponse.data", userZoomResponse.data);
    // //                 console.log("userHeadingLvlResponse.data", userHeadingLvlResponse.data);
    // //                 console.log("darkThemeResponse.data", darkThemeResponse.data);
    // //                 console.log("mainPanelResponse.data", mainPanelResponse.data);
    // //                 console.log("sidePanelResponse.data", sidePanelResponse.data);

    // //                 if (userZoomResponse.data["userZoom"]) {
    // //                     settings.userZoom = userZoomResponse.data["userZoom"];
    // //                 }
    // //                 if (userHeadingLvlResponse.data["userHeadingLvl"]) {
    // //                     settings.userHeadingLvl = userHeadingLvlResponse.data["userHeadingLvl"];
    // //                 }
    // //                 if (darkThemeResponse.data["darkTheme"]) {
    // //                     settings.darkTheme = darkThemeResponse.data["darkTheme"];
    // //                 }
    // //                 if (mainPanelResponse.data["mainPanelCollapsed"]) {
    // //                     settings.mainPanelCollapsed = mainPanelResponse.data["mainPanelCollapsed"];
    // //                 }
    // //                 if (sidePanelResponse.data["sidePanelCollapsed"]) {
    // //                     settings.settingsPanelCollapsed = sidePanelResponse.data["sidePanelCollapsed"];
    // //                 }

    // //                 console.log("final loaded settings", settings);
    // //                 updateUserSettings(settings);
    // //             }
    // //         )
    // //         .catch(error => {
    // //             console.log("LocalStorage item not found. ", error);
    // //         });
    // // }, []);

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

                results.forEach(result => {
                    if (result.status === "fulfilled") {
                        console.log("cole item", result);
                        const { data } = result.value;
                        // console.log("cole key data", key, data);
                        // console.log("cole key === 'userZoom'", key === "userZoom");
                        // console.log("cole data['userZoom']", data["userZoom"]);

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
                        console.error(result.reason); // Handle individual promise failure
                    }
                });

                console.log("final loaded settings", settings);
                updateUserSettings(settings);
            })
            .catch(error => {
                console.error("An error occurred:", error);
            });
    }, []);

    // TODO: extract each individual color out into json object so we can refer to them by like darktheme.fontcolor
    useEffect(() => {
        if (darkTheme) {
            document.documentElement.style.setProperty("--color1", "#070707");
            document.documentElement.style.setProperty("--color2", "#414141");
            document.documentElement.style.setProperty("--color3", "#242222");
            document.documentElement.style.setProperty("--font-color", "#e2e2e2");
            document.documentElement.style.setProperty("--font-highlighted-color", "#f6f3f3");
            document.documentElement.style.setProperty("--chevron-color", "#414141");
            document.documentElement.style.setProperty("--chevron-highlighted-color", "#c8bebe");
        } else {
            document.documentElement.style.setProperty("--color1", "#edf2fa");
            document.documentElement.style.setProperty("--color2", "#e1e4e7");
            document.documentElement.style.setProperty("--color3", "#cbcfd1");
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