import React, { useState } from "react";
import { IHeading } from "../models/heading";
import Headings from "./Headings";
import Chevron from "../../public/assets/chevron.svg";

const Heading = ({ heading }: { heading: IHeading }) => {
    const [isHidden, setIsHidden] = useState(false);
    // const [isClicked, setIsClicked] = useState(false);

    const toggleHidden = () => {
        setIsHidden(s => !s);
    };

    const isPlaceholder = heading.headingId.startsWith("PLACEHOLDER_");

    // if (isPlaceholder) {
    //     return null;
    // }

    // calculate the necessary left padding for heading item (depends whether it has collapse arrow or not)
    // const headerStyle = heading.children ? {paddingLeft: heading.headingDigit - 1 * 32} : {paddingLeft: (heading.headingDigit * 16) + 12}
    const digit = heading.headingDigit ?? 0;
    let headerStyle;
    if (heading.children) {
        headerStyle = { paddingLeft: (digit - 1) * 24 };
    } else {
        headerStyle = { paddingLeft: (digit - 1) * 24 + 12 };
    }

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
                    <Headings headings={heading.children} />
                </ul>
            )}
        </li>
    );
};

export default Heading;
