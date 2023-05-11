import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// const rootElement = document.createElement("div");
// rootElement.id = "nardium";
// document.body.appendChild(rootElement);

// const rootElement = document.createElement("div");
// rootElement.id = "nardium";
// const leftSidebarContainer = document.getElementsByClassName("left-sidebar-container")[0]; // replacing the original google docs outline div with my one
// if (leftSidebarContainer) {
//     leftSidebarContainer.replaceWith(rootElement);
// }

const rootElement = document.createElement("div");
rootElement.id = "nardium";
// const leftSidebarContainer = document.getElementsByClassName("left-sidebar-container")[0] as HTMLElement; // replacing the original google docs outline div with my one
// const leftSidebarContainer = document.getElementsByClassName("left-sidebar-container")[0] as HTMLElement;
const leftSidebarContainer = document.querySelector(
    ".left-sidebar-container.docs-ui-unprintable.left-sidebar-container-animation"
) as HTMLElement;

if (leftSidebarContainer) {
    leftSidebarContainer.style.display = "none";
    leftSidebarContainer.style.setProperty("width", "0px", "important");
}
document.body.appendChild(rootElement);

const root = ReactDOM.createRoot(rootElement);
// const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
