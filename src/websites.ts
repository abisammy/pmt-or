export interface Website {
    urlMatches: string;
    searchParam: string;
    urlFormat: string[];
    name: string;
    link: string;
}

const defaultWebsites: Website[] = [
    {
        name: "Physics and Maths Tutor",
        urlMatches: "https://www.physicsandmathstutor.com/pdf-pages/*",
        searchParam: "pdf",
        urlFormat: ["%PDF"],
        link: "https://www.physicsandmathstutor.com/"
    }
];

/* 

    TODO: FIGURE OUT A NEW SYSTEM FOR THE WRAPPER OF THE STORAGE API, SO I CAN EASILY MAKE THIS

    POSSIBLE:
    1. BOTH BACKGROUND AND UI GET ACCESS TO BASE STORED WEBSITE ARRAY
    2. I CAN MAKE FUNCTIONS TO MODIFY THESE HERE
    3. I CAN ALSO MAKE FUNCTIONS TO GET URL OF WEBSITE
    4. NEED TO OPTIMISE AND GET RID OF CURRENT JANK SOLUTION

*/

export const loadWebsites = async () => {
    await chrome.storage.sync.clear();
    return (await chrome.storage.sync.get({ websites: defaultWebsites })).websites as Website[];
    // // console.log(stored);
    // // const websites: Website[] = [];
    // // for (const website of stored) {
    // //     try {
    // //         const url = new URL(website.link);
    // //         websites.push([url.host, { ...website, url }]);
    // //     } catch (error) {
    // //         console.log(website);
    // //     }
    // // }

    // return stored;
};

// export const loadWebsites = async () => {
//     for (const w of await importWebsites()) websites.set(...w);
// };

// export type WebsitesMap = [string, RuntimeWebsite][];

// // const updateStorage = async (websites: WebsitesMap) => {
// //     const test = websites.map((w) => {
// //         const website = w[1];
// //         delete website.url;
// //         return website;
// //     });
// //     // await chrome.storage.sync.set({ websites: Array.from(websites[1].values()) });
// // };

// export const addWebsite = async (websites: WebsitesMap, website: Website) => {
//     console.log(website);
//     const url = new URL(website.link);
//     console.log(websites);
//     websites.push([url.host, { ...website, url }]);
//     console.log(websites);
//     await updateStorage(websites);
// };

// export const deleteWebsite = async (websites: WebsitesMap, website: RuntimeWebsite) => {
//     await updateStorage(websites.filter((w) => w[0] !== website.url.host));
// };
/* 
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
    },
    {
        name: "PastPapers.co",
        urlMatches: "https:\\/\\/pastpapers\\.co\\/.+\\/view\\.php.*",
        searchParam: "id",
        urlFormat: ["https://www.pastpapers.co/%PDF"],
        link: "https://www.pastpapers.co/"
    }
 */
