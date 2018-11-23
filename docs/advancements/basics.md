Advancements Basics
===================

The Home of Advancements
------------------------

In 1.12 Advancements live in the advancements directory of your mod's Resource Pack. This will change in 1.13 to be in the advancements directory of your mod's Data Pack.

The DNA of an Advancement
-------------------------

Advancements are mainly just a `.json` file and lang file entries. So unless you want to add custom criteria, you shouldn't need to add any code.

The format of an advancement's `.json` is as follows:

```
"parent"
"display"
|-"icon" 
| |-"item"
| |-"nbt"
|
|-"title"
|-"description"
|-"frame"
|-"background"
|-"show_toast"
|-"announce_to_chat"
|-"hidden"

"criteria"
|-"criterion name"
  |-"trigger"
  |-"conditions"

"requirements"
"rewards"
|-"recipes"
|-"loot"
|-"experience"
|-"function"
```