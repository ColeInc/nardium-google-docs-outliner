import React from "react";
import { BrowserRouter } from "react-router-dom";
import DocumentProvider from "./context/DocumentProvider";
import SettingsProvider from "./context/SettingsProvider";
import LoadingProvider from "./context/LoadingProvider";
import SidePanel from "./components/SidePanel";
import "./App.css";

const App = () => {
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
