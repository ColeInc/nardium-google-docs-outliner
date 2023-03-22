import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const clientId = process.env.REACT_CLIENT_ID || "";

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
