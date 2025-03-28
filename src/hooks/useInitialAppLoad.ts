import { useContext, useEffect, useRef } from "react";
import { useAttemptLogin } from "./useAttemptLogin";
import LoadingContext from "../context/loading-context";
import DocumentContext from "../context/document-context";
import { IDocumentContext } from "../models";

function extractGoogleDocId() {
    const url = window.location.href;
    const match = url.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}

export const useInitialAppLoad = () => {
    // const { checkHeadingsDifference } = useHeadingsDifference();
    // const { logoutUser } = useLogoutUser();
    // const fetchAccessToken = useFetchAccessToken();
    const { attemptToLoginUser, checkDocumentDifferences } = useAttemptLogin();

    const documentCtx = useContext(DocumentContext);
    const loadingCtx = useContext(LoadingContext);
    const { updateLoadingState } = loadingCtx;

    const documentCtxRef = useRef(documentCtx);

    // Main onLoad steps:
    useEffect(() => {
        // const initializeApp = async () => {
        updateLoadingState({ loginLoading: true });

        // const documentId = await getDocumentId();
        const documentId = extractGoogleDocId();
        console.log("cole got dis documentId", documentId)

        if (!documentId) return;
        documentCtx.updateDocumentDetails({ documentId });

        attemptToLoginUser();
        // };

        // initializeApp();

        // Interval to check for document changes every 5 seconds
        const intervalId = setInterval(async () => {
            // console.log("starting interval 5secs...")
            refetchV2(documentId, documentCtxRef);
            // if (documentCtx.documentDetails.isLoggedIn && documentCtx.documentDetails.token) {
            //     checkDocumentDifferences(documentCtx.documentDetails.token);
            // }
        }, 5000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        documentCtxRef.current = documentCtx;
        // loadingCtxRef.current = loadingCtx;
    }, [documentCtx]);

    // Interval to check for document changes every 5 seconds
    // useEffect(() => {
    //     const intervalId = setInterval(async () => {
    //         console.log("starting interval 5secs...")
    //         if (documentCtx.documentDetails.isLoggedIn && documentCtx.documentDetails.token) {
    //             checkDocumentDifferences(documentCtx.documentDetails.token);
    //         }
    //     }, 5000);

    //     // Clean up interval on component unmount
    //     return () => clearInterval(intervalId);
    // }, []);


    const refetchV2 = async (
        documentId: string,
        documentCtxRef: React.MutableRefObject<IDocumentContext>,
        // loadingCtxRef: React.MutableRefObject<ILoadingContext>,
        // fetchNewAccessToken: React.MutableRefObject<() => Promise<void>>
    ) => {
        // Access the updated documentCtx using the useRef. Must to do this because referencing the original one gave me a stale closure which only stored the original state of the ctx.
        const docCtx = documentCtxRef.current;
        // const documentId = await getDocumentId();

        // if (!documentId) {
        //     console.log("No documentId found, returning early");
        //     return;
        // }

        // const loadingCtx = loadingCtxRef.current;

        if (docCtx.documentDetails.isLoggedIn && docCtx.documentDetails.token) {
            checkDocumentDifferences(docCtx.documentDetails.token);
        }
    };

}

// const refetch = async (
//     documentId: string | null,
//     documentCtxRef: React.MutableRefObject<IDocumentContext>,
//     loadingCtxRef: React.MutableRefObject<ILoadingContext>,
//     fetchNewAccessToken: React.MutableRefObject<() => Promise<void>>
// ) => {
//     // Access the updated documentCtx using the useRef. Must to do this because referencing the original one gave me a stale closure which only stored the original state of the ctx.
//     const docCtx = documentCtxRef.current;
//     const loadingCtx = loadingCtxRef.current;

//     // console.log("cole data @ refetch", docCtx.documentDetails);

//     // const fileContents = await fetchFileContents(documentId, documentCtxRef, loadingCtxRef, fetchAccessToken);
//     console.log("fetching new file contents @ refetch")
//     const fileContents = await fetchFileContents(documentId, documentCtxRef, loadingCtxRef, fetchNewAccessToken);
//     console.log("FETCHED contents @ refetch:", fileContents)

//     if (!fileContents) {
//         return new Error("Document content was not able to be fetched.");
//     }

//     // send to function to check diff between prev/current fetched headings. if no difference then don't continue
//     const hasChanges = checkHeadingsDifference(fileContents);

//     // if no changes found then don't run entire calculation to render headings:
//     if (!hasChanges) {
//         loadingCtx.updateLoadingState({ loginLoading: false });
//         return;
//     }
//     // if difference found, run entire filterDocumentContent
//     const filteredHeadings = filterDocumentContent(fileContents);

//     // generateHeadingsHierarchy & render it out
//     const headingsHierarchy = await generateHeadingsHierarchy(filteredHeadings);
//     docCtx.updateDocumentDetails({ documentContent: headingsHierarchy });

//     loadingCtx.updateLoadingState({ loginLoading: false });
// };

