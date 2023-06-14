export interface Website {
    urlMatches: string;
    searchParam: string;
    urlFormat: string[];
    name: string;
    link: string;
}

export const websites: Map<string, Website> = new Map();

const defaultWebsites: Website[] = [
    {
        name: "Physics and Maths Tutor",
        urlMatches: "https://www.physicsandmathstutor.com/pdf-pages/*",
        searchParam: "pdf",
        urlFormat: ["%PDF"],
        link: "https://www.physicsandmathstutor.com/"
    }
];

export const loadWebsites = async () => {
    const stored = (await chrome.storage.sync.get({ websites: defaultWebsites })).websites as Website[];
    for (const website of stored) websites.set(new URL(website.link).host, website);
};

const updateStorage = async () => await chrome.storage.sync.set({ websites: Array.from(websites.values()) });

export const addWebsite = async (website: Website) => {
    websites.set(new URL(website.link).host, website);
    await updateStorage();
};

export const deleteWebsite = async (website: Website) => {
    websites.delete(new URL(website.link).host);
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
