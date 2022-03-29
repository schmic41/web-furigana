function saveOptions(e) {
    BhxBrowser.storage.sync.set({
        languages: undefined
    });
    e.preventDefault();
};