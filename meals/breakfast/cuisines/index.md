---
layout: default
title: "🥞 Breakfast · 🌍 Find by Cuisine"
permalink: /meals/breakfast/cuisines/
---

# 🥞 Breakfast → 🌍 Find by Cuisine

[🏡 Home]({{ '/' | relative_url }}) · [⬅️ Back to breakfast]({{ '/meals/breakfast/' | relative_url }}) · [📚 All recipes]({{ '/catalogue/' | relative_url }})

[Kerala](#kerala) · [North Indian](#north-indian) · [Indo Chinese](#indo-chinese) · [Korean](#korean) · [Thai](#thai) · [Hyderabadi](#hyderabadi) · [Andhra Chettinad](#andhra-chettinad) · [Mangalorean](#mangalorean) · [Western Fusion](#western-fusion) · [Other Indian](#other-indian)

## 🌍 Kerala

{% assign count = 0 %}
{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
{% if recipe.meals contains "breakfast" and recipe.cuisines contains "kerala" %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% assign count = count | plus: 1 %}
{% endif %}
{% endfor %}
{% if count == 0 %}_No entries classified here yet._{% endif %}

## 🌍 North Indian

{% assign count = 0 %}
{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
{% if recipe.meals contains "breakfast" and recipe.cuisines contains "north-indian" %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% assign count = count | plus: 1 %}
{% endif %}
{% endfor %}
{% if count == 0 %}_No entries classified here yet._{% endif %}

## 🌍 Indo Chinese

{% assign count = 0 %}
{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
{% if recipe.meals contains "breakfast" and recipe.cuisines contains "indo-chinese" %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% assign count = count | plus: 1 %}
{% endif %}
{% endfor %}
{% if count == 0 %}_No entries classified here yet._{% endif %}

## 🌍 Korean

{% assign count = 0 %}
{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
{% if recipe.meals contains "breakfast" and recipe.cuisines contains "korean" %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% assign count = count | plus: 1 %}
{% endif %}
{% endfor %}
{% if count == 0 %}_No entries classified here yet._{% endif %}

## 🌍 Thai

{% assign count = 0 %}
{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
{% if recipe.meals contains "breakfast" and recipe.cuisines contains "thai" %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% assign count = count | plus: 1 %}
{% endif %}
{% endfor %}
{% if count == 0 %}_No entries classified here yet._{% endif %}

## 🌍 Hyderabadi

{% assign count = 0 %}
{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
{% if recipe.meals contains "breakfast" and recipe.cuisines contains "hyderabadi" %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% assign count = count | plus: 1 %}
{% endif %}
{% endfor %}
{% if count == 0 %}_No entries classified here yet._{% endif %}

## 🌍 Andhra Chettinad

{% assign count = 0 %}
{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
{% if recipe.meals contains "breakfast" and recipe.cuisines contains "andhra-chettinad" %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% assign count = count | plus: 1 %}
{% endif %}
{% endfor %}
{% if count == 0 %}_No entries classified here yet._{% endif %}

## 🌍 Mangalorean

{% assign count = 0 %}
{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
{% if recipe.meals contains "breakfast" and recipe.cuisines contains "mangalorean" %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% assign count = count | plus: 1 %}
{% endif %}
{% endfor %}
{% if count == 0 %}_No entries classified here yet._{% endif %}

## 🌍 Western Fusion

{% assign count = 0 %}
{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
{% if recipe.meals contains "breakfast" and recipe.cuisines contains "western-fusion" %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% assign count = count | plus: 1 %}
{% endif %}
{% endfor %}
{% if count == 0 %}_No entries classified here yet._{% endif %}

## 🌍 Other Indian

{% assign count = 0 %}
{% assign recipes = site.pages | where: "layout", "recipe" | sort: "title" %}
{% for recipe in recipes %}
{% if recipe.meals contains "breakfast" and recipe.cuisines contains "other-indian" %}
- 🍴 [{{ recipe.title | escape }}]({{ recipe.url | relative_url }})
{% assign count = count | plus: 1 %}
{% endif %}
{% endfor %}
{% if count == 0 %}_No entries classified here yet._{% endif %}
