---
layout: default
title: "🌟 Our first 10 recipes"
permalink: /featured/
---

# 🌟 Ammu & Achu's First 10 Recipe Cards

These recipes span different meals and cuisines. Original video links are preserved. Written methods and ingredients are awaiting confirmation; please use the linked video for cooking.

{% assign featured = "001,012,034,050,058,077,087,100,116,131" | split: "," %}
{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
{% assign number = recipe.url | split: "/" | last | split: "-" | first %}
{% if featured contains number %}
- 🍽️ [{{ recipe.title | escape }}]({{ recipe.url | relative_url }}) · [▶️ Original video](https://www.youtube.com/watch?v={{ recipe.video_id }})
{% endif %}
{% endfor %}

[🏡 Back to homepage]({{ '/' | relative_url }})
