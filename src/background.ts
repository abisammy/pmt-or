import { getSetting } from "./settings";
import { websites } from "./websites";

chrome.webNavigation.onBeforeNavigate.addListener(async (navigationOptions) => {
    const { host, searchParams } = new URL(navigationOptions.url);
    const website = websites.get(host);
    if (!website) return;

    if (!navigationOptions.url.match(website.urlMatches)) return;
    if (!(await getSetting(website, true, "enabled"))) return;
    const pdf = searchParams.get(website.searchParam);
    if (!pdf) return;
    const numberOfRedirects = await getSetting(website, 1, "numberofwebpages");
    for (let i = 0; i < website.urlFormat.length * numberOfRedirects; i++) {
        if (i === 1) {
            if (!(await getSetting(website, true, "optionalredirects"))) continue;
        }
        const newUrl = website.urlFormat[Math.floor(i / numberOfRedirects)]
            .replace("%-PDF", pdf.slice(0, -4))
            .replace("%PDF", pdf);
        if (i === 0) chrome.tabs.update(navigationOptions.tabId, { url: newUrl });
        else chrome.tabs.create({ url: newUrl, active: false });
    }
});
