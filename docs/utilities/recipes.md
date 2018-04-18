Recipes
=======

With the update to Minecraft 1.12, Mojang introduced a new data-driven recipe system based on JSON files. Since then it has been adopted by Forge as well and will be expanded with Minecraft 1.13.

Loading Recipes
---------------
Forge will load all recipes which can be found within the `./assets/<modid>/models/recipes/` folder. You can call these files whatever you want, thought the vanilla convention is to name them after the output item. This name is also used as the registration key, but does not affect the operation of the recipe.

The Recipe file
---------------
|     Property | Description |
|-------------:|------------|
|     type |  Let's Forge know of what type the recipe is. This can either be `minecraft:crafting_shaped` or `minecraft:crafting_shapeless`. You can also register a type for yourself or use Forge specific types.
|     pattern | A pattern list must be defined for a shaped recipe to define where which item has to be placed. A blank space means there is no item to placed at that position. |
|     key | Each key defined within the key list must define a character from the `pattern` list and what item it should hold. Undefined keys are treated as a blank space. |
|     data | The variant of the block or item to be used. |
|     `"type": "forge:ore_dict"` | Here the input items are part of the Forge [`OreDictionary`][OreDictionary]. Thus, an "ore" will be defined instead of an item. Leave this out if you don't want to use the [`OreDictionary`][OreDictionary]. |
|     result | Within the `result` keyword, the output item of the crafting recipe is defined. |
|     count | This is an optional keyword used to define how many items you want to get from the recipe. If this is left out, one item will be returned. |

The basic structure of your recipe file should look like the following example file:

!!! note

	This is a basic example and does not show every possibility you may have.

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
TODO
	"type": "forge:oreshaped",
	
Groups
------

Shaped and shapeless crafting
-----------------------------
Within this section we will take a closer look on the differences between defining a shaped and a shapeless crafting recipe. Please read both sections carefully as I won't explain the same keywords twice when they can be used within both recipe types!

### Shaped crafting
Shaped recipes require the `pattern` and `key` keywords. A pattern defines the slot an item must appear in using placeholder characters. You can choose whatever character you want to be a placeholder for an item. Keys on the other hand define what items are to be used instead of the placeholders. A key is defined by a placeholder character and the item. 
Additional the type `forge:ore_dict` may be added. This defines the item beeing part of the [`OreDictionary`][OreDictionary] and can for example be used when it doesn't matter which copper ore is used to produce a copper ingot. In this case the `ore` tag has to be used instead of the `item` tag to define the item.
The `data` tag is a optional and used to define the metadata of a block or item.

### Shapeless crafting
A shapeless recipe doesn't make use of the `pattern` and `key` keywords. 

To define a shapeless recipe, you have to use the `ingredients` list. It defines which items have to be used for the crafting process and can also make use of the additional type `forge:ore_dict` and it's functionality as described above. It is even possible to define multiply instances of the same item which means multiply of these items have to be in place for the crafting recipe to take place. 

!!! note

	While there is no limit on how many ingredients your recipe requires the vanilla crafting table does only allow 9 items to be placed for each crafting recipe.

The following example shows how an ingredient list looks like within JSON.

```json
    "ingredients": [
        {
            "type": "forge:ore_dict",
            "ore": "minecraft:diamond"
        },
        {
            "item": "minecraft:nether_star"
        }
    ],
```

### Special behaviour of the `data` tag
It is strongly adviced to use the `data` tag to define the metadata of your items and blocks. When it is not used within the ingredients or keys, it will mean any metadata of this item will be accepted, for example: Not defining the data of a sword means even a half broken sword will be accepted for the crafting recipe!

Patterns
--------

Keys
----

Ingredients
-----------

Results
-------
TODO

When crafting something, you can get out more than one item. This is achieved by defining the `count` number. If this is left out, meaning it doesn't exist within the result block, it defaults to 1. Negative values are not allowed here as an Itemstack cannot be smaller than 0. There is no option to use the `count` number anywhere else than for the result.
The `data` tag is a optional and used to define the metadata of a block or item. It defaults to 0 when it doesn't exist.

Adding conditions to your recipe
--------------------------------

Using the Recipe System for own blocks
--------------------------------------

[OreDictionary]: ../utilities/oredictionary.md
[Advancements]: #
