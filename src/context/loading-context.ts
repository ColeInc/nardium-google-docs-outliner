import React from "react";
import { ILoadingContext, Loading } from "../models/loading";

export const defaultLoading: Loading = {
    loginLoading: false,
};

const LoadingContext = React.createContext<ILoadingContext>({
    loadingState: defaultLoading,
    updateLoadingState: (loading: Loading) => {},
});

export default LoadingContext;
