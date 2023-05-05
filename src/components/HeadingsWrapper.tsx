import React, { FC, useContext, useEffect, useState } from "react";
import Headings from "./Headings";
import { IHeading } from "../models/heading";
import { getDocumentId } from "../helpers/getDocumentId";
import { fetchFileContents } from "../helpers/fetchFileContents";
import { filterDocumentContent } from "../helpers/filterDocumentContent";
import { generateHeadingsHierarchy } from "../helpers/generateHeadingsHierarchy";
import DocumentContext from "../context/document-context";

interface HeadingsWrapperProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeadingsWrapper: FC<HeadingsWrapperProps> = ({ setIsLoading }) => {
    const [documentContent, setDocumentContent] = useState<IHeading[]>();
    const documentCtx = useContext(DocumentContext);

    console.log("init documentContent", documentContent, !!documentContent);

    // main onLoad steps:
    useEffect(() => {
        const onLoad = async () => {
            console.log("1)");
            const documentId = await getDocumentId(documentCtx.updateDocumentDetails);
            console.log("3)");
            const fileContents = await fetchFileContents(documentId, documentCtx);

            // TODO: instead of if statement here i think just do a try catch and if error occurs at any point render an error component instead of <Headings>
            if (!fileContents) {
                console.log("Document content was not able to be fetched.");
                // return;
            } else {
                const filteredHeadings = filterDocumentContent(fileContents);
                const headingsHierarchy = generateHeadingsHierarchy(filteredHeadings, documentCtx);
                setDocumentContent(headingsHierarchy);
            }
            setIsLoading(false);
        };
        onLoad();
    }, []);

    // useEffect(() => {
    //     if (documentContent) {
    //         setIsLoading(false);
    //     }
    // }, [documentContent]);

    return (
        <div>
            {/* <button onClick={onLoad}>Fetch Contents!</button> */}
            {documentContent && (
                <div className="headings">
                    <ul>
                        <Headings headings={documentContent} />
                    </ul>
                </div>
            )}
        </div>
    );
};

export default HeadingsWrapper;
