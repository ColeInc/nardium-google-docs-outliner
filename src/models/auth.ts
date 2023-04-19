export interface GoogleAuthDetails {
    token: string;
    email: string;
    documentId: string;
}

export interface IUserContext {
    userDetails: GoogleAuthDetails;
    updateUserDetails: (details: GoogleAuthDetails) => void;
}
