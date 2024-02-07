let openTabs = {};

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
chrome.tabs.onRemoved.addListener((tabId) => {
  if (openTabs[tabId]) {
    let tabInfo = openTabs[tabId];
    console.log(
      `URL: ${tabInfo.url}, opened at: ${new Date(
        tabInfo.openedAt
      )}, time spent: ${Date.now() - tabInfo.openedAt}`
    );
    delete openTabs[tabId];
  }
});

// Update tab information when the URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.url &&
    changeInfo.url !== "about:blank" &&
    !changeInfo.url.startsWith("chrome://")
  ) {
    openTabs[tabId] = { url: changeInfo.url, openedAt: Date.now() };
  }
});
