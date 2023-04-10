import { getId } from "./utils";

export interface Website {
    urlMatches: string;
    searchParam: string;
    urlFormat: string[];
    name: string;
}

export const websites: Website[] = [
    {
        name: "Physics and Maths Tutor",
        urlMatches: "https://www.physicsandmathstutor.com/pdf-pages/*",
        searchParam: "pdf",
        urlFormat: ["%PDF"],
    },
    {
        name: "A Level Maths Revision",
        urlMatches: "https://alevelmathsrevision.com/pdf-viewer/*",
        searchParam: "file",
        urlFormat: [
            "https://alevelmathsrevision.com%PDF",
            "https://alevelmathsrevision.com%-PDF-ms.pdf",
        ],
    },
];

const urls = websites.map((website) => {
    return { urlMatches: website.urlMatches };
});

chrome.webNavigation.onBeforeNavigate.addListener(
    async (website) => {
        for (const websiteKey of websites) {
            if (!website.url.match(websiteKey.urlMatches)) continue;
            const enabledId = getId(websiteKey.name, "enabled");
            const enabled = await chrome.storage.sync.get({
                [enabledId]: true,
            });
            if (!enabled[enabledId]) return;
            const url = new URL(website.url);
            const pdf = url.searchParams.get(websiteKey.searchParam);
            if (!pdf) return;
            for (let i = 0; i < websiteKey.urlFormat.length; i++) {
                if (i === 1) {
                    const redirectsId = getId(
                        websiteKey.name,
                        "optionalredirects"
                    );
                    const redirects = await chrome.storage.sync.get({
                        [redirectsId]: true,
                    });
                    if (!redirects[redirectsId]) break;
                }
                let newUrl = websiteKey.urlFormat[i]
                    .replace("%-PDF", pdf.slice(0, -4))
                    .replace("%PDF", pdf);
                if (i === 0) chrome.tabs.update(website.tabId, { url: newUrl });
                else chrome.tabs.create({ url: newUrl, active: false });
            }
        }
    },
    {
        url: urls,
    }
);
