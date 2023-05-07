import React, { FC, useContext, useEffect, useState } from "react";
import Headings from "./Headings";
import { IHeading } from "../models/heading";
import { getDocumentId } from "../helpers/getDocumentId";
import { fetchFileContents } from "../helpers/fetchFileContents";
import { filterDocumentContent } from "../helpers/filterDocumentContent";
import { generateHeadingsHierarchy } from "../helpers/generateHeadingsHierarchy";
import DocumentContext from "../context/document-context";
import { setLocalStorage } from "../helpers/setLocalStorage";
import { getLocalStorage } from "../helpers/getLocalStorage";
import "./HeadingsWrapper.css";

interface HeadingsWrapperProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeadingsWrapper: FC<HeadingsWrapperProps> = ({ setIsLoading }) => {
    const [documentContent, setDocumentContent] = useState<IHeading[]>();
    const [visibleHeadings, setVisibleHeadings] = useState(3); // default value of which headings are collapsed
    const [userZoom, setUserZoom] = useState(11);
    console.log("visibleHeadings", visibleHeadings);
    const documentCtx = useContext(DocumentContext);

    // console.log("init documentContent", documentContent, !!documentContent);

    // Main onLoad steps:
    useEffect(() => {
        const onLoad = async () => {
            console.log("1)");
            const documentId = await getDocumentId(documentCtx.updateDocumentDetails);
            // const documentId = "bean";
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

    // On initial page load check localStorage for existing zoom preferences AND Visible Headings Lvl and set them if found:
    useEffect(() => {
        getLocalStorage("userZoom")
            .then(response => {
                // console.log(response);
                updateCssUserZoom(response);
            })
            .catch(error => {
                console.error(error);
            });
        getLocalStorage("userHeadingLvl")
            .then(response => {
                // console.log(response);
                setVisibleHeadings(response);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    // any time user clicks +/- zoom buttons, update corresponding --user-zoom CSS variable
    useEffect(() => {
        updateCssUserZoom(userZoom);
        // save current user zoom into LocalStorage:
        setLocalStorage("userZoom", { userZoom: userZoom });
    }, [userZoom]);

    const updateCssUserZoom = (userZoom: number) => {
        console.log("new user zoom", `${userZoom}px`);
        document.documentElement.style.setProperty("--user-zoom", `${userZoom}px`);
    };

    const handleVisibleHeadings = (headingLvl: number) => {
        setVisibleHeadings(headingLvl);
        // save current user hierarchy into LocalStorage:
        setLocalStorage("userHeadingLvl", { userHeadingLvl: headingLvl });
    };

    return (
        <>
            {documentContent && (
                <div className="headings">
                    <ul>
                        <Headings headings={documentContent} visibleHeadings={visibleHeadings} />
                    </ul>
                </div>
            )}

            <div className="headings-grid-container">
                <button onClick={() => handleVisibleHeadings(1)}>H1</button>
                <button onClick={() => handleVisibleHeadings(2)}>H2</button>
                <button onClick={() => handleVisibleHeadings(3)}>H3</button>
                <button onClick={() => handleVisibleHeadings(4)}>H4</button>
                <button onClick={() => handleVisibleHeadings(5)}>H5</button>
                <button onClick={() => handleVisibleHeadings(6)}>H6</button>
            </div>
            <br />
            <div className="zoom-controls-container">
                <button onClick={() => setUserZoom(s => ++s)}>+</button>
                <button onClick={() => setUserZoom(s => --s)}>-</button>
            </div>
        </>
    );
};

export default HeadingsWrapper;
