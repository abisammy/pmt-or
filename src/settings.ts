import { getId } from "./utils";
import { Website } from "./websites";

interface BaseSetting<T> {
    name: string;
    condition: (website: Website) => boolean;
    defaultValue: T;
}

interface ToggleSetting extends BaseSetting<boolean> {
    type: "toggle";
}

interface IntegerSetting extends BaseSetting<number> {
    type: "integer";
    min: number;
    max: number;
}

interface ElementSetting extends BaseSetting<null> {
    type: "element";
    value: (website: Website) => HTMLElement;
}

type Setting = ToggleSetting | IntegerSetting | ElementSetting;

export const settings: Setting[] = [
    {
        name: "Link",
        condition: () => true,
        type: "element",
        value: (website) => {
            const link = document.createElement("a");
            link.innerText = "Link";
            link.href = website.link;
            link.addEventListener("click", () => {
                chrome.tabs.create({ url: website.link });
            });
            return link;
        },
        defaultValue: null
    },
    {
        name: "Enabled",
        condition: () => true,
        type: "toggle",
        defaultValue: true
    },
    {
        name: "Optional redirects",
        condition: (website) => website.urlFormat.length > 1,
        type: "toggle",
        defaultValue: true
    },
    {
        name: "Number of webpages",
        condition: () => true,
        type: "integer",
        min: 1,
        max: 5,
        defaultValue: 1
    }
];

export const getSetting = async <Type extends boolean | number>(
    website: Website,
    defaultValue: Type,
    ...settingName: string[]
) => {
    const id = getId(website.url.host, ...settingName);
    return await getSettingWithId(id, defaultValue);
};

export const getSettingWithId = async <Type extends boolean | number>(id: string, defaultValue: Type) => {
    const setting = await chrome.storage.sync.get({ [id]: defaultValue });
    return setting[id] as typeof defaultValue;
};
