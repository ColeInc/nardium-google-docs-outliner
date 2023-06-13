import React from "react";
import { ILoadingContext, Loading } from "../models/loading";

export const defaultLoading: Loading = {
    loginLoading: false,
    retryCount: 0,
};

const LoadingContext = React.createContext<ILoadingContext>({
    loadingState: defaultLoading,
    updateLoadingState: (loading: Partial<Loading>) => {},
    setRetryCount: (count: number) => {},
    incrementRetryCount: () => {},
});

export default LoadingContext;
