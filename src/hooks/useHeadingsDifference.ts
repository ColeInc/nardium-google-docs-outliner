import { useRef } from "react";
import { UnfilteredBody } from "../models/body";

export const useHeadingsDifference = () => {
    const prevFileContentsRef = useRef<UnfilteredBody | undefined>();

    const checkHeadingsDifference = (fileContents: UnfilteredBody) => {
        const prevFileContents = prevFileContentsRef.current;

        let isDifferent = true;

        if (!prevFileContents) {
            isDifferent = true;
        } else {
            // if the size of the content array is different at all then we know change is present:
            if (JSON.stringify(prevFileContents.body.content) === JSON.stringify(fileContents.body.content)) {
                isDifferent = false;
            } else {
                isDifferent = true;
            }
        }

        prevFileContentsRef.current = fileContents;
        // console.log("DIFFERENT?", isDifferent);
        return isDifferent;
    };

    return { checkHeadingsDifference };
};
