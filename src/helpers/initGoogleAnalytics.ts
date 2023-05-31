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

declare let _gaq: any[];

export const initGoogleAnalytics = () => {
    _gaq = _gaq || [];
    const googleAnalyticsKey = process.env.REACT_GOOGLE_ANALYTICS_KEY;
    console.log("cole key found", googleAnalyticsKey);
    _gaq.push(["_setAccount", googleAnalyticsKey]);
    _gaq.push(["_trackPageview"]);

    (() => {
        const ga = document.createElement("script");
        ga.type = "text/javascript";
        ga.async = true;
        ga.src = "https://ssl.google-analytics.com/ga.js";
        const s = document.getElementsByTagName("script")[0];
        s?.parentNode?.insertBefore(ga, s);
    })();
};

export const trackGoogleAnalyticsClick = (itemName: string) => {
    console.log("trackButton. sending this:", itemName);
    _gaq.push(["_trackEvent", itemName, "clicked"]);
};
