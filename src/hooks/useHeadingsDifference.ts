import { useRef } from "react";
import { UnfilteredBody } from "../models/body";

export const useHeadingsDifference = () => {
    const prevFileContentsRef = useRef<UnfilteredBody | undefined>();

    const checkHeadingsDifference = (fileContents: UnfilteredBody) => {
        console.log("old prevstate b4 we start:", prevFileContentsRef.current);
        console.log("what we receive:", fileContents);

        const prevFileContents = prevFileContentsRef.current;

        let isDifferent = true;

        if (!prevFileContents) {
            console.log("!prevFileContents");
            isDifferent = true;
        } else {
            console.log("prev fileContents.length", prevFileContents.body.content.length);
            console.log("prev fileContents.length", fileContents.body.content.length);
            // if the size of the content array is different:
            // if (prevFileContents.body.content.length !== fileContents.body.content.length) {
            if (JSON.stringify(prevFileContents.body.content) === JSON.stringify(fileContents.body.content)) {
                isDifferent = false;
            } else {
                isDifferent = true;
            }
        }

        prevFileContentsRef.current = fileContents;
        console.log("DIFFERENT?", isDifferent);
        return isDifferent;
    };

    return { checkHeadingsDifference };
};
