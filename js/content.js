const sendMessage = async (params) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(params, (response) => {
        resolve(response);
      });
    } catch (err) {
      reject(err);
    }
  });
};
const getStorageData = async (params) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get(params, async (result) => {
        resolve(result);
      });
    } catch (err) {
      reject(err);
    }
  });
};

const getTheme = async () => {
  let { link, name, style } = await getStorageData(["link", "name", "style"]);

  if (link && name && style) {
    console.log("www");
    const global = await sendMessage({
      query: "getTheme",
      url: `https://notionstyle.github.io/notionthemes/${style}/global.min.css?random=${Math.random()}`,
    });
    const theme = await sendMessage({
      query: "getTheme",
      url: `${link}?random=${Math.random()}`,
    });
    console.log(global);
    console.log(theme);

    if (global !== undefined && theme !== undefined) {
      const head = document.head || document.getElementsByTagName("head")[0],
        style = document.createElement("style");
      head.appendChild(style);
      style.type = "text/css";

      if (style.styleSheet) {
        style.styleSheet.cssText = `${global} \n ${theme}`;
      } else {
        style.appendChild(document.createTextNode(`${global} \n ${theme}`));
      }
    } else {
      console.log("error fetching theme");
    }
  }
};

getTheme();
