// TODO:
/* 
    - CLEAN UP CODE
        - E.G POSSIBLY CLEAN UP SETTINGS API, WHEN ADDING SETTINGS   
        - SYNC SETTINGS BETWEEN MANIFEST.JSON AND PACKAGE.JSON
    - ALLOW FOR ADDING AND REMOVING OWN WEBSITES
        - NEED TO REFACTOR TO ALLOW THIS
        - ALSO COULD USE MAP TO GET WEBSITES
        - POSSIBLY USE SETTINGS PAGE
*/

import { getId } from "./utils";

export interface Website {
    urlMatches: string;
    searchParam: string;
    urlFormat: string[];
    name: string;
    link: string;
}

export const websites: Website[] = [
    {
        name: "Physics and Maths Tutor",
        urlMatches: "https://www.physicsandmathstutor.com/pdf-pages/*",
        searchParam: "pdf",
        urlFormat: ["%PDF"],
        link: "https://www.physicsandmathstutor.com/",
    },
    {
        name: "A Level Maths Revision",
        urlMatches: "https://alevelmathsrevision.com/pdf-viewer/*",
        searchParam: "file",
        urlFormat: [
            "https://alevelmathsrevision.com%PDF",
            "https://alevelmathsrevision.com%-PDF-ms.pdf",
        ],
        link: "https://alevelmathsrevision.com/maths-categorised-exam-questions/",
    },
    {
        name: "PastPapers.co",
        urlMatches: "https:\\/\\/pastpapers\\.co\\/.+\\/view\\.php.*",
        searchParam: "id",
        urlFormat: ["https://www.pastpapers.co/%PDF"],
        link: "https://www.pastpapers.co/",
    },
];

const urls = websites.map((website) => {
    return { urlMatches: website.urlMatches };
});

const getSetting = async <Type extends boolean | number>(
    websiteName: string | Website,
    defaultValue: Type,
    ...settingName: string[]
) => {
    if (typeof websiteName !== "string") websiteName = websiteName.name;
    const id = getId(websiteName, ...settingName);
    const setting = await chrome.storage.sync.get({ [id]: defaultValue });
    return setting[id] as typeof defaultValue;
};

chrome.webNavigation.onBeforeNavigate.addListener(
    async (website) => {
        for (const websiteKey of websites) {
            if (!website.url.match(websiteKey.urlMatches)) continue;
            if (!(await getSetting(websiteKey, true, "enabled"))) return;
            const url = new URL(website.url);
            const pdf = url.searchParams.get(websiteKey.searchParam);
            if (!pdf) return;
            const numberOfRedirects = await getSetting(
                websiteKey,
                1,
                "numberofwebpages"
            );
            for (
                let i = 0;
                i < websiteKey.urlFormat.length * numberOfRedirects;
                i++
            ) {
                if (i === 1) {
                    if (
                        !(await getSetting(
                            websiteKey,
                            true,
                            "optionalredirects"
                        ))
                    )
                        continue;
                }
                let newUrl = websiteKey.urlFormat[
                    Math.floor(i / numberOfRedirects)
                ]
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
