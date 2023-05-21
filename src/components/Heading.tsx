import React, { FC, useContext, useEffect, useState } from "react";
import { IHeading } from "../models/heading";
import Headings from "./Headings";
import Chevron from "../../public/assets/chevron.svg";
import SettingsContext from "../context/settings-context";
import { useLocation } from "react-router-dom";

interface HeadingProps {
    heading: IHeading;
}

const Heading: FC<HeadingProps> = ({ heading }) => {
    const [isHidden, setIsHidden] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const settingsCtx = useContext(SettingsContext);
    const { userSettings } = settingsCtx;
    const { userHeadingLvl } = userSettings;

    const location = useLocation();

    // // useEffect(() => {
    // //     console.log("current location", JSON.stringify(location));
    // //     // if nothing found we want to keep whatever is current active still set to active:
    // //     // let found = false;

    // //     console.log("trying to match:", location.hash, heading.headingId, location.hash.includes(heading.headingId));
    // //     // must check it includes "heading" here because we only want to recheck for active heading when the hash contains "heading" otherwise user might have cursor on paragraph, etc.
    // //     if (location.hash.includes("heading") && location.hash.includes(heading.headingId)) {
    // //         // found = true;
    // //         setIsActive(true);
    // //     } else {
    // //         // found && setIsActive(false);
    // //         setIsActive(false);
    // //     }
    // // }, [location.hash]);

    useEffect(() => {
        const handleLocationChange = () => {
            console.log("current location", JSON.stringify(location));
            // if nothing found we want to keep whatever is current active still set to active:
            // let found = false;

            console.log(
                "trying to match:",
                location.hash,
                heading.headingId,
                location.hash.includes(heading.headingId)
            );
            // must check it includes "heading" here because we only want to recheck for active heading when the hash contains "heading" otherwise user might have cursor on paragraph, etc.
            if (location.hash.includes("heading") && location.hash.includes(heading.headingId)) {
                // found = true;
                setIsActive(true);
            } else {
                // found && setIsActive(false);
                setIsActive(false);
            }
        };

        // Listen for hashchange event
        window.addEventListener("hashchange", handleLocationChange);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener("hashchange", handleLocationChange);
        };
    }, [location.hash]);

    const digit = heading.headingDigit || 0;

    useEffect(() => {
        // if this heading's Heading Digit is more than the current visibleHeadings value we want, then hide it. E.g. if user wants to see only H1H2H3, collapse all H4+
        if (digit > userHeadingLvl - 1) {
            setIsHidden(true);
        } else {
            setIsHidden(false);
        }
    }, [userHeadingLvl]);

    const toggleHidden = () => {
        setIsHidden(s => !s);
    };

    const isPlaceholder = heading.headingId.startsWith("PLACEHOLDER_");

    // calculate the necessary left padding for heading item (depends whether it has collapse arrow or not)
    const paddingLeft = (digit - 1) * 24 + (heading.children ? 0 : 12);
    const headerStyle = { paddingLeft };

    return (
        <li key={heading.headingId}>
            {!isPlaceholder && (
                <a href={`#heading=${heading.headingId}`}>
                    <div
                        className={`heading-arrow-container ${isActive ? "active-heading" : ""} heading${
                            heading.headingDigit
                        }`}
                        title={heading.headingText}
                        style={headerStyle}
                    >
                        {heading.children && (
                            <div className={`heading-chevron-button ${isHidden && "clicked"}`} onClick={toggleHidden}>
                                <Chevron />
                            </div>
                        )}
                        {/* <Link to={`#heading=${heading.headingId}`}> */}
                        <h1>{heading.headingText}</h1>
                        {/* </Link> */}
                    </div>
                </a>
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
