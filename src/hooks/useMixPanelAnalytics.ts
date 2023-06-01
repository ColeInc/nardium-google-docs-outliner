// let _gaq = _gaq || [];
// const googleAnalyticsKey = process.env.REACT_GOOGLE_ANALYTICS_KEY;
// _gaq.push(["_setAccount", googleAnalyticsKey]);
// _gaq.push(["_trackPageview"]);

// (function () {
//     var ga = document.createElement("script");
//     ga.type = "text/javascript";
//     ga.async = true;
//     ga.src = "https://ssl.google-analytics.com/ga.js";
//     var s = document.getElementsByTagName("script")[0];
//     s.parentNode.insertBefore(ga, s);
// })();

// // declare let _gaq: any[];

// // export const initGoogleAnalytics = () => {
// //     _gaq = _gaq || [];
// //     const googleAnalyticsKey = process.env.REACT_GOOGLE_ANALYTICS_KEY;
// //     console.log("cole key found", googleAnalyticsKey);
// //     _gaq.push(["_setAccount", googleAnalyticsKey]);
// //     _gaq.push(["_trackPageview"]);

// //     (() => {
// //         const ga = document.createElement("script");
// //         ga.type = "text/javascript";
// //         ga.async = true;
// //         ga.src = "https://ssl.google-analytics.com/ga.js";
// //         const s = document.getElementsByTagName("script")[0];
// //         s?.parentNode?.insertBefore(ga, s);
// //     })();
// // };

// // export const trackGoogleAnalyticsClick = (itemName: string) => {
// //     console.log("trackButton. sending this:", itemName);
// //     _gaq.push(["_trackEvent", itemName, "clicked"]);
// // };

// // // import ReactGA from "react-ga4";

// // // export const initGoogleAnalytics = () => {
// // //     const googleAnalyticsKey = process.env.REACT_GOOGLE_ANALYTICS_KEY ?? "";
// // //     ReactGA.initialize(googleAnalyticsKey);

// // //     console.log("triggering first pageview!");
// // //     ReactGA.send({ hitType: "pageview", page: window.location.href, title: document.title });
// // // };

// // // export const trackGoogleAnalyticsPageView = () => {
// // //     // Send pageview with a custom path
// // //     ReactGA.send({ hitType: "pageview", page: window.location.href, title: document.title });
// // // };

// // // export const trackGoogleAnalyticsClick = (itemName: string) => {
// // //     // Send a custom event
// // //     ReactGA.event({
// // //         category: "your category",
// // //         action: "your action",
// // //         label: "your label", // optional
// // //         value: 99, // optional, must be a number
// // //         nonInteraction: true, // optional, true/false
// // //         transport: "xhr", // optional, beacon/xhr/image
// // //     });
// // // };

import mixpanel from "mixpanel-browser";

export const useMixPanelAnalytics = () => {
    // Init MixPanel Analytics:
    const initMixPanel = () => {
        const mixPanelKey = process.env.REACT_MIXPANEL_KEY ?? "";

        mixpanel.init(mixPanelKey, { debug: true });

        identifyUser();
    };
    // initMixPanel();

    // console.log("triggering first pageview!");

    const identifyUser = () => {
        // TODO: if user is logged in pass google id, else generate random id or smth
        mixpanel.identify("7777777777777");
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
        // Send pageview with a custom path
        mixpanel.track("PageView", {
            isLoggedIn: false,
        });
    };

    const mixPanelAnalyticsClick = (itemName: string) => {
        mixpanel.track("Click", {
            clickType: itemName,
        });
    };

    return { initMixPanel, mixPanelAnalyticsPageView, mixPanelAnalyticsClick };
};
