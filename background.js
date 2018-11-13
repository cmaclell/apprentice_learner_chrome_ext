chrome.runtime.onInstalled.addListener(function() {

    chrome.storage.sync.set({
        current_task: null,
        agent_type: 'WhereWhenHowNoFoa',
        agent_id: null,
        project_id: 2
    }, function() {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "update_agent"
            }, function(response) {});
        });

    });

});

chrome.browserAction.onClicked.addListener(function(tab) {

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "toggle_dialog_box"
        }, function(response) {});
    });

    // chrome.runtime.sendMessage({
    //     msg: "open_popup"
    // }, function(response) {
    //     console.log('opened');
    // });

    // chrome.tabs.create({
    //     url: chrome.extension.getURL('training_interface.html')
    // });
});
