import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const rootElement = document.createElement("div");
rootElement.id = "nardium";
document.body.appendChild(rootElement);

// const rootElement = document.createElement("div");
// rootElement.id = "nardium";
// const leftSidebarContainer = document.getElementsByClassName("left-sidebar-container")[0]; // replacing the original google docs outline div with my one
// if (leftSidebarContainer) {
//     leftSidebarContainer.replaceWith(rootElement);
// }

const root = ReactDOM.createRoot(rootElement);
// const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
