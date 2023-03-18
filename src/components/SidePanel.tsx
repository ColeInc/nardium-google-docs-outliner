import React, { useState } from "react";
import { getAuthUrl } from "../utils/auth";
import Login from "../utils/login";
import Logout from "../utils/logout";

const SidePanel = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [client, setClient] = useState(null);

    async function handleAuthenticate() {
        const authUrl = getAuthUrl();
        window.location.href = authUrl;
    }

    return (
        <div>
            {/* <div onClick={() => handleAuthenticate()}>Sign In</div> */}
            <Login />
            <Logout />
        </div>
    );
};

export default SidePanel;
