export interface GoogleAuthDetails {
    token: string;
    email: string;
}

export interface IUserContext {
    userDetails: GoogleAuthDetails | undefined;
    updateUserDetails: (details: GoogleAuthDetails) => void;
}
