import React, { FC, useContext, useEffect, useRef, useState } from "react";
import DocumentContext from "../context/document-context";
import SettingsContext from "../context/settings-context";
import { fetchFileContents } from "../helpers/fetchFileContents";
import { filterDocumentContent } from "../helpers/filterDocumentContent";
import { generateHeadingsHierarchy } from "../helpers/generateHeadingsHierarchy";
import { getDocumentId } from "../helpers/getDocumentId";
import { getLocalStorage } from "../helpers/getLocalStorage";
import { setLocalStorage } from "../helpers/setLocalStorage";
import { IHeading } from "../models/heading";
import { Settings } from "../models/settings";
import Headings from "./Headings";
import "./HeadingsWrapper.css";
import SettingsPanel from "./SettingsPanel";

interface HeadingsWrapperProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeadingsWrapper: FC<HeadingsWrapperProps> = ({ setIsLoading }) => {
    const [documentContent, setDocumentContent] = useState<IHeading[]>();
    const isFirstRender = useRef(true);

    const documentCtx = useContext(DocumentContext);
    const settingsCtx = useContext(SettingsContext);
    const { userSettings, updateUserSettings } = settingsCtx;

    // // // // Main onLoad steps:
    // // // useEffect(() => {
    // // //     const onLoad = async () => {
    // // //         console.log("1)");
    // // //         const documentId = await getDocumentId(documentCtx.updateDocumentDetails);
    // // //         // const documentId = "beans";
    // // //         console.log("3)");
    // // //         const fileContents = await fetchFileContents(documentId, documentCtx);

    // // //         // TODO: instead of if statement here i think just do a try catch and if error occurs at any point render an error component instead of <Headings>
    // // //         if (!fileContents) {
    // // //             console.log("Document content was not able to be fetched.");
    // // //             // return;
    // // //         } else {
    // // //             const filteredHeadings = filterDocumentContent(fileContents);
    // // //             const headingsHierarchy = generateHeadingsHierarchy(filteredHeadings, documentCtx);
    // // //             setDocumentContent(headingsHierarchy);
    // // //         }
    // // //         setIsLoading(false);
    // // //     };
    // // //     onLoad();

    // Main onLoad steps:
    useEffect(() => {
        const onLoad = async () => {
            console.log("1) fetch document ID");
            const documentId = await getDocumentId(documentCtx.updateDocumentDetails);
            // const documentId = "beans";
            console.log("3) fetch document content");
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
            onLoad();

            // Call the fetchData function periodically
            const interval = setInterval(async () => {
                // fetch file contents
                const fileContents = await fetchFileContents(documentId, documentCtx);

                // send to function to CHECK DIFFERENCE, if no difference then don't continue

                // if difference found, filterDocumentContent

                // generateHeadingsHierarchy & render it
            }, 10000); // fetch data every 10 seconds
            return () => clearInterval(interval);
        };
    }, []);

    // On initial page load check localStorage for existing zoom preferences AND Visible Headings Lvl and set them if found:
    useEffect(() => {
        getLocalStorage("userZoom")
            .then(response => {
                updateUserSettings({ userZoom: response.data["userZoom"] } as Settings);
            })
            .catch(error => {
                console.error(error);
            });
        getLocalStorage("userHeadingLvl")
            .then(response => {
                updateUserSettings({ userHeadingLvl: response.data["userHeadingLvl"] } as Settings);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    // any time user clicks +/- zoom buttons, update corresponding --user-zoom CSS variable
    useEffect(() => {
        // if its the first render don't run this bc we will try load from localStorage instead:
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        updateCssUserZoom(userSettings.userZoom);
        // save current user zoom into LocalStorage:
        setLocalStorage("userZoom", { userZoom: userSettings.userZoom });
    }, [userSettings.userZoom]);

    const updateCssUserZoom = (userZoom: number) => {
        // console.log("new user zoom", `${userZoom}px`);
        document.documentElement.style.setProperty("--user-zoom", `${userZoom}px`);
    };

    return (
        <>
            {documentContent && (
                <div className="headings">
                    <ul>
                        <Headings headings={documentContent} />
                    </ul>
                </div>
            )}

            <SettingsPanel />
        </>
    );
};

export default HeadingsWrapper;
