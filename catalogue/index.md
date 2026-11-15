---
layout: default
title: "📚 Complete Recipe Catalogue"
permalink: /catalogue/
---
# 📚 All 186 saved videos

[🏡 Home]({{ '/' | relative_url }})

{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
- 🍴 [{{ recipe.title }}]({{ recipe.url | relative_url }})
{% endfor %}
