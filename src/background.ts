chrome.webNavigation.onBeforeNavigate.addListener((website) => {
    const url = new URL(website.url);
    const pdf = url.searchParams.get("pdf");
    if (pdf === null) return;
    chrome.storage.sync.get(
        {
            enabled: true,
        },
        function (items) {
            if (items.enabled) chrome.tabs.update(website.tabId, { url: pdf });
        }
    );
}, {
    url: [
        {
            urlMatches: "https://www.physicsandmathstutor.com/pdf-pages/*",
        }
    ]
});
