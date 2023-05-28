import React, { useContext, useEffect, useRef, useState } from "react";
import { useFetchFileContents } from "./useFetchFileContents";
import { useHeadingsDifference } from "./useHeadingsDifference";
import { useLogoutUser } from "./useLogoutUser";
import DocumentContext, { defaultDocumentState } from "../context/document-context";
import { DocumentInfo, IDocumentContext } from "../models";
import { filterDocumentContent } from "../helpers/filterDocumentContent";
import { generateHeadingsHierarchy } from "../helpers/generateHeadingsHierarchy";
import { getDocumentId } from "../helpers/getDocumentId";
import LoadingContext from "../context/loading-context";
import { Loading } from "../models/loading";

export default function useRefState<T>(
    initialState: T,
    setterFn: (newValue: T) => void
    // ): [React.MutableRefObject<T>, React.Dispatch<React.SetStateAction<T>>] {
): [React.MutableRefObject<T>, React.MutableRefObject<(newState: React.SetStateAction<T>) => void>] {
    const [internalState, setInternalState] = useState<T>(initialState);

    const state = useRef<T>(internalState);

    const setState = (newState: React.SetStateAction<T>) => {
        if (newState instanceof Function) {
            state.current = newState(state.current);
            setInternalState(newState);
        } else {
            state.current = newState;
            setInternalState(newState);
        }
        // setterFn(state.current);
    };
    const updateState = useRef<(newState: React.SetStateAction<T>) => void>(setState);

    // return [state, setState];
    return [state, updateState];
}

export const useInitialAppLoad = () => {
    // const [documentContent, setDocumentContent] = useState<IHeading[]>();

    const { checkHeadingsDifference } = useHeadingsDifference();
    const { logoutUser } = useLogoutUser();

    const documentCtx = useContext(DocumentContext);
    // const documentCtxRef = useRef(DocumentContext);
    // const documentCtxRef = useRef(documentCtx);
    // const { isLoggedIn, documentContent } = documentCtx.documentDetails;

    const loadingCtx = useContext(LoadingContext);
    const { updateLoadingState } = loadingCtx;

    const [docInfo, setDocInfo] = useRefState<DocumentInfo>(
        documentCtx.documentDetails,
        documentCtx.updateDocumentDetails
    );
    const [loading, setLoading] = useRefState<Loading>(loadingCtx.loadingState, loadingCtx.updateLoadingState);
    const documentCtxRef = useRef(documentCtx);
    const loadingCtxRef = useRef(loadingCtx);

    useEffect(() => {
        console.log("TRIGGERED UPDATE OF docInfo");
        documentCtx.updateDocumentDetails(docInfo.current);
    }, [docInfo]);
    useEffect(() => {
        console.log("TRIGGERED UPDATE OF loading");
        updateLoadingState({ loginLoading: loading.current.loginLoading });
    }, [loading]);

    // const refetch = async (documentId: string | null, passedDocumentCtx: IDocumentContext) => {
    // const refetch = async (documentId: string | null) => {
    const refetch = async (
        documentId: string | null,
        docInfo: React.MutableRefObject<DocumentInfo>,
        // setDocInfo: React.Dispatch<React.SetStateAction<DocumentInfo>>,
        setDocInfo: React.MutableRefObject<(newState: React.SetStateAction<DocumentInfo>) => void>,
        loading: React.MutableRefObject<Loading>,
        // setLoading: React.Dispatch<React.SetStateAction<Loading>>
        setLoading: React.MutableRefObject<(newState: React.SetStateAction<Loading>) => void>,
        documentCtxRef: React.MutableRefObject<IDocumentContext>,
        loadingCtxRef: React.MutableRefObject<{
            loadingState: Loading;
            updateLoadingState: (loading: Loading) => void;
        }>
    ) => {
        // // documentCtxRef.current.updateDocumentDetails({
        // //     documentContent: "yabba GLLLLLL SKA SKA GET GETGETGET",
        // // } as DocumentInfo);
        const docCtx = documentCtxRef.current;
        const loadingCtx = loadingCtxRef.current;
        // Access the updated documentCtx using the useRef. Must to do this because referencing the original one gave me a stale closure which only stored the original state of the ctx.
        // const internalDocumentCtx = documentCtxRef.current;
        // console.log("intervalDocumentCtx:", internalDocumentCtx.documentDetails);

        // const loggedIn = passedDocumentCtx.documentDetails.isLoggedIn;
        // const { isLoggedIn } = passedDocumentCtx.documentDetails;

        // documentCtx.updateDocumentDetails({ email: "coletesting@gmail.com" } as DocumentInfo);
        // const loggedIn = false;

        // console.log("documentCtx @ refresh", passedDocumentCtx.documentDetails);
        console.log("documentCtx @ refetch", docCtx);
        // console.log("user logged in at REFETCH?", loggedIn);
        // // if (!loggedIn) {
        // //     return;
        // // }
        // setDocInfo({ email: "after!" } as DocumentInfo);
        // console.log("cole AFTER:", docInfo);

        // const fileContents = await useFetchFileContents(documentId, docInfo, setDocInfo);
        const fileContents = await useFetchFileContents(documentId, documentCtxRef);

        if (!fileContents) {
            return new Error("Document content was not able to be fetched.");
        }

        // send to function to CHECK DIFFERENCE, if no difference then don't continue
        const hasChanges = checkHeadingsDifference(fileContents);

        // if no changes found then don't run entire calculation to render headings:
        if (!hasChanges) {
            // setIsLoading(false);
            // updateLoadingState({ loginLoading: false });
            // setLoading.current({ loginLoading: false });
            loadingCtx.updateLoadingState({ loginLoading: false });
            return;
        }
        // if difference found, run entire filterDocumentContent
        const filteredHeadings = filterDocumentContent(fileContents);

        // generateHeadingsHierarchy & render it out
        // const headingsHierarchy = generateHeadingsHierarchy(filteredHeadings, documentCtx);
        // const headingsHierarchy = generateHeadingsHierarchy(filteredHeadings, setDocInfo);
        const headingsHierarchy = generateHeadingsHierarchy(filteredHeadings, documentCtxRef);
        // setDocumentContent(headingsHierarchy);
        // setDocInfo.current({ documentContent: headingsHierarchy } as DocumentInfo);
        docCtx.updateDocumentDetails({ documentContent: headingsHierarchy } as DocumentInfo);

        // setIsLoading(false);
        // updateLoadingState({ loginLoading: false });
        // setLoading.current({ loginLoading: false });
        loadingCtx.updateLoadingState({ loginLoading: false });
    };

    // Main onLoad steps:
    useEffect(() => {
        // const innerDocumentCtx = documentCtxRef.current;
        // console.log("xxx v1", innerDocumentCtx.documentDetails);

        setDocInfo.current({ email: "before" } as DocumentInfo);
        console.log("cole BEFORE:", docInfo);

        const onLoad = async () => {
            try {
                // const documentId = await getDocumentId(documentCtx.updateDocumentDetails);
                const documentId = await getDocumentId();
                // const documentId = "testing";

                if (!documentId) {
                    await logoutUser();
                    // return;
                } else {
                    console.log("cole docId being stored", documentId);
                    // setDocumentId({ documentId } as DocumentInfo);
                    documentCtx.updateDocumentDetails({ documentId } as DocumentInfo);
                }

                // await refetch(documentId);
                // TODO: reenable this first run of it!
                // await refetch(documentId, documentCtxRef.current);
                await refetch(documentId, docInfo, setDocInfo, loading, setLoading, documentCtxRef, loadingCtxRef);

                // Every 5 secs check headings data for new changes:
                console.log("CREATED NEW INTERVAL (should definitely only be one)");
                const interval = setInterval(async () => {
                    // console.log("xxx v2", innerDocumentCtx.documentDetails);
                    // updateDocumentInfoRef();
                    // await refetch(documentId, documentCtxRef.current);
                    await refetch(documentId, docInfo, setDocInfo, loading, setLoading, documentCtxRef, loadingCtxRef);
                    // await refetch(documentId);
                }, 5000); // fetch data every 5 seconds

                return () => clearInterval(interval);
            } catch (error) {
                // setIsLoading(false);
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
        // documentCtxRef.current = documentCtx;
        // updateDocumentInfoRef();
        setDocInfo.current(documentCtx.documentDetails);
        setLoading.current(loadingCtx.loadingState);
        documentCtxRef.current = documentCtx;
        loadingCtxRef.current = loadingCtx;
        console.log("111 should trigger each time we update");
    }, [documentCtx]);
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

    // const updateDocumentInfoRef = () => {
    //     documentCtxRef.current = documentCtx;
    //     console.log("bing - updated ref to:", documentCtxRef.current.documentDetails);
    // };
};
