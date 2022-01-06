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
      const toast = document.querySelector('#mainToast')
      toast.classList.remove("hidden");

      const selected = document.querySelector('.selected')
      selected.classList.remove("selected")
      
      target.classList.add("selected")
      
      setTimeout(() => {
        toast.classList.add("hidden");
      }, 3000)
    }
  );
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

// Load Themes
window.onload = async () => {
  const data = await getThemes();
  if (data !== null) previewThemes(data);
};
