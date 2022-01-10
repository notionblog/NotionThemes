const BASE_URL = "https://notionthemes.netlify.app";

// Fetch themes from the json config file
const getThemes = async () => {
  try {
    const data = await fetch(`${BASE_URL}/themes.json`);
    return await data.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Fetch fonts
const getFonts = async () => {
  try {
    const data = await fetch(`${BASE_URL}/fonts.json`);
    return await data.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// get Storage Data
const getStorageData = async (params) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get(params, async (result) => {
        if (result) {
          resolve(result);
        } else {
          resolve({ name: "default" });
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

// Set storage data
const setStorageData = async (params) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.set(params, async (result) => {
        if (result) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

// Set theme
const setTheme = async (theme, target) => {
  chrome.storage.sync.set(
    {
      path: theme.path,
      name: theme.name,
      img: theme.img,
      style: theme.style,
    },
    function () {
      const toast = document.querySelector("#mainToast");
      toast.classList.remove("hidden");

      const selected = document.querySelector(".selected");
      if (selected) {
        selected.classList.remove("selected");
      }
      if (target) {
        target.classList.add("selected");
      }

      setTimeout(() => {
        toast.classList.add("hidden");
      }, 3000);
    }
  );
};

// Preview fonts
const previewFonts = (data) => {
  const select = document.getElementById("selectFont");
  data.forEach((el) => {
    let opt = document.createElement("option");
    opt.value = el;
    opt.innerHTML = el;
    select.appendChild(opt);
  });
};

// Preview Themes
const previewThemes = async (data) => {
  const themes = Object.entries(data).map((theme) => {
    return {
      name: theme[0],
      ...theme[1],
    };
  });

  let { name } = await getStorageData(["name"]);

  // Filter themes with style type
  const dark = themes.filter((theme) => theme.style.toLowerCase() === "dark");
  const ligth = themes.filter((theme) => theme.style.toLowerCase() === "light");

  // Load themes to DOM
  const darkThemesContainer = document.querySelector("#darkThemes");
  const ligthThemesContainer = document.querySelector("#lightThemes");

  dark.forEach((theme) => {
    const li = document.createElement("li");
    li.setAttribute("id", theme.name);
    li.setAttribute("class", `theme ${name === theme.name ? "selected" : ""}`);
    darkThemesContainer.appendChild(li);
    li.innerHTML = `<img src="${BASE_URL}${theme.img}" alt="${theme.name}" />
        <div class="description">
          <span class="indicator"></span>
          <span class="name">${theme.name}</span>
         
        </div>`;
    li.addEventListener("click", (event) => {
      setTheme(theme, event.currentTarget);
    });
  });
  ligth.forEach((theme) => {
    const li = document.createElement("li");
    li.setAttribute("id", theme.name);
    li.setAttribute("class", `theme ${name === theme.name ? "selected" : ""}`);
    ligthThemesContainer.appendChild(li);
    li.innerHTML = `<img src="${BASE_URL}${theme.img}" alt="${theme.name}" />
        <div class="description">
        <span class="indicator"></span>
          <span class="name">${theme.name}</span>

        </div>`;
    li.addEventListener("click", (event) => {
      setTheme(theme, event.currentTarget);
    });
  });
};

// Reset to default theme
const resetTheme = async () => {
  await setTheme({
    path: null,
    name: "default",
    img: null,
    style: null,
  });
};

// Config selected theme

const fontSelectConfig = async () => {
  let { font } = await getStorageData(["font"]);
  const selectFont = document.querySelector("#selectFont");
  selectFont.value = font;
};

// Load Themes
window.onload = async () => {
  /*
    State
  */
  // Themes
  const data = await getThemes();
  if (data !== null) previewThemes(data);

  // Fonts
  const { fonts } = await getFonts();
  if (fonts !== null) previewFonts(fonts);

  // Selected font
  fontSelectConfig();

  /*
    Actions
  */

  // Reset button
  const resetBtn = document.querySelector("#resetTheme");
  resetBtn.addEventListener("click", () => {
    resetTheme();
  });
  // selectFont
  const selectFont = document.querySelector("#selectFont");
  selectFont.addEventListener("change", async (event) => {
    console.log(event.target.value);
    await setStorageData({ font: event.target.value });
  });
};
