import React from "react";
import SidePanel from "./components/SidePanel";
import DocumentProvider from "./context/DocumentProvider";
import "./App.css";

const App = () => {
    return (
        <DocumentProvider>
            <div className="app-container">
                <h1>Nardium</h1>
                <SidePanel />
            </div>
        </DocumentProvider>
    );
};

export default App;
