import { Website, websites } from "./background";
import { getId } from "./utils";

interface BaseSetting {
    name: string;
    condition: (website: Website) => boolean;
}

interface ToggleSetting extends BaseSetting {
    type: "toggle";
}

interface IntegerSetting extends BaseSetting {
    type: "integer";
    min: number;
    max: number;
}

interface ElementSetting extends BaseSetting {
    type: "element";
    value: (website: Website) => HTMLElement;
}

type Setting = ToggleSetting | IntegerSetting | ElementSetting;

const settings: Setting[] = [
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
        }
    },
    { name: "Enabled", condition: () => true, type: "toggle" },
    {
        name: "Optional redirects",
        condition: (website) => website.urlFormat.length > 1,
        type: "toggle"
    },
    {
        name: "Number of webpages",
        condition: () => true,
        type: "integer",
        min: 1,
        max: 5
    }
];

document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("select-website") as HTMLSelectElement;
    const settingsElem = document.getElementById("settings") as HTMLDivElement;

    const updateSettings = async () => {
        const fragment = new DocumentFragment();
        let website = websites.filter((val) => {
            return getId(val.name) === select.value;
        })[0];

        for (const setting of settings) {
            if (!setting.condition(website)) continue;
            const div = document.createElement("div");
            div.className = "input-group";
            const heading = document.createElement("h2");
            heading.innerText = setting.name;
            div.appendChild(heading);
            const id = getId(select.value, getId(setting.name));

            switch (setting.type) {
                case "toggle":
                    const toggle = document.createElement("input");
                    toggle.type = "checkbox";
                    toggle.id = id;
                    toggle.addEventListener("change", (ev) => {
                        chrome.storage.sync.set({
                            [id]: (ev.target as HTMLInputElement).checked
                        });
                    });
                    const value = await chrome.storage.sync.get({ [id]: true });
                    toggle.checked = value[id];
                    const label = document.createElement("label");
                    label.className = "switch";
                    const span = document.createElement("span");
                    span.classList.add("slider", "round");
                    label.appendChild(toggle);
                    label.appendChild(span);
                    div.appendChild(label);
                    break;
                case "integer":
                    const intInput = document.createElement("input");
                    intInput.type = "number";
                    intInput.min = setting.min.toString();
                    intInput.max = setting.max.toString();
                    intInput.addEventListener("change", (ev) => {
                        chrome.storage.sync.set({
                            [id]: parseInt((ev.target as HTMLInputElement).value)
                        });
                    });
                    const intValue = await chrome.storage.sync.get({ [id]: 1 });
                    intInput.value = intValue[id].toString();
                    div.appendChild(intInput);
                    break;
                case "element":
                    const element = setting.value(website);
                    div.replaceChildren(element);
                    break;
            }
            fragment.appendChild(div);
        }
        settingsElem.replaceChildren(fragment);
    };

    for (const website of websites.map((website) => website.name)) {
        const option = document.createElement("option");
        option.text = website;
        option.value = getId(website);
        select.appendChild(option);
    }

    select.addEventListener("change", updateSettings);

    updateSettings();
});
