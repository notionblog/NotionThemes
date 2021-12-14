chrome.storage.sync.get(["link", "name"], function (result) {
  let { link, name } = result;
  if (link && name) {
    chrome.runtime.sendMessage(
      {
        query: "getTheme",
        url: `${link}?random=${Math.random()}`,
      },
      (response) => {
        if (response != undefined && response != "") {
          const head =
              document.head || document.getElementsByTagName("head")[0],
            style = document.createElement("style");
          head.appendChild(style);
          style.type = "text/css";

          if (style.styleSheet) {
            // This is required for IE8 and below.
            style.styleSheet.cssText = response;
          } else {
            style.appendChild(document.createTextNode(response));
          }
        } else {
          console.log("error fetching theme");
        }
      }
    );
  }
});
