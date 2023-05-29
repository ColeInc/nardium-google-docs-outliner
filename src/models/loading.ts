export interface Loading {
    loginLoading: boolean;
}

export interface ILoadingContext {
    loadingState: Loading;
    updateLoadingState: (loading: Loading) => void;
}
