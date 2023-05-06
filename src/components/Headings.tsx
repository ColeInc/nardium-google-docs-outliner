import React, { FC, useState } from "react";
import { IHeading } from "../models/heading";
import "./Headings.css";
import Heading from "./Heading";

interface HeadingsProps {
    headings: IHeading[] | undefined;
    visibleHeadings: number;
}

const Headings: FC<HeadingsProps> = ({ headings, visibleHeadings }) => {
    if (!headings) {
        return <div>---</div>;
    }

    return (
        <>
            {headings.map(heading => (
                <Heading heading={heading} visibleHeadings={visibleHeadings} key={heading.headingId} />
            ))}
        </>
    );
};

export default Headings;
