import { FEtoBETokenResponse } from "../models";
import { Token } from "../models/token";

export const appendUserJWTInfo = (resp: FEtoBETokenResponse): Token => {
    try {
        // const { id_token } = token;

        console.log("Token received in appendUserJWTInfo:", resp);
        
        // const payloadBase64 = id_token?.split(".")[1];
        // if (!payloadBase64) {
        //     console.log("failed to process extract JWT token");
        //     return token;
        // }
        // const payloadJsonString = atob(resp);
        // const decodedPayload = JSON.parse(payloadJsonString);
        const email = resp.user.email ?? "";
        const userId = resp.user.sub ?? "";
        // console.log("Decoded email:", email);
        // console.log("Decoded user id:", userId);
        // const finalToken = { ...resp, email, userId };
        // return resp;
    } catch (error) {
        console.error("Error in appendUserJWTInfo:", error);
        throw new Error(`Failed to process JWT token: ${error}`);
    }
};
