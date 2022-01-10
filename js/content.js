const BASE_URL = "https://notionthemes.netlify.app";

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
        if (result) {
          resolve(result);
        } else {
          resolve({ name: "default", path: "default", style: "default" });
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

const getTheme = async () => {
  let { path, name, style, font } = await getStorageData([
    "path",
    "name",
    "style",
    "font",
  ]);

  if (path && name && style) {
    const global = await sendMessage({
      query: "getTheme",
      url: `${BASE_URL}/${style}/global.css`,
    });
    const theme = await sendMessage({
      query: "getTheme",
      url: `${BASE_URL}/${path}`,
    });
    let customFont = ``;

    if (global !== undefined && theme !== undefined) {
      const head = document.head || document.getElementsByTagName("head")[0],
        style = document.createElement("style");
      head.appendChild(style);
      style.type = "text/css";

      if (font && font !== "Default") {
        customFont = `
          @import url('https://fonts.googleapis.com/css2?family=${font.replace(
            " ",
            "+"
          )}:wght@300;400;500;700&display=swap');
          #notion-app * {
            font-family:${font}, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol" !important;
          }
      `;
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = `${customFont}  \n ${theme} \n ${global}`;
      } else {
        style.appendChild(
          document.createTextNode(`${customFont}  \n ${theme} \n ${global}`)
        );
      }
    } else {
      console.log("error fetching theme");
    }
  }
};

getTheme();
