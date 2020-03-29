Recipes
=======

With the update to Minecraft 1.12, Mojang introduced a new data-driven recipe system based on JSON files. Since then it has been adopted by Forge as well as vanilla datapacks in Minecraft 1.13.

Loading Recipes
---------------
Forge will load all recipes which can be found within the `./assets/<modid>/recipes/` folder. You can call these files whatever you want, thought the vanilla convention is to name them after the output item. This name is also used as the registration key, but does not affect the operation of the recipe.

!!! note

    Recipe files cannot begin with an underscore as this is reserved for constants files. The JSON file extension is required.

The Recipe file
---------------

A basic recipe file might look like the following example:

```json
{
    "type": "minecraft:crafting_shaped",
    "pattern":
    [
        "xxa",
        "x x",
        "xxx"
    ],
    "key":
    {
        "x":
        {
            "tag": "forge:gems/diamond"
        },
        "a":
        {
            "item": "mymod:myfirstitem"
        }
    },
    "result":
    {
        "item": "mymod:myitem",
        "count": 9
    }
}
```

!!! note

    When you first obtain an ingredient to a vanilla recipe it will automatically unlock the recipe in the recipe book. To achieve the same effect, you have to use the [`Advancement`][Advancements] system and create a new `Advancement` for each of your ingredients.

    The advancement has to exist. This doesn't mean it has to be visible in the advancement tree.

### Type

The type of a recipe with the type field. You can think of this as the definition of which crafting layout is to be used, for example `minecraft:crafting_shaped` or `minecraft:crafting_shapeless`.

If you want, you can define your own types as well which requires the use of a [`_factories.json`][Factories] file.

### Groups

Optionally you can add a group to your recipes to be displayed within the recipe helper interface. All recipes with the same group String will be shown in the same group. For example, this can be used to have all door recipes shown in the recipe helper interface as a single entry, even though there are different types of doors.

Types of crafting recipes
-----------------------------
Within this section we will take a closer look on the differences between defining a shaped and a shapeless crafting recipe.

### Shaped crafting

Shaped recipes require the `pattern` and `key` keywords. A pattern defines the slot an item must appear in using placeholder characters. You can choose whatever character you want to be a placeholder for an item. Keys on the other hand define what items are to be used instead of the placeholders. A key is defined by a placeholder character and some combination of items and tags. `item` requires a specific item; `tag` will accept any item with the given tag. Generally, tags are preferred as they will integrate with other mods more nicely.

### Shapeless crafting

A shapeless recipe doesn't make use of the `pattern` and `key` keywords.

To define a shapeless recipe, you have to use the `ingredients` list. It defines which items have to be used for the crafting process. It is even possible to define multiple instances of the same item which means multiple of these items have to be in place for the crafting recipe to take place.

!!! note

    While there is no limit on how many ingredients your recipe requires the vanilla crafting table does only allow 9 items to be placed for each crafting recipe.

The following example shows how an ingredient list looks like within JSON.

```json
    "ingredients": [
        {
            "tag": "forge:gems/diamond",
        },
        {
            "item": "minecraft:nether_star"
        }
    ],
```

### Cooking
There are several different types of cooking recipes, including `minecraft:smelting`, `minecraft:blasting`, `minecraft:smoking`, and `minecraft:campfire_cooking`. (Note that adding a blasting or smoking recipe does not add a smelting recipe.) All cooking recipes share the same format. While vanilla only allows an output stack size of 1, Forge allows recipes to output any stack size.

The following example shows a blasting recipe.

```json
{
  "type": "minecraft:blasting",
  "ingredient": [
    {
      "tag": "forge:ores/copper"
    }
  ],
  "result": {
    "item": "mymod:copper_ingot",
    "count": 1
  },
  "experience": 0.7,
  "cookingtime": 100
}
```

Recipe Elements
---------------

### Patterns

A pattern will be defined with the `pattern` list. Each string represents one row in the crafting grid and each placeholder character within the String represents a column. As seen in the example above a space means that no item needs to be inserted at that position.

### Keys

A key set is used in combination with patterns and contains keys whose name is the same as the placeholder character in the pattern list which it represents. One key may be defined to represent multipe items. This means that the player can use one of the defined items for the crafting recipe. However, there will usually be an already defined tag that contains the items needed, and as tags can be extended by other mods they are almost always preferable.

```json
  "key": {
     "#": [
      {
        "item": "minecraft:potato",
      },
      {
        "item": "minecraft:poisonous_potato",
      }
    ]
  }
```

### Results

Every `recipe` has to have a result tag to define the output item.

When crafting something, you can get out more than one item. This is achieved by defining the `count` number. If this is left out, meaning it doesn't exist within the result block, it defaults to 1. Negative values are not allowed here as an Itemstack cannot be smaller than 0. There is no option to use the `count` number anywhere else than for the result.


Factories
---------
Factories can be used to allow defining recipes and ingredients of a custom type (class). To create your own factory, create a `_factories.json`. Within this file a type has to be defined, for example: `recipes`,  `ingredients` or `conditions`. These types represent `IRecipeFactory `, `IIngredientFactory`, and `IConditionFactory`, respectively. The entry "key" must be a `name` which can be later used in your recipes, and the "value" is the fully qualified class name is a class you have to create which implements one of the above recipes. The class must have an empty constructor. For example:

```json
{
    "<type>": {
        "<name>": "<fully qualified classname for the specified type>"
    }
}
```

!!! note

    There is no need to create a new `_factories.json` for each type you want to specify, they can all be defined in a single file.

### Conditional Recipes

Conditional recipes can be created by making use of the factory system described above. For this you use the `conditions` type with the `IConditionFactory` from above and can later add the `conditions` type to your recipes:

```json
{
    "conditions": [
        {
            "type": "<modid>:<name>"
        }
    ]
}
```
These conditions only apply to the recipe as a whole and not to ingredients. As an example, you might want to check if a mod is loaded using the already existing condition `forge:mod_loaded`, and `"modid": "<mod to check>"`.
!!! note

    Conditions will only be checked once at startup!

Constants
---------
It is possible to define constant values for your recipes. These values have to be defined within a `_constants.json` and can be used within any recipe of your mod by just writing `#<name>`. For filled buckets, you should use `fluid` instead of `data`. For example, this constant defines `#SADDLE` which represents the vanilla saddle item.

```json
[
	{
		"name": "SADDLE",
		"ingredient": {
			"item": "minecraft:saddle"
		}
	}
]
```

[Wikipedia]: https://en.wikipedia.org/wiki/Factory_(object-oriented_programming)
[Advancements]: #
[Wiki]: https://minecraft.gamepedia.com/Recipe
[Factories]: #factories
