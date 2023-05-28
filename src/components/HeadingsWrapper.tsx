import React, { FC, MutableRefObject, useContext, useEffect, useRef, useState } from "react";
import DocumentContext from "../context/document-context";
import SettingsContext from "../context/settings-context";
import { filterDocumentContent } from "../helpers/filterDocumentContent";
import { generateHeadingsHierarchy } from "../helpers/generateHeadingsHierarchy";
import { useHeadingsDifference } from "../hooks/useHeadingsDifference";
import { useFetchFileContents } from "../hooks/useFetchFileContents";
import { getDocumentId } from "../helpers/getDocumentId";
import { useLogoutUser } from "../hooks/useLogoutUser";
import { IHeading } from "../models/heading";
import Headings from "./Headings";
import "./HeadingsWrapper.css";
import { DocumentInfo, IDocumentContext } from "../models";

interface HeadingsWrapperProps {
    // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeadingsWrapper: FC<HeadingsWrapperProps> = () => {
    // const [documentContent, setDocumentContent] = useState<IHeading[]>();

    const { checkHeadingsDifference } = useHeadingsDifference();
    const { logoutUser } = useLogoutUser();

    const documentCtx = useContext(DocumentContext);
    // const documentCtxRef = useRef(DocumentContext);
    const documentCtxRef = useRef(documentCtx);
    const { isLoggedIn, documentContent } = documentCtx.documentDetails;

    const settingsCtx = useContext(SettingsContext);
    const { userSettings } = settingsCtx;
    const { userZoom } = userSettings;

    // // // const refetch = async (documentId: string | null, passedDocumentCtx: IDocumentContext) => {
    // // //     // const refetch = async (documentId: string | null) => {
    // // //     // Access the updated documentCtx using the useRef. Must to do this because referencing the original one gave me a stale closure which only stored the original state of the ctx.
    // // //     // const internalDocumentCtx = documentCtxRef.current;
    // // //     // console.log("intervalDocumentCtx:", internalDocumentCtx.documentDetails);

    // // //     // const loggedIn = passedDocumentCtx.documentDetails.isLoggedIn;
    // // //     // const { isLoggedIn } = passedDocumentCtx.documentDetails;

    // // //     // documentCtx.updateDocumentDetails({ email: "coletesting@gmail.com" } as DocumentInfo);
    // // //     // const loggedIn = false;

    // // //     console.log("documentCtx @ refresh", passedDocumentCtx.documentDetails);
    // // //     // console.log("user logged in at REFETCH?", loggedIn);
    // // //     console.log("docId", documentId);
    // // //     // // if (!loggedIn) {
    // // //     // //     return;
    // // //     // // }

    // // //     const fileContents = await useFetchFileContents(documentId, passedDocumentCtx);

    // // //     if (!fileContents) {
    // // //         return new Error("Document content was not able to be fetched.");
    // // //     }

    // // //     // send to function to CHECK DIFFERENCE, if no difference then don't continue
    // // //     const hasChanges = checkHeadingsDifference(fileContents);

    // // //     // if no changes found then don't run entire calculation to render headings:
    // // //     if (!hasChanges) {
    // // //         setIsLoading(false);
    // // //         return;
    // // //     }
    // // //     // if difference found, run entire filterDocumentContent
    // // //     const filteredHeadings = filterDocumentContent(fileContents);

    // // //     // generateHeadingsHierarchy & render it out
    // // //     const headingsHierarchy = generateHeadingsHierarchy(filteredHeadings, documentCtx);
    // // //     setDocumentContent(headingsHierarchy);
    // // //     setIsLoading(false);
    // // // };

    // // // // Main onLoad steps:
    // // // useEffect(() => {
    // // //     // const innerDocumentCtx = documentCtxRef.current;
    // // //     // console.log("xxx v1", innerDocumentCtx.documentDetails);

    // // //     const onLoad = async () => {
    // // //         try {
    // // //             const documentId = await getDocumentId(documentCtx.updateDocumentDetails);
    // // //             // const documentId = "testing";

    // // //             if (!documentId) {
    // // //                 await logoutUser();
    // // //             }

    // // //             // await refetch(documentId);
    // // //             await refetch(documentId, documentCtxRef.current);

    // // //             // Every 5 secs check headings data for new changes:
    // // //             console.log("CREATED NEW INTERVAL (should definitely only be one)");
    // // //             const interval = setInterval(async () => {
    // // //                 // console.log("xxx v2", innerDocumentCtx.documentDetails);
    // // //                 updateDocumentInfoRef();
    // // //                 await refetch(documentId, documentCtxRef.current);
    // // //                 // await refetch(documentId);
    // // //             }, 5000); // fetch data every 5 seconds

    // // //             return () => clearInterval(interval);
    // // //         } catch (error) {
    // // //             setIsLoading(false);
    // // //             console.log(error);
    // // //         }
    // // //     };

    // // //     onLoad().catch(e => {
    // // //         console.log(e);
    // // //     });
    // // // }, []);

    // // // // Update the reference whenever documentCtx changes
    // // // useEffect(() => {
    // // //     // documentCtxRef.current = documentCtx;
    // // //     updateDocumentInfoRef();
    // // //     console.log("111 should trigger each time we update");
    // // // }, [documentCtx]);
    // // // useEffect(() => {
    // // //     // documentCtxRef.current = documentCtx;
    // // //     updateDocumentInfoRef();
    // // //     console.log("222 should trigger each time we update");
    // // // }, [documentCtx.documentDetails]);
    // // // useEffect(() => {
    // // //     // documentCtxRef.current = documentCtx;
    // // //     console.log("333 should trigger each time we update");
    // // //     updateDocumentInfoRef();
    // // // }, [isLoggedIn]);

    // // // const updateDocumentInfoRef = () => {
    // // //     documentCtxRef.current = documentCtx;
    // // //     console.log("bing - updated ref to:", documentCtxRef.current.documentDetails);
    // // // };

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
        </>
    );
};

export default HeadingsWrapper;
