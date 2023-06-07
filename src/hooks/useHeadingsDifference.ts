import { useContext, useEffect, useRef } from "react";
import { UnfilteredBody } from "../models/body";
import DocumentContext from "../context/document-context";

export const useHeadingsDifference = () => {
    const prevFileContentsRef = useRef<UnfilteredBody | undefined>();
    const isDifferent = useRef(true);

    const documentCtx = useContext(DocumentContext);
    const { isLoggedIn } = documentCtx.documentDetails;

    // Listening to isLoggedIn. if it changes at any time, set isDifferent to true to force fresh api call:
    useEffect(() => {
        isDifferent.current = true;
    }, [isLoggedIn]);

    const checkHeadingsDifference = (fileContents: UnfilteredBody) => {
        const prevFileContents = prevFileContentsRef.current;

        // let isDifferent = true;
        isDifferent.current = true;

        if (!prevFileContents) {
            // isDifferent = true;
            isDifferent.current = true;
        } else {
            // if the size of the content array is different at all then we know change is present:
            if (JSON.stringify(prevFileContents.body.content) === JSON.stringify(fileContents.body.content)) {
                isDifferent.current = false;
            } else {
                isDifferent.current = true;
            }
        }

        prevFileContentsRef.current = fileContents;
        // console.log("DIFFERENT?", isDifferent);
        return isDifferent;
    };

    return { checkHeadingsDifference };
};
