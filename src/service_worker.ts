import { FlashcardSet } from './components/model';

// Delete all existing context menus before creating new one to avoid error
chrome.contextMenus.removeAll(() => { 
    chrome.contextMenus.create({
        id: "addSelectedWord",
        title: `Please, Select Set for Adding Words`,
        contexts: ["selection"],
    });
});

const updateContextMenuTitle = () => {
    chrome.storage.sync.get('sets', (data) => {
        const sets = data.sets || [];
        const activeSet = sets.find((set: FlashcardSet) => set.isActive);

        if (activeSet) {
            chrome.contextMenus.update("addSelectedWord", {
                title: `Add "%s" to "${activeSet.name}"`,
            });
        }
    });
};

// Initial update of context menu
updateContextMenuTitle();

// If active set changes - context manu should be updated too
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.sets) {
        updateContextMenuTitle();
    }
});

chrome.contextMenus.onClicked.addListener((info, _tab) => {
    if (info.menuItemId === "addSelectedWord" && info.selectionText) {
        chrome.storage.sync.get('sets', (data) => {
            const sets = data.sets || [];
            const activeSet = sets.find((set: FlashcardSet) => set.isActive);
            if (activeSet) {
                const url = `https://quizlet.com/${activeSet.id}/edit`;

                chrome.tabs.query({ url }, (tabs) => {
                    const targetTab = tabs.length > 0 ? tabs[0] : null;
                    if (targetTab) { // Focus on the tab if it's already open
                        chrome.tabs.update(targetTab.id!, { active: true }, () => {
                            chrome.tabs.sendMessage(targetTab.id!, { action: "addWordToSet", word: info.selectionText }, (response) => {
                                if (chrome.runtime.lastError) {
                                    console.error("Error sending message to content script:", chrome.runtime.lastError.message);
                                } else {
                                    console.log("Response from content script:", response);
                                }
                            });
                        });
                    } else { // Open a new tab
                        chrome.tabs.create({ url }, (newTab) => {
                            chrome.tabs.onUpdated.addListener(function onUpdated(tabId, changeInfo) { // Wait for the tab to load before sanding a message
                                if (tabId === newTab.id && changeInfo.status === 'complete') {
                                    chrome.tabs.sendMessage(newTab.id!, { action: "addWordToSet", word: info.selectionText }, (response) => {
                                        if (chrome.runtime.lastError) {
                                            console.error("Error sending message to content script:", chrome.runtime.lastError.message);
                                        } else {
                                            console.log("Response from content script:", response);
                                        }
                                    });
                                    chrome.tabs.onUpdated.removeListener(onUpdated);
                                }
                            });
                        });
                    }
                });
            } else {
                console.error("No active set found.");
            }
        });
    }
});
