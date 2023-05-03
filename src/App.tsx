import React from "react";
import DocumentProvider from "./context/DocumentProvider";
import SidePanel from "./components/SidePanel";
import "./App.css";

const App = () => {
    return (
        <DocumentProvider>
            <SidePanel />
        </DocumentProvider>
    );
};

export default App;
