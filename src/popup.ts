import { getSettingWithId, settings } from "./settings";
import { getId } from "./utils";
import { loadWebsites, websites } from "./websites";

document.addEventListener("DOMContentLoaded", async function () {
    const select = document.getElementById("select-website") as HTMLSelectElement;
    const settingsElem = document.getElementById("settings") as HTMLDivElement;

    const updateSettings = async () => {
        const fragment = new DocumentFragment();
        const website = websites.get(select.value);
        if (!website) return;

        for (const setting of settings) {
            if (!setting.condition(website)) continue;
            const div = document.createElement("div");
            div.className = "input-group";
            const heading = document.createElement("h2");
            heading.innerText = setting.name;
            div.appendChild(heading);
            const id = getId(select.value, getId(setting.name));

            const input = document.createElement("input");
            input.id = id;

            switch (setting.type) {
                case "toggle": {
                    input.type = "checkbox";
                    input.addEventListener("change", (ev) => {
                        chrome.storage.sync.set({
                            [id]: (ev.target as HTMLInputElement).checked
                        });
                    });
                    const value = await getSettingWithId(id, setting.defaultValue);
                    input.checked = value;

                    const label = document.createElement("label");
                    label.className = "switch";
                    const span = document.createElement("span");
                    span.classList.add("slider", "round");

                    label.appendChild(input);
                    label.appendChild(span);
                    div.appendChild(label);
                    break;
                }
                case "integer": {
                    input.type = "number";
                    input.min = setting.min.toString();
                    input.max = setting.max.toString();

                    input.addEventListener("change", (ev) => {
                        chrome.storage.sync.set({
                            [id]: parseInt((ev.target as HTMLInputElement).value)
                        });
                    });

                    const value = await getSettingWithId(id, setting.defaultValue);
                    input.value = value.toString();
                    div.appendChild(input);
                    break;
                }
                case "element": {
                    const element = setting.value(website);
                    div.replaceChildren(element);
                    break;
                }
            }
            fragment.appendChild(div);
        }
        settingsElem.replaceChildren(fragment);
    };

    if (websites.size === 0) await loadWebsites();
    if (websites.size === 0) {
        const paragraph = document.createElement("h2");
        paragraph.innerText = "There are no websites enabled";
        return select.replaceWith(paragraph);
    }

    for (const website of websites) {
        const option = document.createElement("option");
        option.text = website[1].name;
        option.value = website[1].url.host;
        select.appendChild(option);
    }

    select.addEventListener("change", updateSettings);

    updateSettings();

    document.getElementById("options")?.addEventListener("click", () => chrome.runtime.openOptionsPage());
});
