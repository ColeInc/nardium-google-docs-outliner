import React, { FC, useEffect, useState } from "react";
import { IHeading } from "../models/heading";
import Headings from "./Headings";
import Chevron from "../../public/assets/chevron.svg";

interface HeadingProps {
    heading: IHeading;
    visibleHeadings: number;
}

const Heading: FC<HeadingProps> = ({ heading, visibleHeadings }) => {
    const [isHidden, setIsHidden] = useState(false);
    // const [isClicked, setIsClicked] = useState(false);

    const digit = heading.headingDigit || 0;

    useEffect(() => {
        console.log("cur heading digit", digit, " > ", visibleHeadings, " = ", digit > visibleHeadings);
        // if this heading's Heading Digit is more than the current visibleHeadings value we want, then hide it. E.g. if user wants to see only H1H2H3, collapse all H4+
        if (digit > visibleHeadings - 1) {
            setIsHidden(true);
        } else {
            setIsHidden(false);
        }
    }, [visibleHeadings]);

    const toggleHidden = () => {
        setIsHidden(s => !s);
    };

    const isPlaceholder = heading.headingId.startsWith("PLACEHOLDER_");

    // if (isPlaceholder) {
    //     return null;
    // }

    // calculate the necessary left padding for heading item (depends whether it has collapse arrow or not)
    const paddingLeft = (digit - 1) * 24 + (heading.children ? 0 : 12);
    const headerStyle = { paddingLeft };

    return (
        <li key={heading.headingId}>
            {!isPlaceholder && (
                <div className={`heading-arrow-container heading${heading.headingDigit}`} style={headerStyle}>
                    {/* {heading.children && <button onClick={toggleHidden}>v</button>} */}

                    {heading.children && (
                        <div className={`heading-chevron-button ${isHidden && "clicked"}`} onClick={toggleHidden}>
                            <Chevron />
                        </div>
                    )}
                    <a href={`#heading=${heading.headingId}`}>
                        <h1>{heading.headingText}</h1>
                    </a>
                </div>
            )}

            {heading.children && (
                <ul className={isHidden ? "hidden" : ""}>
                    <Headings headings={heading.children} visibleHeadings={visibleHeadings} />
                </ul>
            )}
        </li>
    );
};

export default Heading;
