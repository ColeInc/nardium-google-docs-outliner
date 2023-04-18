import React, { ReactNode, useState } from "react";
import UserContext from "./user-context";
import { GoogleAuthDetails } from "../models";

interface UserProviderProps {
    children: ReactNode;
}

const UserProvider = (props: UserProviderProps) => {
    const [userDetails, setUserDetails] = useState<GoogleAuthDetails | undefined>(undefined);
    console.log("userDeatils", userDetails);

    const updateUserDetails = (details: GoogleAuthDetails) => {
        setUserDetails(prevState => {
            console.log("prevState", prevState);
            console.log("dis what we setting context to look like:", { ...prevState, details });
            return { ...prevState, ...details } as GoogleAuthDetails;
            // return { ...details } as GoogleAuthDetails;
        });
    };

    const userContext = {
        userDetails,
        updateUserDetails,
    };
    return <UserContext.Provider value={userContext}>{props.children}</UserContext.Provider>;
};

export default UserProvider;
