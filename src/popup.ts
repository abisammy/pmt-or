document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("enabled") as HTMLInputElement;

    chrome.storage.sync.get(
        {
            enabled: true,
        },
        function (items) {
            toggle.checked = items.enabled;
        }
    );

    toggle.addEventListener("change", function (e) {
        const { checked } = e.target as HTMLInputElement;
        chrome.storage.sync.set({ enabled: checked });

        if (!checked) {
            chrome.action.setBadgeBackgroundColor({ color: "#429e94" });
            chrome.action.setBadgeText({ text: "OFF" });
        } else chrome.action.setBadgeText({ text: "" });
    });
});
