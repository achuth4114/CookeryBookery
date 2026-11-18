const $ = (selector, parent = document) => parent.querySelector(selector);
const mealButtons = [...document.querySelectorAll("[data-meal]")];
const filters = $("#filters");
const search = $("#search");
const cuisine = $("#cuisine");
const taste = $("#taste");
const sort = $("#sort");
const malayalam = $("#malayalam");
const grid = $("#recipe-grid");
const recipeDialog = $("#recipe-dialog");
const savedLink = $("#saved-link");
const defaultSort = "picks";
const pageSize = 18;
const storageKey = "cookerybookery-favourites";
const defaultFilters = { query: "", meal: "", cuisine: "", taste: "", sort: defaultSort, ml: false };
const state = { ...defaultFilters, saved: false, limit: pageSize };
const malayalamPattern = /[\u0d00-\u0d7f]/;
const collator = new Intl.Collator(["en", "ml"], { sensitivity: "base" });
const picks = ["-8sPmWGliZM", "NoCXllz1tMI", "tSSHvPpfkZM", "b1Xcm2YdvCQ", "EqcD0U64Kk4", "lDbEHOhiy10"];
const pickOrder = new Map(picks.map((id, index) => [id, index]));
const specialNames = {
  "andhra-chettinad": "Andhra / Chettinad",
  "indo-chinese": "Indo-Chinese",
  "north-indian": "North Indian",
  "other-indian": "Other Indian",
  "western-fusion": "Western / Fusion",
};
const searchAliases = {
  biryani: "biryani", biriyani: "biryani", biriani: "biryani",
  chilli: "chilli", chili: "chilli", chilly: "chilli",
  prawn: "prawn", prawns: "prawn", shrimp: "prawn", shrimps: "prawn",
  savoury: "savoury", savory: "savoury",
  kadala: "chickpea", chana: "chickpea", chole: "chickpea", chickpeas: "chickpea",
  tapioca: "tapioca", kappa: "tapioca", cassava: "tapioca",
  payasam: "payasam", kheer: "payasam",
};
const translatedTerms = [
  [/മീൻ|മീന്|മീൻകറി/, " fish meen "],
  [/ചിക്കൻ|കോഴി/, " chicken kozhi "],
  [/ചെമ്മീൻ|ചെമ്മീന്|കൊഞ്ച്/, " prawns shrimp chemmeen konchu "],
  [/മുട്ട/, " egg mutta "],
  [/ബിരിയാണി|ബിരിയാനി/, " biryani "],
  [/കൂൺ/, " mushroom "],
  [/കറി/, " curry "],
  [/കൊണ്ടാട്ടം/, " kondattam "],
  [/പായസം/, " payasam kheer "],
  [/കപ്പ/, " kappa tapioca "],
];
let recipes = [];
let recipesById = new Map();
let activeRecipe = null;
let bookmarks = readBookmarks();

function readBookmarks() {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return new Set(Array.isArray(data) ? data.filter((id) => typeof id === "string") : []);
  } catch {
    return new Set();
  }
}

function updateBookmarks(id) {
  if (bookmarks.has(id)) bookmarks.delete(id);
  else bookmarks.add(id);
  try {
    localStorage.setItem(storageKey, JSON.stringify([...bookmarks]));
  } catch {
    // Keep favourites available for this tab even when storage is unavailable.
  }
  updateSavedCount();
}

function updateSavedCount() {
  const total = [...bookmarks].filter((id) => recipesById.has(id)).length;
  $("#saved-total").hidden = total === 0;
  $("#saved-total").textContent = total;
}

function label(value) {
  return specialNames[value] ?? value.charAt(0).toUpperCase() + value.slice(1);
}

function normalize(value) {
  return value.toLowerCase().normalize("NFC")
    .replace(/[-‐–—]/g, " ")
    .replace(/[^\p{L}\p{M}\p{N}\u200c\u200d]+/gu, " ")
    .trim();
}

function searchTokens(value) {
  return normalize(value).split(/\s+/).filter(Boolean).map((token) => searchAliases[token] ?? token);
}

function prepareRecipe(recipe, order) {
  const meals = new Set(recipe.meals);
  const cuisines = new Set(recipe.cuisines);
  const tastes = new Set(recipe.tastes);
  const title = recipe.title.toLowerCase();
  if (recipe.id === "Hm1dNC2m29w") {
    tastes.delete("sweet");
    tastes.add("savoury");
  }
  if (/\b(dessert|pudding|kheer|payasam|brownie|cheesecake|cake|kulfi)\b|പായസം|#dessert/i.test(title)) {
    meals.add("desserts");
    tastes.add("sweet");
  }
  if (/thalassery|malabar|kottayam/i.test(title)) cuisines.add("kerala");
  const translated = translatedTerms.filter(([pattern]) => pattern.test(title)).map(([, terms]) => terms);
  const searchText = searchTokens([recipe.title, recipe.channel, ...meals, ...cuisines, ...tastes, ...translated].join(" ")).join(" ");
  return { ...recipe, order, meals: [...meals], cuisines: [...cuisines], tastes: [...tastes], searchText };
}

function fillSelect(select, key) {
  const values = [...new Set(recipes.flatMap((recipe) => recipe[key]))]
    .sort((left, right) => collator.compare(label(left), label(right)));
  for (const value of values) select.add(new Option(label(value), value));
}

function readLocation() {
  const params = new URLSearchParams(location.search);
  const option = (select, value) => [...select.options].some((opt) => opt.value === value) ? value : "";
  state.query = params.get("q") || "";
  state.meal = mealButtons.find((button) => button.dataset.meal === params.get("meal"))?.dataset.meal || "";
  state.cuisine = option(cuisine, params.get("cuisine"));
  state.taste = option(taste, params.get("taste"));
  state.sort = option(sort, params.get("sort")) || defaultSort;
  state.ml = params.get("ml") === "1";
  state.saved = params.get("view") === "saved";
  state.limit = pageSize;
}

function writeLocation() {
  const params = new URLSearchParams();
  if (state.query.trim()) params.set("q", state.query.trim());
  if (state.meal) params.set("meal", state.meal);
  if (state.cuisine) params.set("cuisine", state.cuisine);
  if (state.taste) params.set("taste", state.taste);
  if (state.sort !== defaultSort) params.set("sort", state.sort);
  if (state.ml) params.set("ml", "1");
  if (state.saved) params.set("view", "saved");
  const url = new URL(location.href);
  url.search = params.toString();
  history.replaceState(history.state, "", url);
}

function selectRecipes() {
  const tokens = searchTokens(state.query);
  const results = recipes.filter((recipe) =>
    (!state.saved || bookmarks.has(recipe.id))
    && (!state.meal || recipe.meals.includes(state.meal))
    && (!state.cuisine || recipe.cuisines.includes(state.cuisine))
    && (!state.taste || recipe.tastes.includes(state.taste))
    && (!state.ml || malayalamPattern.test(recipe.title))
    && tokens.every((token) => recipe.searchText.includes(token))
  );
  if (state.sort === "title") results.sort((a, b) => collator.compare(a.title, b.title));
  if (state.sort === "picks") {
    results.sort((a, b) => (pickOrder.get(a.id) ?? picks.length) - (pickOrder.get(b.id) ?? picks.length));
  }
  return results;
}

function recipeText(node, text) {
  node.textContent = text;
  node.lang = malayalamPattern.test(text) ? "ml" : "en";
  node.dir = "auto";
}

function thumbnail(recipe, lazy = false) {
  const image = document.createElement("img");
  image.alt = "";
  image.width = 320;
  image.height = 180;
  image.decoding = "async";
  if (lazy) image.loading = "lazy";
  image.addEventListener("error", () => { image.hidden = true; }, { once: true });
  image.referrerPolicy = "no-referrer";
  image.src = "https://i.ytimg.com/vi/" + recipe.id + "/mqdefault.jpg";
  return image;
}

function createTag(value, accent = false) {
  const tag = document.createElement("span");
  tag.className = accent ? "tag alt" : "tag";
  tag.textContent = label(value);
  return tag;
}

function syncCardSave(button, recipe) {
  const saved = bookmarks.has(recipe.id);
  button.setAttribute("aria-pressed", String(saved));
  button.setAttribute("aria-label", (saved ? "Remove from favourites: " : "Save to favourites: ") + recipe.title);
  button.title = saved ? "Remove from favourites" : "Save to favourites";
}

function makeCard(recipe, index) {
  const card = $("#card-template").content.firstElementChild.cloneNode(true);
  card.dataset.id = recipe.id;
  const title = $(".card-title", card);
  recipeText(title, recipe.title);
  title.addEventListener("click", () => openRecipe(recipe));
  const channel = $(".card-channel", card);
  recipeText(channel, recipe.channel);
  channel.hidden = !recipe.channel;
  $(".card-photo", card).prepend(thumbnail(recipe, index > 3));
  const duration = $(".duration", card);
  duration.textContent = recipe.duration;
  duration.hidden = !recipe.duration;
  if (recipe.duration) duration.setAttribute("aria-label", "Video length " + recipe.duration);
  const tagBox = $(".card-tags", card);
  const firstTag = recipe.cuisines[0] || recipe.meals[0];
  if (firstTag) tagBox.append(createTag(firstTag));
  if (recipe.tastes[0]) tagBox.append(createTag(recipe.tastes[0], true));
  tagBox.hidden = !tagBox.childElementCount;
  const watch = $(".card-watch", card);
  watch.href = recipe.url;
  watch.setAttribute("aria-label", "Watch on YouTube: " + recipe.title);
  const save = $(".card-save", card);
  syncCardSave(save, recipe);
  save.addEventListener("click", () => {
    updateBookmarks(recipe.id);
    if (state.saved) {
      render();
      ($(".card-save", grid) || savedLink).focus({ preventScroll: true });
    } else {
      syncCardSave(save, recipe);
    }
  });
  return card;
}

function render(append = false) {
  if (search.value !== state.query) search.value = state.query;
  cuisine.value = state.cuisine;
  taste.value = state.taste;
  sort.value = state.sort;
  malayalam.checked = state.ml;
  savedLink.setAttribute("aria-pressed", String(state.saved));
  if (state.saved) $("#browse-link").removeAttribute("aria-current");
  else $("#browse-link").setAttribute("aria-current", "page");
  $("#catalogue-heading").textContent = state.saved ? "Saved favourites" : "Browse recipes";
  for (const button of mealButtons) button.setAttribute("aria-pressed", String(button.dataset.meal === state.meal));

  const filtered = Boolean(state.query.trim() || state.meal || state.cuisine || state.taste || state.ml);
  const results = selectRecipes();
  const displayed = Math.min(results.length, state.limit);
  $("#clear-search").hidden = !state.query;
  $("#reset-filters").hidden = !filtered;
  $("#results-count").textContent = displayed < results.length
    ? "Showing " + displayed + " of " + results.length + " videos"
    : results.length + (results.length === 1 ? " video" : " videos");
  const firstIndex = append ? grid.childElementCount : 0;
  const cards = results.slice(firstIndex, displayed).map((recipe, index) => makeCard(recipe, firstIndex + index));
  if (!append) grid.replaceChildren(...cards);
  else grid.append(...cards);
  $("#load-more").hidden = displayed === results.length;

  const empty = results.length === 0;
  const emptySaved = state.saved && !bookmarks.size;
  $("#empty-state").hidden = !empty;
  if (empty) {
    $("#empty-heading").textContent = emptySaved ? "No favourites yet" : "No recipes match";
    $("#empty-text").textContent = emptySaved
      ? "Tap a bookmark on any recipe to find it here later."
      : "Try a different search or clear the filters.";
    $("#empty-action").textContent = emptySaved ? "Browse recipes" : "Clear filters";
    $("#empty-action").dataset.browse = String(emptySaved);
  }
}

function update(patch) {
  Object.assign(state, patch, { limit: pageSize });
  writeLocation();
  render();
}

function switchView(saved) {
  if (state.saved !== saved) update({ ...defaultFilters, saved });
  $("#catalogue").scrollIntoView();
  $("#catalogue-heading").focus({ preventScroll: true });
}

function openRecipe(recipe) {
  activeRecipe = recipe;
  $("#detail-image-wrap").replaceChildren(thumbnail(recipe));
  recipeText($("#recipe-heading"), recipe.title);
  $("#detail-meta").textContent = [recipe.channel, recipe.duration ? "Video length " + recipe.duration : ""].filter(Boolean).join(" · ");
  $("#detail-watch").href = recipe.url;
  const tags = [...new Set([...recipe.meals, ...recipe.cuisines, ...recipe.tastes])];
  const container = $("#detail-tags");
  container.replaceChildren(...tags.map((tag) => createTag(tag)));
  if (!tags.length) container.textContent = "No tags added yet.";
  syncDetailSave();
  recipeDialog.showModal();
  recipeDialog.scrollTop = 0;
  $("#recipe-heading").focus({ preventScroll: true });
}

function syncDetailSave() {
  const saved = bookmarks.has(activeRecipe.id);
  $("#detail-save").textContent = saved ? "Remove favourite" : "Save favourite";
  $("#detail-save").setAttribute("aria-pressed", String(saved));
}

function connect() {
  filters.addEventListener("submit", (event) => {
    event.preventDefault();
    search.blur();
  });
  search.addEventListener("input", () => update({ query: search.value }));
  $("#clear-search").addEventListener("click", () => {
    update({ query: "" });
    search.focus();
  });
  for (const button of mealButtons) button.addEventListener("click", () => update({ meal: button.dataset.meal }));
  cuisine.addEventListener("change", () => update({ cuisine: cuisine.value }));
  taste.addEventListener("change", () => update({ taste: taste.value }));
  sort.addEventListener("change", () => update({ sort: sort.value }));
  malayalam.addEventListener("change", () => update({ ml: malayalam.checked }));
  $("#reset-filters").addEventListener("click", () => {
    update(defaultFilters);
    search.focus({ preventScroll: true });
  });
  $("#empty-action").addEventListener("click", () => {
    if ($("#empty-action").dataset.browse === "true") switchView(false);
    else {
      update(defaultFilters);
      search.focus({ preventScroll: true });
    }
  });
  $("#browse-link").addEventListener("click", (event) => {
    event.preventDefault();
    switchView(false);
  });
  savedLink.addEventListener("click", () => switchView(!state.saved));
  $("#load-more").addEventListener("click", () => {
    const nextIndex = grid.childElementCount;
    state.limit += pageSize;
    render(true);
    $(".card-title", grid.children[nextIndex])?.focus();
  });
  $("#about-link").addEventListener("click", () => $("#about-dialog").showModal());
  for (const dialog of document.querySelectorAll("dialog")) {
    $("[data-close]", dialog).addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }
  $("#detail-save").addEventListener("click", () => {
    updateBookmarks(activeRecipe.id);
    syncDetailSave();
    if (!state.saved) {
      const card = grid.querySelector('[data-id="' + activeRecipe.id + '"]');
      if (card) syncCardSave($(".card-save", card), activeRecipe);
    }
  });
  recipeDialog.addEventListener("close", () => {
    if (!state.saved || bookmarks.has(activeRecipe.id)) return;
    render();
    ($(".card-title", grid) || savedLink).focus({ preventScroll: true });
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    bookmarks = readBookmarks();
    updateSavedCount();
    render();
    if (recipeDialog.open) syncDetailSave();
  });
  window.addEventListener("popstate", () => {
    readLocation();
    render();
  });
}

async function start() {
  try {
    const response = await fetch("./catalogue.json");
    if (!response.ok) throw new Error("Catalogue request failed");
    const archive = await response.json();
    recipes = archive.recipes.map(prepareRecipe);
    recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]));
    fillSelect(cuisine, "cuisines");
    fillSelect(taste, "tastes");
    readLocation();
    updateSavedCount();
    const omitted = archive.playlistCount - recipes.length;
    const hiddenVideos = omitted > 0 ? " YouTube showed " + archive.playlistCount + " total entries and hid " + omitted + " unavailable videos." : "";
    $("#archive-summary").textContent = "The saved page contains " + recipes.length + " visible videos. The original titles, direct YouTube video links, available channel names and video lengths are preserved." + hiddenVideos;
    connect();
    render();
  } catch (error) {
    console.error(error);
    $("#results-count").textContent = "The catalogue couldn’t load. Refresh this page to try again.";
  }
}

start();
