import mixpanel from "mixpanel-browser";
import { useContext, useRef } from "react";
import DocumentContext from "../context/document-context";

export const useMixPanelAnalytics = () => {
    const documentCtx = useContext(DocumentContext);
    const { isLoggedIn, userId, email, documentId } = documentCtx.documentDetails;
    const isFirstRender = useRef(true);

    // Init MixPanel Analytics:
    const initMixPanel = () => {
        const mixPanelKey = process.env["REACT_MIXPANEL_KEY"] ?? "";

        mixpanel.init(mixPanelKey, { debug: false });

        identifyUser();
    };

    const identifyUser = () => {
        if (!isLoggedIn) {
            mixpanel.reset();
        } else {
            // Only if the user is logged in we call mixpanel.identify(). Otherwise all events are deemed as anonymous.
            mixpanel.identify(userId);
            // console.log("mixpanel.identify", userId);
        }

        // if it's user's first render of app then +1 page view
        if (isFirstRender.current) {
            mixPanelAnalyticsPageView(); // add +1 page view
            isFirstRender.current = false;
        }
    };

    const mixPanelAnalyticsPageView = () => {
        // console.log("triggering pageview with:", JSON.stringify({userId, isLoggedIn, email, documentId}));

        mixpanel.track("PageView", {
            userId,
            isLoggedIn,
            email,
            documentId,
        });
    };

    const mixPanelAnalyticsClick = (itemName: string) => {
        mixpanel.track("Click", {
            clickType: itemName,
        });
    };

    return { initMixPanel, identifyUser, mixPanelAnalyticsPageView, mixPanelAnalyticsClick };
};
