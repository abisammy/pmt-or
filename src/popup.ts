import { websites } from "./background";
import { getId } from "./utils";

document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("enabled") as HTMLInputElement;
    const select = document.getElementById(
        "select-website"
    ) as HTMLSelectElement;

    const setToggleValue = () => {
        return chrome.storage.sync.get({ [select.value]: true }, (items) => {
            toggle.checked = items[select.value];
        });
    };

    for (const website of websites.map((website) => website.name)) {
        const option = document.createElement("option");
        option.text = website;
        option.value = getId(website, "enabled");
        select.appendChild(option);
    }

    select.addEventListener("change", setToggleValue);

    toggle.addEventListener("change", function (e) {
        const { checked } = e.target as HTMLInputElement;
        chrome.storage.sync.set({ [select.value]: checked });
    });

    setToggleValue();
});
