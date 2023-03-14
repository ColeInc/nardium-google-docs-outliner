import React, { useState } from "react";
// import { getAuthUrl } from "../utils/auth";

const SidePanel = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [client, setClient] = useState(null);

    async function handleAuthenticate() {
        // const authUrl = getAuthUrl();
        // window.location.href = authUrl;
    }

    return <div>{/* <div onClick={() => handleAuthenticate()}>Sign In</div> */}</div>;
};

export default SidePanel;
