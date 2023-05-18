import React from "react";
import { BrowserRouter } from "react-router-dom";
import DocumentProvider from "./context/DocumentProvider";
import SettingsProvider from "./context/SettingsProvider";
import SidePanel from "./components/SidePanel";
import "./App.css";

const App = () => {
    return (
        <BrowserRouter>
            <SettingsProvider>
                <DocumentProvider>
                    <SidePanel />
                </DocumentProvider>
            </SettingsProvider>
        </BrowserRouter>
    );
};

export default App;
