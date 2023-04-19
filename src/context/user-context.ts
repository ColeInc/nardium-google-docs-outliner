import React from "react";
import { GoogleAuthDetails, IUserContext } from "../models";
import { defaultUserState } from "./UserProvider";

const UserContext = React.createContext<IUserContext>({
    userDetails: defaultUserState,
    updateUserDetails: (details: GoogleAuthDetails) => {},
});

export default UserContext;
