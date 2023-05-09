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
    // const [visibleHeadings, setVisibleHeadings] = useState(3); // default value of which headings are collapsed
    // const [userZoom, setUserZoom] = useState(11);
    const isFirstRender = useRef(true);

    // console.log("visibleHeadings", visibleHeadings);
    const documentCtx = useContext(DocumentContext);
    const settingsCtx = useContext(SettingsContext);
    const { userSettings, updateUserSettings } = settingsCtx;

    // console.log("init documentContent", documentContent, !!documentContent);

    // Main onLoad steps:
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

    // On initial page load check localStorage for existing zoom preferences AND Visible Headings Lvl and set them if found:
    useEffect(() => {
        getLocalStorage("userZoom")
            .then(response => {
                // setUserZoom(response.data["userZoom"]);
                updateUserSettings({ userZoom: response.data["userZoom"] } as Settings);
            })
            .catch(error => {
                console.error(error);
            });
        getLocalStorage("userHeadingLvl")
            .then(response => {
                // setVisibleHeadings(response.data["userHeadingLvl"]);
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
        console.log("cole new user zoom", `${userZoom}px`);
        document.documentElement.style.setProperty("--user-zoom", `${userZoom}px`);
    };

    return (
        <>
            {documentContent && (
                <div className="headings">
                    <ul>
                        {/* <Headings headings={documentContent} visibleHeadings={userSettings.userHeadingLvl} /> */}
                        <Headings headings={documentContent} />
                    </ul>
                </div>
            )}

            <SettingsPanel />
        </>
    );
};

export default HeadingsWrapper;
