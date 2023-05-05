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

    return (
        <li key={heading.headingId}>
            {!isPlaceholder && (
                <div className={`heading-arrow-container heading${heading.headingDigit}`}>
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