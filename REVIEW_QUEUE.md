---
layout: default
title: "🔎 Classification review queue"
permalink: /review-queue/
---

# 🔎 Classification review queue

These entries have uncertain meal or cuisine tags, based on the saved playlist titles. This page is regenerated from the recipe front matter whenever the site builds.

## 🍽️ Meal classification to verify

{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}{% if recipe.meals == empty %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% endif %}{% endfor %}

## 🌍 Cuisine classification to verify

{% for recipe in recipes %}{% if recipe.cuisines == empty %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% endif %}{% endfor %}

> 📝 The cooking time, servings, ingredients and method also need video verification across the full catalogue.

[🏡 Home]({{ '/' | relative_url }}) · [📚 Catalogue]({{ '/catalogue/' | relative_url }})
