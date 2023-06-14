import { getSetting } from "./settings";
import { websites } from "./websites";

const urls = websites.map((website) => {
    return { urlMatches: website.urlMatches };
});

chrome.webNavigation.onBeforeNavigate.addListener(
    async (website) => {
        for (const websiteKey of websites) {
            if (!website.url.match(websiteKey.urlMatches)) continue;
            if (!(await getSetting(websiteKey, true, "enabled"))) return;
            const url = new URL(website.url);
            const pdf = url.searchParams.get(websiteKey.searchParam);
            if (!pdf) return;
            const numberOfRedirects = await getSetting(websiteKey, 1, "numberofwebpages");
            console.log(numberOfRedirects);
            for (let i = 0; i < websiteKey.urlFormat.length * numberOfRedirects; i++) {
                if (i === 1) {
                    if (!(await getSetting(websiteKey, true, "optionalredirects"))) continue;
                }
                const newUrl = websiteKey.urlFormat[Math.floor(i / numberOfRedirects)]
                    .replace("%-PDF", pdf.slice(0, -4))
                    .replace("%PDF", pdf);
                if (i === 0) chrome.tabs.update(website.tabId, { url: newUrl });
                else chrome.tabs.create({ url: newUrl, active: false });
            }
        }
    },
    {
        url: urls
    }
);
