import React, { useEffect } from "react";
import { Heading } from "../models/heading";
import { updateCursor } from "../lib/updateCursor";
import { useContext } from "react";
import DocumentContext from "../context/document-context";

const Headings = ({ headings }: { headings: Heading[] | undefined }) => {
    const userCtx = useContext(DocumentContext);
    // const { documentContent } = userCtx.documentDetails;

    // useEffect(() => {
    //     chrome.tabs.executeScript(
    //         {
    //             code: `
    //         ${getActiveDocument.toString()};
    //         getActiveDocument();
    //       `,
    //         },
    //         ([result]) => {
    //             setActiveDoc(result);
    //             jumpToHeading(result);
    //         }
    //     );
    // }, []);

    if (!headings) {
        return <div>---</div>;
    }

    const handleParentHeadingCollapse = (startIndex: string | undefined) => {
        const { token, documentId, documentContent } = userCtx.documentDetails;
        // updateCursor(token, documentId, startIndex);
        // const position = documentContent.newPosition(startIndex);
        // documentContent.setCursor(position);
    };

    const renderHeadings = (headings: Heading[]) => (
        <ul>
            {headings.map(heading => (
                <li key={heading.headingId} onClick={() => handleParentHeadingCollapse(heading.startIndex)}>
                    <a href={`#heading=${heading.headingId}`}>
                        <h1>{heading.headingText}</h1>
                    </a>

                    {heading.children && renderHeadings(heading.children)}
                </li>
            ))}
        </ul>
    );

    return <div>{renderHeadings(headings)}</div>;
};

export default Headings;
