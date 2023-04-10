interface Website {
    urlMatches: string;
    searchParam: string;
    urlFormat: string[];
}

const websites: Website[] = [
    {
        urlMatches: "https://www.physicsandmathstutor.com/pdf-pages/*",
        searchParam: "pdf",
        urlFormat: ["%PDF"],
    },
    {
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
        console.debug(`Navigating to: ${website.url}`);
        const enabled = await chrome.storage.sync.get({ enabled: true });
        console.debug(`Is enabled: ${enabled ? "true" : "false"}`);
        if (!enabled.enabled) return;
        for (const websiteKey of websites) {
            if (!website.url.match(websiteKey.urlMatches)) continue;
            const url = new URL(website.url);
            const pdf = url.searchParams.get(websiteKey.searchParam);
            if (!pdf) return;
            console.debug(`Matched pdf: ${pdf}`);
            for (let i = 0; i < websiteKey.urlFormat.length; i++) {
                let newUrl = websiteKey.urlFormat[i]
                    .replace("%-PDF", pdf.slice(0, -4))
                    .replace("%PDF", pdf);
                console.debug(`URL ${i + 1}: ${newUrl}`);
                if (i === 0) chrome.tabs.update(website.tabId, { url: newUrl });
                else chrome.tabs.create({ url: newUrl });
            }
        }
    },
    {
        url: urls,
    }
);
