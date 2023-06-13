export interface Loading {
    loginLoading: boolean;
    retryCount: number;
}

export interface ILoadingContext {
    loadingState: Loading;
    updateLoadingState: (loading: Partial<Loading>) => void;
    setRetryCount: (count: number) => void;
    incrementRetryCount: () => void;
}
