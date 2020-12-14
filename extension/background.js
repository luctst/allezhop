chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({userData: undefined}, () => {
        chrome.storage.sync.get('userData', dataStorage => console.log(dataStorage));
    });
});