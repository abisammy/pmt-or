import { Website, websites } from "./background";
import { getId } from "./utils";

interface Setting {
    name: string;
    condition: (website: Website) => boolean;
    type: "toggle";
}

const settings: Setting[] = [
    { name: "Enabled", condition: () => true, type: "toggle" },
    {
        name: "Optional redirects",
        condition: (website) => website.urlFormat.length > 1,
        type: "toggle",
    },
];

document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById(
        "select-website"
    ) as HTMLSelectElement;
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
            switch (setting.type) {
                case "toggle":
                    const id = getId(select.value, getId(setting.name));
                    const toggle = document.createElement("input");
                    toggle.type = "checkbox";
                    toggle.id = id;
                    toggle.addEventListener("change", (ev) => {
                        chrome.storage.sync.set({
                            [id]: (ev.target as HTMLInputElement).checked,
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
