import React, { useEffect, useState } from "react";
import Headings from "./Headings";
import { IHeading } from "../models/heading";
import { getDocumentId } from "../helpers/getDocumentId";

const HeadingsWrapper = () => {
    const [documentContent, setDocumentContent] = useState<IHeading[]>();

    // main onLoad steps:
    useEffect(() => {
        console.log("1)");
        getDocumentId();
        console.log("3)");
        fetchFileContents();
    }, []);

    return (
        <div>
            {/* <button onClick={onLoad}>Fetch Contents!</button> */}
            <div className="headings">
                <ul>
                    <Headings headings={documentContent} />
                </ul>
            </div>
        </div>
    );
};

export default HeadingsWrapper;
