import mixpanel from "mixpanel-browser";
import { useContext, useEffect, useRef } from "react";
import DocumentContext from "../context/document-context";

export const useMixPanelAnalytics = () => {
    const documentCtx = useContext(DocumentContext);
    const { isLoggedIn, userId, email, documentId } = documentCtx.documentDetails;
    const isFirstRender = useRef(true);

    // if we hear any change in the isLoggedIn state, recheck identify user to see if they've possibly logged in, else call .reset() to log them out:
    useEffect(() => {
        identifyUser();
    }, [isLoggedIn]);

    // Init MixPanel Analytics:
    const initMixPanel = () => {
        const mixPanelKey = process.env.REACT_MIXPANEL_KEY ?? "";

        mixpanel.init(mixPanelKey, { debug: true });

        identifyUser();
    };
    // initMixPanel();

    const identifyUser = () => {
        if (!isLoggedIn) {
            console.log("mixpanel.reset");
            mixpanel.reset();
        } else {
            console.log("mixpanel.identify", userId);
            // Only if the user is logged in we call mixpanel.identify(). Otherwise all events are deemed as anonymous.
            mixpanel.identify(userId);
        }

        // if it's user's first render of app then +1 page view
        if (isFirstRender.current) {
            mixPanelAnalyticsPageView(); // add +1 page view
            isFirstRender.current = false;
        }
    };

    // Track an event. It can be anything, but in this example, we're tracking a Signed Up event.
    // Include a property about the signup, like the Signup Type
    // mixpanel.track("Signed Up", {
    //     "Signup Type": "Referral",
    // });
    // mixpanel.track(
    //     "Played song",
    //     {"genre": "hip-hop"}
    // );

    // page view:
    // mixpanel.init("YOUR_TOKEN", { track_pageview: true });

    const mixPanelAnalyticsPageView = () => {
        console.log(
            "triggering pageview with:",
            JSON.stringify({
                userId,
                isLoggedIn,
                email,
                documentId,
            })
        );

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

    return { initMixPanel, mixPanelAnalyticsPageView, mixPanelAnalyticsClick };
};
