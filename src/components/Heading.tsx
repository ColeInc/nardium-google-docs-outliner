import React, { useState } from "react";
import { IHeading } from "../models/heading";
import Headings from "./Headings";

const Heading = ({ heading }: { heading: IHeading }) => {
    const [isHidden, setIsHidden] = useState(false);

    const toggleHidden = () => {
        setIsHidden(s => !s);
    };

    return (
        <li key={heading.headingId}>
            <div className="heading-arrow-container">
                {heading.children && <button onClick={toggleHidden}>v</button>}
                <a href={`#heading=${heading.headingId}`}>
                    <h1 className={`heading${heading.headingDigit}`}>{heading.headingText}</h1>
                </a>
            </div>

            {heading.children && (
                <ul className={isHidden ? "hidden" : ""}>
                    <Headings headings={heading.children} />
                </ul>
            )}
        </li>
    );
};

export default Heading;

// import React, { useEffect, useState } from "react";
// import { Heading as HeadingType } from "../models/heading";
// import { updateCursor } from "../lib/updateCursor";
// import { useContext } from "react";
// import DocumentContext from "../context/document-context";
// import "./Headings.css";
// import Heading from "./Heading";

// const Headings = ({ headings }: { headings: HeadingType[] | undefined }) => {
//     // const userCtx = useContext(DocumentContext);
//     // const { documentContent } = userCtx.documentDetails;

//     // useEffect(() => {
//     //     chrome.tabs.executeScript(
//     //         {
//     //             code: `
//     //         ${getActiveDocument.toString()};
//     //         getActiveDocument();
//     //       `,
//     //         },
//     //         ([result]) => {
//     //             setActiveDoc(result);
//     //             jumpToHeading(result);
//     //         }
//     //     );
//     // }, []);

//     if (!headings) {
//         return <div>---</div>;
//     }

//     // const handleParentHeadingCollapse = (startIndex: string | undefined) => {
//     //     // const { token, documentId, documentContent } = userCtx.documentDetails;
//     // };

//     const renderHeadings = (headings: HeadingType[]) => {
//         return (
//             <>
//                 {headings.map(heading => (
//                     <Heading heading={heading} />
//                 ))}
//             </>
//         );
//     };

//     return <div>{renderHeadings(headings)}</div>;
// };

// const Heading = ({ heading }: { heading: HeadingType }) => {
//     const [isHidden, setIsHidden] = useState(false);

//     const toggleHidden = () => {
//         setIsHidden(s => !s);
//     };

//     return (
//         <>
//             <li
//                 key={heading.headingId}
//                 // onClick={() => handleParentHeadingCollapse(heading.startIndex)}
//             >
//                 <div className="heading-arrow-container">
//                     {heading.children && <button onClick={toggleHidden}>v</button>}
//                     <a href={`#heading=${heading.headingId}`}>
//                         <h1 className={`heading${heading.headingDigit}`}>{heading.headingText}</h1>
//                     </a>
//                 </div>

//                 {heading.children && <ul className={isHidden ? "hidden" : ""}>{renderHeadings(heading.children)}</ul>}
//             </li>
//         </>
//     );
// };

// export default Headings;
