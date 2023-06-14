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
];
