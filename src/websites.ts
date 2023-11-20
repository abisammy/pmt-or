export interface Website {
    urlMatches: string;
    searchParam: string;
    urlFormat: string[];
    name: string;
    link: string;
}

export interface RuntimeWebsite extends Website {
    url: URL;
}

export const websites: Map<string, RuntimeWebsite> = new Map();

const defaultWebsites: Website[] = [
    {
        name: "Physics and Maths Tutor",
        urlMatches: "https://www.physicsandmathstutor.com/pdf-pages/*",
        searchParam: "pdf",
        urlFormat: ["%PDF"],
        link: "https://www.physicsandmathstutor.com/"
    },
    {
        name: "A Level Maths Revision",
        urlMatches: "https://alevelmathsrevision.com/pdf-viewer/*",
        searchParam: "file",
        urlFormat: ["https://alevelmathsrevision.com%PDF", "https://alevelmathsrevision.com%-PDF-ms.pdf"],
        link: "https://alevelmathsrevision.com/maths-categorised-exam-questions/"
    }
];

export const loadWebsites = async () => {
    const stored = (await chrome.storage.sync.get({ websites: defaultWebsites })).websites as Website[];
    for (const website of stored) {
        const url = new URL(website.link);
        websites.set(url.host, { ...website, url });
    }
};

const updateStorage = async () => await chrome.storage.sync.set({ websites: Array.from(websites.values()) });

export const addWebsite = async (website: Website) => {
    const url = new URL(website.link);
    websites.set(url.host, { ...website, url });
    await updateStorage();
};

export const deleteWebsite = async (website: RuntimeWebsite) => {
    websites.delete(website.url.host);
    await updateStorage();
};
// TODO: MAKE SETTINGS PAGE AND ADD THESE WEBSITES
//     {
//         name: "A Level Maths Revision",
//         urlMatches: "https://alevelmathsrevision.com/pdf-viewer/*",
//         searchParam: "file",
//         urlFormat: ["https://alevelmathsrevision.com%PDF", "https://alevelmathsrevision.com%-PDF-ms.pdf"],
//         link: "https://alevelmathsrevision.com/maths-categorised-exam-questions/"
//     },
//     {
//         name: "PastPapers.co",
//         urlMatches: "https:\\/\\/pastpapers\\.co\\/.+\\/view\\.php.*",
//         searchParam: "id",
//         urlFormat: ["https://www.pastpapers.co/%PDF"],
//         link: "https://www.pastpapers.co/"
//     }
