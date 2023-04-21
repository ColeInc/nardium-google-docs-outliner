// import { useContext } from "react";
// import DocumentContext from "../context/user-context";
import { DocumentInfo } from "../models";

export const updateCursor = (token: string, documentId: string, startIndex: string | undefined) => {
    // const userCtx = useContext(DocumentContext);

    console.log("updateCursor main 3", token, "x\n", documentId, "x\n", startIndex);

    if (token && documentId && startIndex) {
        // if (request.cursorIndex) {

        chrome.runtime.sendMessage({ type: "updateCursor", token, documentId, startIndex }, (response: any) => {
            // alert(response.token);
            // console.log("repsonse fetched back at content.js!", response);
            // console.log("token fetched back at content.js!", response.token);
            // set token
            // userCtx.updateDocumentDetails({ token: response.token } as DocumentInfo);
        });

        // let cursorIndex = request.cursorIndex;
        // // // let range = document.createRange();
        // // // let selection = window.getSelection();
        // // // if (document && document.body && selection) {
        // // //     range.setStart(document.body.firstChild as Node, +startIndex);
        // // //     range.collapse(true);
        // // //     selection.removeAllRanges();
        // // //     selection.addRange(range);
        // // // }
        // }

        // try {
        //     fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
        //         method: "PUT",
        //         headers: {
        //             Authorization: `Bearer ${token}`,
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({
        //             requests: [
        //                 {
        //                     updateCursor: {
        //                         location: {
        //                             index: startIndex,
        //                         },
        //                     },
        //                 },
        //             ],
        //         }),
        //     });
        // } catch (e) {
        //     console.log("Error jumping to heading", e);
        // }
    } else {
        console.log("Invalid token, documentId or startIndex provided.");
    }
};
