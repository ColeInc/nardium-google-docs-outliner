import React from "react";
import { Heading } from "../models/heading";
import { updateCursor } from "../lib/updateCursor";
import { useContext } from "react";
import UserContext from "../context/user-context";

const Headings = ({ headings }: { headings: Heading[] | undefined }) => {
    const userCtx = useContext(UserContext);

    if (!headings) {
        return <div>---</div>;
    }

    const handleHeadingClick = (startIndex: string | undefined) => {
        const { token, documentId } = userCtx.userDetails;
        updateCursor(token, documentId, startIndex);
    };

    const renderHeadings = (headings: Heading[]) => (
        <ul>
            {headings.map(heading => (
                <li key={heading.headingId} onClick={() => handleHeadingClick(heading.startIndex)}>
                    <h1>{heading.headingText}</h1>
                    {heading.children && renderHeadings(heading.children)}
                </li>
            ))}
        </ul>
    );

    return <div>{renderHeadings(headings)}</div>;
};

export default Headings;
