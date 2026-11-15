---
layout: default
title: "🥟 Snacks · 😋 Find by Taste"
permalink: /meals/snacks/tastes/
---

# 🥟 Snacks → 😋 Find by Taste

[🏡 Home]({{ '/' | relative_url }}) · [⬅️ Back to snacks]({{ '/meals/snacks/' | relative_url }}) · [📚 All recipes]({{ '/catalogue/' | relative_url }})

[Spicy](#spicy) · [Tangy](#tangy) · [Sweet](#sweet) · [Savoury](#savoury) · [Creamy](#creamy) · [Crispy](#crispy)

## 😋 Spicy

{% assign count = 0 %}
{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
{% if recipe.meals contains "snacks" and recipe.tastes contains "spicy" %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% assign count = count | plus: 1 %}
{% endif %}
{% endfor %}
{% if count == 0 %}_No entries classified here yet._{% endif %}

## 😋 Tangy

{% assign count = 0 %}
{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
{% if recipe.meals contains "snacks" and recipe.tastes contains "tangy" %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% assign count = count | plus: 1 %}
{% endif %}
{% endfor %}
{% if count == 0 %}_No entries classified here yet._{% endif %}

## 😋 Sweet

{% assign count = 0 %}
{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
{% if recipe.meals contains "snacks" and recipe.tastes contains "sweet" %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% assign count = count | plus: 1 %}
{% endif %}
{% endfor %}
{% if count == 0 %}_No entries classified here yet._{% endif %}

## 😋 Savoury

{% assign count = 0 %}
{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
{% if recipe.meals contains "snacks" and recipe.tastes contains "savoury" %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% assign count = count | plus: 1 %}
{% endif %}
{% endfor %}
{% if count == 0 %}_No entries classified here yet._{% endif %}

## 😋 Creamy

{% assign count = 0 %}
{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
{% if recipe.meals contains "snacks" and recipe.tastes contains "creamy" %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% assign count = count | plus: 1 %}
{% endif %}
{% endfor %}
{% if count == 0 %}_No entries classified here yet._{% endif %}

## 😋 Crispy

{% assign count = 0 %}
{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
{% if recipe.meals contains "snacks" and recipe.tastes contains "crispy" %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% assign count = count | plus: 1 %}
{% endif %}
{% endfor %}
{% if count == 0 %}_No entries classified here yet._{% endif %}
