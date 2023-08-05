import { Token } from "../models/token";

export const appendUserJWTInfo = (token: Token): Token => {
    const { id_token } = token;

    const payloadBase64 = id_token?.split(".")[1];
    if (!payloadBase64) {
        console.log("failed to process extract JWT token");
        return token;
    }
    const payloadJsonString = atob(payloadBase64);
    const decodedPayload = JSON.parse(payloadJsonString);
    const email = decodedPayload.email ?? "";
    const userId = decodedPayload.sub ?? "";
    // console.log("Decoded email:", email);
    // console.log("Decoded user id:", userId);
    const finalToken = { ...token, email, userId };
    return finalToken;
};
