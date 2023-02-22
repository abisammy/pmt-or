interface Website {
    urlMatches: string;
    searchParam: string;
    urlFormat: string;
}

const websites: Website[] = [
    {
        urlMatches: "https://www.physicsandmathstutor.com/pdf-pages/*",
        searchParam: "pdf",
        urlFormat: "%PDF",
    },
    {
        urlMatches: "https://alevelmathsrevision.com/pdf-viewer/*",
        searchParam: "file",
        urlFormat: "https://alevelmathsrevision.com%PDF",
    },
];

interface baseUrl {
    urlMatchtes: string;
}

const urls = websites.map((website) => {
    return { urlMatches: website.urlMatches };
});

chrome.webNavigation.onBeforeNavigate.addListener(
    async (website) => {
        const enabled = await chrome.storage.sync.get({ enabled: true });
        if (!enabled.enabled) return;
        for (const websiteKey of websites) {
            if (!website.url.match(websiteKey.urlMatches)) continue;
            const url = new URL(website.url);
            const pdf = url.searchParams.get(websiteKey.searchParam);
            if (!pdf) return;
            chrome.tabs.update(website.tabId, {
                url: websiteKey.urlFormat.replace("%PDF", pdf),
            });
        }
    },
    {
        url: urls,
    }
);
