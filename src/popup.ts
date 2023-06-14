import { getSettingWithId, settings } from "./settings";
import { getId } from "./utils";
import { websites } from "./websites";

document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("select-website") as HTMLSelectElement;
    const settingsElem = document.getElementById("settings") as HTMLDivElement;

    const updateSettings = async () => {
        const fragment = new DocumentFragment();
        const website = websites.filter((val) => {
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
                    console.log(id);
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

    for (const website of websites.map((website) => website.name)) {
        const option = document.createElement("option");
        option.text = website;
        option.value = getId(website);
        select.appendChild(option);
    }

    select.addEventListener("change", updateSettings);

    updateSettings();

    document.getElementById("options")?.addEventListener("click", () => chrome.runtime.openOptionsPage());
});
