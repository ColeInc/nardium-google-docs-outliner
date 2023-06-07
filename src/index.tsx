import "@fontsource/inter";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.createElement("div");
rootElement.id = "nardium";
const leftSidebarContainer = document.querySelector(
    ".left-sidebar-container.docs-ui-unprintable.left-sidebar-container-animation"
) as HTMLElement;

if (leftSidebarContainer) {
    leftSidebarContainer.style.display = "none";
    leftSidebarContainer.style.setProperty("width", "0px", "important");
}
document.body.appendChild(rootElement);

const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
