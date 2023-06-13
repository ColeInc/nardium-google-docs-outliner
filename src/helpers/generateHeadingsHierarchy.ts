import React from "react";
import { BodyContent } from "../models/body";
import { IHeading } from "../models/heading";

export const generateHeadingsHierarchy = (filteredHeadings: BodyContent[]): IHeading[] => {
    let headingsHierarchy: IHeading[] = [];
    let currentParentPath: string[] = [];
    let prevHeadingDigit = 0;

    // TODO: remove these 2, just hardcoded tests:
    // headingsHierarchy = dummyArray;
    // currentParentPath = ["2", "2.1"];

    const appendToParentPath = (segment: string) => {
        currentParentPath.push(segment);
    };

    const popParentPath = (numTimes = 1) => {
        currentParentPath = currentParentPath.slice(0, -numTimes);
    };

    // TODO: remove. was for testing only.
    // const dummyArray: IHeading[] = [
    //     {
    //         headingId: "1",
    //         headingText: "Heading 1",
    //         children: [
    //             {
    //                 headingId: "1.1",
    //                 headingText: "Heading 1.1",
    //                 children: [
    //                     {
    //                         headingId: "1.1.1",
    //                         headingText: "Heading 1.1.1",
    //                     },
    //                     {
    //                         headingId: "1.1.2",
    //                         headingText: "Heading 1.1.2",
    //                     },
    //                 ],
    //             },
    //             {
    //                 headingId: "1.2",
    //                 headingText: "Heading 1.2",
    //             },
    //         ],
    //     },
    //     {
    //         headingId: "2",
    //         headingText: "Heading 2",
    //         children: [
    //             {
    //                 headingId: "2.1",
    //                 headingText: "Heading 2.1",
    //             },
    //             {
    //                 headingId: "2.2",
    //                 headingText: "Heading 2.2",
    //             },
    //         ],
    //     },
    // ];

    const calcHeadingDiff = (parent: IHeading, child: IHeading) => {
        let diff = 0;
        if (parent.headingDigit && child.headingDigit) {
            diff = parent.headingDigit - child.headingDigit;
            // if the difference is a negative number (E.g. goes H1 to H2), just return 0 instead:
            diff = diff < 0 ? 0 : diff;
        }
        return diff;
    };

    const placeholderChild = (): IHeading => {
        const randomString = "PLACEHOLDER_" + Math.random().toString(32).substring(2, 12);
        return {
            headingId: randomString,
            headingDigit: 0,
            headingText: randomString,
        };
    };

    const appendChildHeading = (child: IHeading) => {
        let currentHeadingLayer = headingsHierarchy;
        let currentParentHeading: IHeading | undefined;
        // let currentParentHeading = headingsHierarchy[0];

        // first find the parent we want to append to:
        currentParentPath.forEach((pathItem: string) => {
            // console.log("headingsHierarchy being searched:", JSON.stringify(currentHeadingLayer));
            const headingFound = currentHeadingLayer.find(element => element.headingId === pathItem);
            // console.log("headingFound", headingFound);
            // if we search all headings at this level of headingsHierarchy and find a match, assign new currentParentHeading:
            if (headingFound) {
                currentParentHeading = headingFound;
                // if there is another child to search, assign the found heading's child element to currentHeadingLayer to be searched on next iteration:
                if (headingFound.children) {
                    currentHeadingLayer = headingFound.children;
                }
            }
        });
        // console.log("final parent Heading found:", currentParentHeading);

        // if we find a valid final parent heading, append the new child to it:
        if (currentParentHeading) {
            // first calculate how many children down we need to nest this child
            let diff = calcHeadingDiff(currentParentHeading, child);
            // console.log("diff between headings", diff);

            // iterate and nest children till we hit the correct level heading should be at:
            for (let i = 0; i <= diff; i++) {
                // if we are on last iteration insert the real child heading itself, else insert PLACEHOLDER
                const heading = i === diff ? child : placeholderChild();
                // console.log("child getting appended", heading);

                if (currentParentHeading?.children) {
                    currentParentHeading?.children.push(heading);
                } else {
                    currentParentHeading["children"] = [heading];
                }

                // assign this new child to be the updated parent:
                const newParent: IHeading | undefined = currentParentHeading?.children.find(
                    (element: IHeading) => element.headingId === heading.headingId
                );
                currentParentHeading = newParent ? newParent : currentParentHeading;

                appendToParentPath(heading.headingId);
            }
        } else {
            console.log("No valid parent heading found.");
        }

        // console.log("final headingsHierarchy", JSON.stringify(headingsHierarchy));
    };

    filteredHeadings.forEach(heading => {
        const para = heading.paragraph;

        if (!para || !para.paragraphStyle?.namedStyleType || !para.paragraphStyle?.headingId) {
            // Empty paragraph found. Not processing.
            return null;
        }

        const headingType = para.paragraphStyle?.namedStyleType;
        const headingId = para.paragraphStyle.headingId;
        const headingText = para.elements[0]?.textRun?.content ?? "";
        const currHeadingDigit = +headingType.substring(headingType.length - 1);
        const startIndex = heading.startIndex;
        const endIndex = heading.endIndex;

        const newChild: IHeading = {
            headingId,
            headingText,
            headingDigit: currHeadingDigit,
            startIndex,
            endIndex,
        };

        // console.log("current heading", currHeadingDigit, currentParentPath);

        // 0) base case - if our heading is a top lvl H1 OR if there is nothing currently stored in currentParentPath, then create a new item in our final array of arrays:
        if (currHeadingDigit === 1 || !currentParentPath) {
            // console.log("0) base", headingText, "prev", prevHeadingDigit, "curr", currHeadingDigit);

            const headingDiff = prevHeadingDigit - currHeadingDigit;
            // console.log("basecase headingDiff", headingDiff);
            // pop n from parent path where n is the diff between prev and curr heading digit
            popParentPath(headingDiff + 1);
            // console.log("basecase new parent path:", currentParentPath);

            headingsHierarchy.push(newChild);
            // currentParentPath = headingsHierachy[heading];
            appendToParentPath(headingId);

            // console.log("final headingsHierarchy", JSON.stringify(headingsHierarchy));
        }

        //  1) if the current heading IS going to be a child of parent (E.g. we go from Heading2 to Heading3):
        else if (currHeadingDigit > prevHeadingDigit) {
            // console.log("1)", headingText, "prev", prevHeadingDigit, "curr", currHeadingDigit);

            // add new child to current parent:
            appendChildHeading(newChild);
        }

        // 2) else if previous heading & this heading should be on same level
        else if (currHeadingDigit === prevHeadingDigit) {
            // console.log("2)", headingText, "prev", prevHeadingDigit, "curr", currHeadingDigit);

            // pop one from parent path
            popParentPath();
            // add new child to current parent
            appendChildHeading(newChild);
        }

        // 3) else if current heading is bigger than previous heading (E.g. we go from Heading2 to Heading1)
        else if (currHeadingDigit < prevHeadingDigit) {
            // console.log("3)", headingText, "prev", prevHeadingDigit, "curr", currHeadingDigit);
            const headingDiff = prevHeadingDigit - currHeadingDigit;

            // pop n from parent path where n is the diff between prev and curr heading digit
            popParentPath(headingDiff + 1);
            // append new child at this level
            appendChildHeading(newChild);
        }

        prevHeadingDigit = currHeadingDigit;
    });

    return headingsHierarchy;
};
