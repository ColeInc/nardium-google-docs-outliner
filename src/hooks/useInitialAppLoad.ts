import React, { useContext, useEffect, useRef, useState } from "react";
import { fetchFileContents } from "../helpers/fetchFileContents";
import { useHeadingsDifference } from "./useHeadingsDifference";
import { useLogoutUser } from "./useLogoutUser";
import DocumentContext, { defaultDocumentState } from "../context/document-context";
import { DocumentInfo, IDocumentContext } from "../models";
import { filterDocumentContent } from "../helpers/filterDocumentContent";
import { generateHeadingsHierarchy } from "../helpers/generateHeadingsHierarchy";
import { getDocumentId } from "../helpers/getDocumentId";
import LoadingContext from "../context/loading-context";
import { ILoadingContext } from "../models/loading";

export const useInitialAppLoad = () => {
    const { checkHeadingsDifference } = useHeadingsDifference();
    const { logoutUser } = useLogoutUser();

    const documentCtx = useContext(DocumentContext);
    const loadingCtx = useContext(LoadingContext);
    const { updateLoadingState } = loadingCtx;

    const documentCtxRef = useRef(documentCtx);
    const loadingCtxRef = useRef(loadingCtx);

    const refetch = async (
        documentId: string | null,
        documentCtxRef: React.MutableRefObject<IDocumentContext>,
        loadingCtxRef: React.MutableRefObject<ILoadingContext>
    ) => {
        // Access the updated documentCtx using the useRef. Must to do this because referencing the original one gave me a stale closure which only stored the original state of the ctx.
        const docCtx = documentCtxRef.current;
        const loadingCtx = loadingCtxRef.current;

        const fileContents = await fetchFileContents(documentId, documentCtxRef);

        if (!fileContents) {
            return new Error("Document content was not able to be fetched.");
        }

        // send to function to check diff between prev/current fetched headings. if no difference then don't continue
        const hasChanges = checkHeadingsDifference(fileContents);

        // if no changes found then don't run entire calculation to render headings:
        if (!hasChanges) {
            loadingCtx.updateLoadingState({ loginLoading: false });
            return;
        }
        // if difference found, run entire filterDocumentContent
        const filteredHeadings = filterDocumentContent(fileContents);

        // generateHeadingsHierarchy & render it out
        const headingsHierarchy = generateHeadingsHierarchy(filteredHeadings, documentCtxRef);
        docCtx.updateDocumentDetails({ documentContent: headingsHierarchy } as DocumentInfo);

        loadingCtx.updateLoadingState({ loginLoading: false });
    };

    // Main onLoad steps:
    useEffect(() => {
        const onLoad = async () => {
            try {
                const documentId = await getDocumentId();
                // const documentId = "testing";

                if (!documentId) {
                    await logoutUser();
                    // return;
                } else {
                    documentCtx.updateDocumentDetails({ documentId } as DocumentInfo);
                }

                await refetch(documentId, documentCtxRef, loadingCtxRef);

                // Every 5 secs check headings data for new changes:
                const interval = setInterval(async () => {
                    await refetch(documentId, documentCtxRef, loadingCtxRef);
                }, 5000);

                return () => clearInterval(interval);
            } catch (error) {
                updateLoadingState({ loginLoading: false });
                console.log(error);
            }
        };

        onLoad().catch(e => {
            console.log(e);
        });
    }, []);

    // Update the reference whenever documentCtx changes
    useEffect(() => {
        documentCtxRef.current = documentCtx;
        loadingCtxRef.current = loadingCtx;
    }, [documentCtx]);
};
