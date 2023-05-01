import React, { useState } from "react";
import { IHeading } from "../models/heading";
import "./Headings.css";
import Heading from "./Heading";

const Headings = ({ headings }: { headings: IHeading[] | undefined }) => {
    if (!headings) {
        return <div>---</div>;
    }

    return (
        <>
            {headings.map(heading => (
                <Heading heading={heading} />
            ))}
        </>
    );
};

export default Headings;
