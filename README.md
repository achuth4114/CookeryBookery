# 🍅 CookeryBookery 🍛

### ❤️ Ammu & Achu's happy little cookbook

**Less deciding. More cooking. Even more eating! 😋**

> Our mission: Ammu and Achu shouldn't have to spend ages trying to figure out what they want to eat. Here's our collection of saved recipes, just a few clicks away. 🧡

[Open CookeryBookery on GitHub Pages](https://achuth4114.github.io/CookeryBookery/)

The cookbook brings together the saved MyCookingList videos with English and
Malayalam search, combined filters and favourites stored in each browser.
The archive provides the titles, video links, channel names and video lengths.
Browse tags are suggestions. Use the original YouTube videos for ingredients
and instructions.

## Updating the catalogue

Run `python3 scripts/import_catalogue.py path/to/saved-playlist.html` from the
checkout. The importer uses the meal, cuisine and taste tags in `recipes/`,
writes `catalogue.json` and keeps the original video IDs and timestamps.
Keep the saved YouTube HTML outside the repository. Thumbnails are loaded
from YouTube using the video IDs.

The homepage and its assets are static. Run `python3 -m http.server 8000` to
preview the recipe browser. GitHub Pages serves the homepage and the existing
Jekyll recipe and category links from this repository.
