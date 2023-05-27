import React, { FC } from "react";
import { IHeading } from "../models/heading";
import Heading from "./Heading";
import "./Headings.css";

interface HeadingsProps {
    headings: IHeading[] | undefined;
}

const Headings: FC<HeadingsProps> = ({ headings }) => {
    // if (!headings || Object.keys(headings).length === 0) {
    if (!headings) {
        return <div>---</div>;
    }

    console.log("headings", headings);

    return (
        <>
            {headings.map(heading => (
                <Heading heading={heading} key={heading.headingId} />
            ))}
        </>
    );
};

export default Headings;
