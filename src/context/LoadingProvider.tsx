import React, { ReactNode, useMemo, useState } from "react";
import LoadingContext, { defaultLoading } from "./loading-context";
import { Loading } from "../models/loading";

interface LoadingProviderProps {
    children: ReactNode;
}

const LoadingProvider = (props: LoadingProviderProps) => {
    const [loadingState, setLoadingState] = useState<Loading>(defaultLoading);

    const updateLoadingState = (loading: Loading) => {
        setLoadingState(prevState => {
            // console.log("LOADING prevState ", prevState);
            // console.log("LOADING new Provider:", { ...prevState, ...loading });
            return { ...prevState, ...loading };
        });
    };

    const documentContext = useMemo(
        () => ({
            loadingState,
            updateLoadingState,
        }),
        [loadingState, updateLoadingState]
    );

    return <LoadingContext.Provider value={documentContext}>{props.children}</LoadingContext.Provider>;
};

export default LoadingProvider;
