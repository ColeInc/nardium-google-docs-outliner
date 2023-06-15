import React, { useEffect, useState } from "react";

export const useActiveTab = () => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                // User has switched back to the tab
                setIsActive(true);
            } else {
                setIsActive(false);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return isActive;
};
