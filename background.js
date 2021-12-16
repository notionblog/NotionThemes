chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.query == "getTheme") {
    const url = request.url;
    fetch(url)
      .then((response) => response.text())
      .then((response) => sendResponse(response))
      .catch();
    return true;
  } else if (request.query == "setTheme") {
    const theme = request.theme;
    chrome.storage.sync.set({ selectedTheme: theme }, function () {
      sendResponse(true);
    });
  }
});
