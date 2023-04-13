import React from "react";
import { Heading } from "../models/heading";

const renderHeadings = (headings: Heading[]) => {
    return (
        <ul>
            {headings.map(heading => (
                <li key={heading.headingId}>
                    <h1>{heading.headingText}</h1>
                    {heading.children && renderHeadings(heading.children)}
                </li>
            ))}
        </ul>
    );
};

const Headings = ({ headings }: { headings: Heading[] | undefined }) => {
    if (!headings) {
        return <div>---</div>;
    }

    return <div>{renderHeadings(headings)}</div>;
};

export default Headings;
