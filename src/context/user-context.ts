import React from "react";

const defaultUserState = {
    token_type: "",
    access_token: "",
    scope: "",
    login_hint: "",
    expires_in: "",
    id_token: "",
    session_state: { extraQueryParams: { authuser: "0" } },
    first_issued_at: 0,
    expires_at: 0,
    idpId: "",
} as unknown as GoogleApiOAuth2TokenObject;

interface IUserContext {
    userDetails: GoogleApiOAuth2TokenObject | undefined;
    updateUserDetails: (details: GoogleApiOAuth2TokenObject) => void;
}

const UserContext = React.createContext<IUserContext>({
    userDetails: defaultUserState,
    updateUserDetails: details => {},
});

export default UserContext;
