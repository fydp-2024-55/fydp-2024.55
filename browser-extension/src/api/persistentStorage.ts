const getItem = (key: string) => {
  const value = localStorage.getItem(key);

  if (chrome.storage !== undefined) {
    if (value === null) {
      chrome.storage.local.remove(key);
    } else {
      chrome.storage.local.set({ [key]: value });
    }
  }

  return value;
};

const setItem = (key: string, value: any) => {
  localStorage.setItem(key, value);

  if (chrome.storage !== undefined) {
    chrome.storage.local.set({ [key]: value });
  }
};

const removeItem = (key: string) => {
  localStorage.removeItem(key);

  if (chrome.storage !== undefined) {
    chrome.storage.local.remove(key);
  }
};

const persistentStorage = {
  getItem,
  setItem,
  removeItem,
};

export default persistentStorage;
