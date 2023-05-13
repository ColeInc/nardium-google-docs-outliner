import { useContext, useState } from "react";
import { UnfilteredBody } from "../models/body";
import DocumentContext from "../context/document-context";

export const useHeadingsDifference = () => {
    const [prevFileContents, setPrevFileContents] = useState<UnfilteredBody | undefined>();

    // const documentCtx = useContext(DocumentContext);
    // documentCtx.documentDetails.documentContent

    const checkHeadingsDifference = (fileContents: UnfilteredBody) => {
        let isDifferent = true;
        // if there's nothing stored in prevFileContents then it must be the first run, therefore we definitely identify a difference between prev/curr headings:

        console.log("prev fileContents.length", fileContents.body.content.length, JSON.stringify(fileContents));

        console.log("prevContents b4 going in:", prevFileContents);
        if (!prevFileContents) {
            console.log("!prevFileContents");
            isDifferent = true;
        } else {
            console.log("prev fileContents.length", prevFileContents.body.content.length, JSON.stringify(fileContents));
            console.log("prev fileContents.length", fileContents.body.content.length, JSON.stringify(fileContents));
            if (prevFileContents.body.content.length !== fileContents.body.content.length) {
                // if the size of the content array is different:
                // return true;
                isDifferent = true;
            } else {
                isDifferent = false;
            }
        }

        // set the newly passed in fileContent to be the new prevFileContents for next time this is called:
        setPrevFileContents(fileContents);
        console.log("sets it", prevFileContents);
        console.log("DIFFERENT?", isDifferent);
        return isDifferent;
    };

    return { checkHeadingsDifference };
};
