import React from "react";
import { GoogleAuthDetails, IUserContext } from "../models";

const defaultUserState = {
    token: "",
    email: "",
} as GoogleAuthDetails;

const UserContext = React.createContext<IUserContext>({
    userDetails: defaultUserState,
    updateUserDetails: (details: GoogleAuthDetails) => {},
});

export default UserContext;
