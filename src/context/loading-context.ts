import React from "react";
import { Loading } from "../models/loading";

export const defaultLoading: Loading = {
    loginLoading: false,
};

const LoadingContext = React.createContext({
    loadingState: defaultLoading,
    updateLoadingState: (loading: Loading) => {},
});

export default LoadingContext;
