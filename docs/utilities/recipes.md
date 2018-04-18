Recipes
=======

With the update to Minecraft 1.12, Mojang introduced a new data-driven recipe system based on JSON files. Since then it has been adopted by Forge aswell and will be expanded with Minecraft 1.13.

Loading Recipes
---------------
Forge will load all recipes which can be found within the `./assets/<modid>/models/recipes/` folder.
You can call these files whatever you want, thought the vanilla convention is to name them after the
output item. This name is also used as the registration key, but does not affect the operation of the
recipe.

The Recipe file
---------------
|     Property | Description |
|-------------:|------------|
|     type |  Let's Forge now of what type the recipe is. This can either be `minecraft:crafting_shaped` or `minecraft:crafting_shapeless`. A shapeless crafting recipe is an crafting recipe where it doesn't matter where you place the items in your crafting grid while for a shaped crafting recipe it is important to place them at the defined position.
|     pattern | A pattern list must be defined for a shaped recipe to define where which item has to be placed. |
|     key | Each key defined within the key list must define a character from the `pattern` list and what item it should hold. |
|     data | The variant of the block or item to be used. |
|     `"type": "forge:ore_dict"` | Here the input items are part of the Forge [`OreDictionary`][OreDictionary]. Thus, an "ore" will be defined instead of an item. Leave this out if you don't want to use the [`OreDictionary`][OreDictionary]. |
|     result | Within the `result` keyword, the output item of the crafting recipe is defined. |
|     count | This is an optional keyword used to define how many items you want to get from the recipe. If this is left out, one item will be returned. |

The basic structure of your recipe file should look like the following example file:

!!! note

	This is a basic example and does not show every possibility you may have.

```java
{
    "type": "minecraft:crafting_shaped",
	"pattern":
	[
		"xxa",
		"x x",
		"xxx"
	],
	"type": "forge:oreshaped",
	"key":
	{
		"x":
		{
			"type": "forge:ore_dict",
			"ore": "diamond"
		},
		"a":
		{
		    "item": "mymod:myfirstitem",
		    "data": 1
		}
	},
	"result":
	{
		"item": "mymod:myitem",
		"count": 9
		"data": 2
	}
}
```

Unlocking Recipes within the Recipe Book
----------------------------------------
When you first obtain an ingredient to a vanilla recipe it will automatically unlock the recipe in the
recipe book. To achieve the same affect, you have to use the [`Advancement`][Advancements] system and create
a new `Advancement` for each of your ingredients.

!!! note

	The advancement has to exist. This doesn't mean it has to be visible in the advancement tree.

Item Objects
------------

Type
----

Groups
------

Shaped and Shapeless crafting
-----------------------------

Patterns
--------

Keys
----

Ingredients
-----------

Results
-------

Adding conditions to your recipe
--------------------------------

Using the Recipe System for own blocks
--------------------------------------

[OreDictionary]: ../utilities/oredictionary.md
[Advancements]: #
