import React from "react";
import DocumentProvider from "./context/DocumentProvider";
import SettingsProvider from "./context/SettingsProvider";
import SidePanel from "./components/SidePanel";
import "./App.css";

const App = () => {
    return (
        <SettingsProvider>
            <DocumentProvider>
                <SidePanel />
            </DocumentProvider>
        </SettingsProvider>
    );
};

export default App;
