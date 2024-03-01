const storageService = {
  getItem: (key: string) => {
    const value = localStorage.getItem(key);

    if (chrome.storage !== undefined) {
      if (value === null) {
        chrome.storage.local.remove(key);
      } else {
        chrome.storage.local.set({ [key]: value });
      }
    }

    return value;
  },

  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);

    if (chrome.storage !== undefined) {
      chrome.storage.local.set({ [key]: value });
    }
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);

    if (chrome.storage !== undefined) {
      chrome.storage.local.remove(key);
    }
  },
};

export default storageService;
