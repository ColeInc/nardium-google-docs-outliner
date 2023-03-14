// import { google } from "googleapis";
// import { OAuth2Client } from "google-auth-library";

// // TODO: update that 3rd field later, this is a list of redirect URIs
// const client = new OAuth2Client(
//     process.env.REACT_CLIENT_ID,
//     process.env.REACT_CLIENT_SECRET,
//     "http://localhost:3000/auth/google/callback"
// );

// const scopes = ["https://www.googleapis.com/auth/documents"];

// interface Tokens {
//     access_token: string;
//     refresh_token: string;
//     scope: string;
//     token_type: string;
//     expiry_date: number;
// }

// export function getAuthUrl() {
//     return client.generateAuthUrl({
//         access_type: "offline",
//         scope: scopes,
//     });
// }

// export async function getAccessToken(code: string): Promise<Tokens> {
//     const { tokens } = await client.getToken(code);
//     return tokens as Tokens;
// }

// export async function getClient(tokens: Tokens): Promise<ReturnType<typeof google.docs>> {
//     client.setCredentials(tokens);
//     const docs = google.docs({
//         version: "v1",
//         auth: client,
//     });
//     return docs;
// }
