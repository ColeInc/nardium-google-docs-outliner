import React, { FC, useContext, useEffect, useState } from "react";
import DocumentContext from "../context/document-context";
import SettingsContext from "../context/settings-context";
import { fetchFileContents } from "../helpers/fetchFileContents";
import { filterDocumentContent } from "../helpers/filterDocumentContent";
import { generateHeadingsHierarchy } from "../helpers/generateHeadingsHierarchy";
import { useHeadingsDifference } from "../hooks/useHeadingsDifference";
import { getDocumentId } from "../helpers/getDocumentId";
import { IHeading } from "../models/heading";
import Headings from "./Headings";
import "./HeadingsWrapper.css";

interface HeadingsWrapperProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeadingsWrapper: FC<HeadingsWrapperProps> = ({ setIsLoading }) => {
    const [documentContent, setDocumentContent] = useState<IHeading[]>();

    const documentCtx = useContext(DocumentContext);
    const settingsCtx = useContext(SettingsContext);
    const { userSettings } = settingsCtx;
    const { userZoom } = userSettings;

    const { checkHeadingsDifference } = useHeadingsDifference();

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

    const refetch = async (documentId: string | null) => {
        const fileContents = await fetchFileContents(documentId, documentCtx);

        if (!fileContents) {
            return new Error("Document content was not able to be fetched.");
        }

        // send to function to CHECK DIFFERENCE, if no difference then don't continue
        const hasChanges = checkHeadingsDifference(fileContents);

        // if no changes found then don't run entire calculation to render headings:
        if (!hasChanges) {
            setIsLoading(false);
            return;
        }
        // if difference found, run entire filterDocumentContent
        const filteredHeadings = filterDocumentContent(fileContents);

        // generateHeadingsHierarchy & render it out
        const headingsHierarchy = generateHeadingsHierarchy(filteredHeadings, documentCtx);
        setDocumentContent(headingsHierarchy);
        setIsLoading(false);
    };

    // Main onLoad steps:
    useEffect(() => {
        const onLoad = async () => {
            try {
                const documentId = await getDocumentId(documentCtx.updateDocumentDetails);
                // const documentId = "testing";

                refetch(documentId);

                // Every 5 secs check headings data for new changes:
                const interval = setInterval(async () => {
                    refetch(documentId);
                }, 5000); // fetch data every 5 seconds

                return () => clearInterval(interval);
            } catch (error) {
                setIsLoading(false);
                console.log(error);
            }
        };
        onLoad();
    }, []);

    // // // On initial page load check localStorage for existing zoom preferences AND Visible Headings Lvl and set them if found:
    // // useEffect(() => {
    // //     getLocalStorage("userZoom")
    // //         .then(response => {
    // //             updateUserSettings({ userZoom: response.data["userZoom"] } as Settings);
    // //         })
    // //         .catch(error => {
    // //             console.error(error);
    // //         });
    // //     getLocalStorage("userHeadingLvl")
    // //         .then(response => {
    // //             updateUserSettings({ userHeadingLvl: response.data["userHeadingLvl"] } as Settings);
    // //         })
    // //         .catch(error => {
    // //             console.error(error);
    // //         });
    // // }, []);

    // any time user clicks +/- zoom buttons, update corresponding --user-zoom CSS variable
    useEffect(() => {
        document.documentElement.style.setProperty("--user-zoom", `${userZoom}px`);
    }, [userZoom]);

    return (
        <>
            {documentContent && (
                <div className="headings">
                    <ul>
                        <Headings headings={documentContent} />
                    </ul>
                </div>
            )}

            {/* <SettingsPanel /> */}
        </>
    );
};

export default HeadingsWrapper;
