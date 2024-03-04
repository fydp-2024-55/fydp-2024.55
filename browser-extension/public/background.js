const AuthTokenKey = "AuthTokenKey";

const openTabs = {};

// Basic function to send chrome notifications. Useful for debugging
const displayNotification = (title, message) => {
  chrome.notifications.create("", {
    type: "basic",
    iconUrl: "bytebucks48.ico",
    title,
    message,
  });
};

// Track opened tabs
chrome.tabs.onCreated.addListener((tab) => {
  if (
    tab.url &&
    tab.url !== "about:blank" &&
    !tab.url.startsWith("chrome://")
  ) {
    openTabs[tab.id] = { url: tab.url, openedAt: Date.now() };
  }
});

// Track closed tabs
chrome.tabs.onRemoved.addListener(async (tabId) => {
  if (openTabs[tabId]) {
    const tabs = openTabs[tabId];

    const results = await chrome.storage.local.get(AuthTokenKey);
    const token = results[AuthTokenKey];

    if (token) {
      tabs.forEach(async (tab) => {
        const response = await fetch(
          "http://localhost:8000/producers/me/interests",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify([
              {
                url: tab.url,
                duration: Math.round((Date.now() - tab.openedAt) / 1000),
              },
            ]),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Network response was not ok, status: ${response.status}`
          );
        }
      });
    }
    delete openTabs[tabId];
  }
});

// Update tab information when the URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (
    changeInfo.url &&
    changeInfo.url !== "about:blank" &&
    !changeInfo.url.startsWith("chrome://")
  ) {
    obj = { url: changeInfo.url, openedAt: Date.now() };
    // if tab is new, initialize with array
    if (!openTabs.hasOwnProperty(tabId)) {
      openTabs[tabId] = [obj];
    } else {
      // access last object and we get the closing time
      const idx = openTabs[tabId].length - 1;
      const prev = openTabs[tabId][idx];
      const time_spent = Date.now() - openTabs[tabId][idx].openedAt;
      prev.time_spent = time_spent;
      // insert into previous
      openTabs[tabId][idx] = prev;
      // add new object
      openTabs[tabId].push(obj);
    }
  }
});

let notify = false;

function checkDNTSetting() {
  chrome.privacy.websites.doNotTrackEnabled.get({}, function (details) {
    if (notify === true) {
      return;
    }

    if (chrome.runtime.lastError) {
      console.error(
        "Error retrieving doNotTrackEnabled:",
        chrome.runtime.lastError
      );
      return;
    }

    if (
      details.levelOfControl === "controlled_by_this_extension" ||
      details.levelOfControl === "controllable_by_this_extension"
    ) {
      console.log(
        `Do Not Track setting is ${details.value ? "enabled" : "disabled"}.`
      );

      if (details.value === true) {
        notify = false;
      }

      if (details.value === false && notify === false) {
        notify = true;
        chrome.notifications.create("", {
          type: "basic",
          iconUrl: "bytebucks48.ico",
          title: "Do Not Track",
          message:
            "Do Not Track is disabled. Please enable it in your Chrome settings for enhanced privacy.",
          priority: 2,
        });
        setTimeout(() => {
          notify = false;
        }, 600000); // im giving them 60 seconds to turn it on
      }
    } else {
      console.log(
        "Do Not Track setting cannot be controlled by this extension."
      );
    }
  });
}

// check every 10 seconds and onInstallation
setInterval(checkDNTSetting, 10000);

chrome.runtime.onInstalled.addListener(checkDNTSetting);
