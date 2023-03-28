import React, { ReactNode, useState } from "react";
import UserContext from "./user-context";

interface UserProviderProps {
    children: ReactNode;
}

const UserProvider = (props: UserProviderProps) => {
    const [userDetails, setUserDetails] = useState<GoogleApiOAuth2TokenObject | undefined>(undefined);

    const updateUserDetails = (details: GoogleApiOAuth2TokenObject) => {
        setUserDetails(details);
    };

    const userContext = {
        userDetails,
        updateUserDetails,
    };
    return <UserContext.Provider value={userContext}>{props.children}</UserContext.Provider>;
};

export default UserProvider;
