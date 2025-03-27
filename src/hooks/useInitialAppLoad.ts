import React, { useContext, useEffect } from "react";
import DocumentContext from "../context/document-context";
import LoadingContext from "../context/loading-context";
import { fetchFileContents } from "../helpers/fetchFileContents";
import { filterDocumentContent } from "../helpers/filterDocumentContent";
import { generateHeadingsHierarchy } from "../helpers/generateHeadingsHierarchy";
import { IDocumentContext } from "../models";
import { ILoadingContext } from "../models/loading";
import { useHeadingsDifference } from "./useHeadingsDifference";
import { useLogoutUser } from "./useLogoutUser";
import { useFetchAccessToken } from "./useFetchAccessToken";
import { useAttemptLogin } from "./useAttemptLogin";

export const useInitialAppLoad = () => {
    const { checkHeadingsDifference } = useHeadingsDifference();
    const { logoutUser } = useLogoutUser();
    const fetchAccessToken = useFetchAccessToken();
    const attemptToLoginUser = useAttemptLogin();

    const documentCtx = useContext(DocumentContext);
    const loadingCtx = useContext(LoadingContext);

    const refetch = async (
        documentId: string | null,
        documentCtxRef: React.MutableRefObject<IDocumentContext>,
        loadingCtxRef: React.MutableRefObject<ILoadingContext>,
        fetchNewAccessToken: React.MutableRefObject<() => Promise<void>>
    ) => {
        // Access the updated documentCtx using the useRef. Must to do this because referencing the original one gave me a stale closure which only stored the original state of the ctx.
        const docCtx = documentCtxRef.current;
        const loadingCtx = loadingCtxRef.current;

        console.log("cole data @ refetch", docCtx.documentDetails);

        // const fileContents = await fetchFileContents(documentId, documentCtxRef, loadingCtxRef, fetchAccessToken);
        console.log("fetching new file contents @ refetch")
        const fileContents = await fetchFileContents(documentId, documentCtxRef, loadingCtxRef, fetchNewAccessToken);
        console.log("FETCHED contents @ refetch:", fileContents)

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
        const headingsHierarchy = await generateHeadingsHierarchy(filteredHeadings);
        docCtx.updateDocumentDetails({ documentContent: headingsHierarchy });

        loadingCtx.updateLoadingState({ loginLoading: false });
    };

    // Main onLoad steps:
    useEffect(() => {
        attemptToLoginUser();
    }, []);
};
