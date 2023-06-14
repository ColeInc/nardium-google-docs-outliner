import React, { ReactNode, useMemo, useState } from "react";
import LoadingContext, { defaultLoading } from "./loading-context";
import { Loading } from "../models/loading";

interface LoadingProviderProps {
    children: ReactNode;
}

const LoadingProvider = (props: LoadingProviderProps) => {
    const [loadingState, setLoadingState] = useState<Loading>(defaultLoading);

    const updateLoadingState = (loading: Partial<Loading>) => {
        setLoadingState(prevState => {
            // console.log("LOADING prevState ", prevState);
            // console.log("LOADING new Provider:", { ...prevState, ...loading });
            return { ...prevState, ...loading };
        });
    };

    const setRetryCount = (count: number) => {
        setLoadingState(prevState => {
            // console.log("LOADING prevState ", prevState);
            // console.log("LOADING new Provider:", { ...prevState, ...loading });
            return { ...prevState, retryCount: count };
        });
    };

    const incrementRetryCount = () => {
        setLoadingState(prevState => {
            return { ...prevState, retryCount: ++prevState.retryCount };
        });
    };

    const documentContext = useMemo(
        () => ({
            loadingState,
            updateLoadingState,
            setRetryCount,
            incrementRetryCount,
        }),
        [loadingState, updateLoadingState, setRetryCount, incrementRetryCount]
    );

    return <LoadingContext.Provider value={documentContext}>{props.children}</LoadingContext.Provider>;
};

export default LoadingProvider;
