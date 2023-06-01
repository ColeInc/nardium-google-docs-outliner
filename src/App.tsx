import React from "react";
import { BrowserRouter } from "react-router-dom";
import { useMixPanelAnalytics } from "./hooks/useMixPanelAnalytics";
import DocumentProvider from "./context/DocumentProvider";
import SettingsProvider from "./context/SettingsProvider";
import LoadingProvider from "./context/LoadingProvider";
import SidePanel from "./components/SidePanel";
import "./App.css";

const App = () => {
    const { initMixPanel } = useMixPanelAnalytics();
    initMixPanel();

    return (
        <BrowserRouter>
            <SettingsProvider>
                <DocumentProvider>
                    <LoadingProvider>
                        <SidePanel />
                    </LoadingProvider>
                </DocumentProvider>
            </SettingsProvider>
        </BrowserRouter>
    );
};

export default App;
