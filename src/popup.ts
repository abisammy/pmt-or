import { getSettingWithId, settings } from "./settings";
import { addElement, addHTMLHeading, addHTMLOption, getId } from "./utils";
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
            addHTMLHeading(div, setting.name);
            const id = getId(select.value, getId(setting.name));

            const input = document.createElement("input");
            input.id = id;

            switch (setting.type) {
                case "toggle": {
                    // TODO: MAKE USE OF NEW UTIL FUNCTIONS
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

                    label.appendChild(input);
                    addElement("span", label, (span) => span.classList.add("slider", "round"));

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
        return addHTMLHeading(select, "There are no websites enabled");
    }

    for (const website of websites) {
        addHTMLOption(select, website[1].name, website[1].url.host);
    }

    select.addEventListener("change", updateSettings);

    updateSettings();

    document.getElementById("options")?.addEventListener("click", () => chrome.runtime.openOptionsPage());
});
