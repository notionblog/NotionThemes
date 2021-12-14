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

// Set theme
const setTheme = async (theme) => {
  console.log("setting theme");
  console.log(theme);
  chrome.storage.sync.set(
    {
      path: theme.path,
      name: theme.name,
      img: theme.img,
      style: theme.style,
    },
    function () {
      console.log("saved!");
    }
  );
};

// Preview Themes
const previewThemes = (data) => {
  const themes = Object.entries(data).map((theme) => {
    return {
      name: theme[0],
      ...theme[1],
    };
  });
  // Filter themes with style type
  const dark = themes.filter((theme) => theme.style.toLowerCase() === "dark");
  const ligth = themes.filter((theme) => theme.style.toLowerCase() === "light");

  // Load themes to DOM
  const darkThemesContainer = document.querySelector("#darkThemes");
  const ligthThemesContainer = document.querySelector("#lightThemes");

  dark.forEach((theme) => {
    const li = document.createElement("li");
    li.setAttribute("class", "theme");
    darkThemesContainer.appendChild(li);
    li.innerHTML = `<img src="${theme.img}" alt="${theme.name}" />
        <div class="description">
          <span class="name">${theme.name}</span>
          <span class="tag">${theme.style}</span>
        </div>`;
    li.addEventListener("click", () => {
      setTheme(theme);
    });
  });
  ligth.forEach((theme) => {
    const li = document.createElement("li");
    li.setAttribute("class", "theme");
    ligthThemesContainer.appendChild(li);
    li.innerHTML = `<img src="${theme.img}" alt="${theme.name}" />
        <div class="description">
          <span class="name">${theme.name}</span>
          <span class="tag">${theme.style}</span>
        </div>`;
    li.addEventListener("click", () => {
      setTheme(theme);
    });
  });

  console.log(dark);
  console.log(ligth);
};

// Load Themes
window.onload = async () => {
  const data = await getThemes();
  if (data !== null) previewThemes(data);
};
