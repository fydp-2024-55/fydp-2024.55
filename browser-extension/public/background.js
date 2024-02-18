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

// Track tab URL changes
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Check if the URL has changed
  if (changeInfo.url && openTabs[tabId]) {
      const tabInfo = openTabs[tabId];

      const results = await chrome.storage.local.get(AuthTokenKey);
      const token = results[AuthTokenKey];

      if (token) {
          const response = await fetch(
              "http://localhost:8000/producer/me/histories",
              {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify([
                      {
                          url: tabInfo.url,
                          title: "placeholder",
                          visit_time: tabInfo.openedAt.toString(),
                          time_spent: (Date.now() - tabInfo.openedAt).toString(),
                      },
                  ]),
              }
          );

          if (!response.ok) {
              throw new Error(
                  `Network response was not ok, status: ${response.status}`
              );
          }
      }

      // Update the tab info with the new URL
      openTabs[tabId] = {
          url: changeInfo.url,
          openedAt: Date.now()
      };
  }
});

// Track closed tabs
chrome.tabs.onRemoved.addListener(async (tabId) => {
  if (openTabs[tabId]) {
    const tabInfo = openTabs[tabId];

    const results = await chrome.storage.local.get(AuthTokenKey);
    const token = results[AuthTokenKey];

    if (token) {
      const response = await fetch(
        "http://localhost:8000/producer/me/histories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify([
            {
              url: tabInfo.url,
              title: "placeholder",
              visit_time: tabInfo.openedAt.toString(),
              time_spent: (Date.now() - tabInfo.openedAt).toString(),
            },
          ]),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }
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
    openTabs[tabId] = { url: changeInfo.url, openedAt: Date.now() };
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
