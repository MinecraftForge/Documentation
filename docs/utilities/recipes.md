Recipes
=======

With the update to Minecraft 1.12, Mojang introduced a new data-driven recipe system based on JSON files. Since then it has been adopted by Forge as well and will be expanded with Minecraft 1.13.
All recipe json have to be saved with the UTF-8 encoding.

Loading Recipes
---------------
Forge will load all recipes which can be found within the `./assets/<modid>/models/recipes/` folder. You can call these files whatever you want, thought the vanilla convention is to name them after the output item. This name is also used as the registration key, but does not affect the operation of the recipe.

!!! note

    While in theory it doesn't matter how the file is called Forge will ignore all recipe files which begin with an underscore or don't have the JSON file extension.

The Recipe file
---------------
Here is a small explanation of the properties used in the JSON file below. For a more in-depth explanation, please scroll down.
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
        "count": 9,
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

Type
----
Both Minecraft and Forge require you to specify the type of your recipe within the type tag. You can think of this as the definition of which the crafting layout is to be used, for example `minecraft:crafting_shaped` or `minecraft:crafting_shapeless` or `minecraft:smelting` for the furnace. Forge has also specified `forge:oreshaped` in order to use the ore dictionary within a shaped recipe, thought you may want to prefer using the ingredient oredict type instead. The ingredient oredict is a type of itself, only defined for each ingredient separately instead of the entire recipe. It looks like this: `"type": "forge:ore_dict"` and doesn't allow to specify the `data` tag. The above tags are example tags only and not a complete list of all available options for the type!

If you want, you can define your own types aswell which requires the use of a `_factories.json` file.
	
Groups
------
Optionally you can add a group to your recipes to be displayed within the recipe helper interface. It doesn't matter what you specify as all recipes with the same String will be shown in the same group. This can be used for example for having all door recipes shown in the recipe helper interface as there are different types of doors depending on the used wood.

Shaped and shapeless crafting
-----------------------------
Within this section we will take a closer look on the differences between defining a shaped and a shapeless crafting recipe.

### Shaped crafting
Shaped recipes require the `pattern` and `key` keywords. A pattern defines the slot an item must appear in using placeholder characters. You can choose whatever character you want to be a placeholder for an item. Keys on the other hand define what items are to be used instead of the placeholders. A key is defined by a placeholder character and the item. 
Additional the type `forge:ore_dict` may be added. This defines the item beeing part of the [`OreDictionary`][OreDictionary] and can for example be used when it doesn't matter which copper ore is used to produce a copper ingot. In this case the `ore` tag has to be used instead of the `item` tag to define the item. There are [many more][Wiki] of these types which can be used here and you can even register your own.
The `data` tag is a optional and used to define the metadata of a block or item.

### Shapeless crafting
A shapeless recipe doesn't make use of the `pattern` and `key` keywords. 

To define a shapeless recipe, you have to use the `ingredients` list. It defines which items have to be used for the crafting process and can also make use of the additional type `forge:ore_dict` and it's functionality as described above. There are [many more][Wiki] of these types which can be used here and you can even register your own. It is even possible to define multiply instances of the same item which means multiply of these items have to be in place for the crafting recipe to take place. 

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

### Smelting
To define a recipe for the furnace, you have to use `GameRegistry.addSmelting(input, output, exp);` as the smelting recipes are currently not JSON based.

### Special behaviour of the `data` tag
It is strongly advised to use the `data` tag to define the metadata of your items and blocks. Any item which uses `setHasSubtypes(true)` requires the use of the data field. When it is not used within the ingredients or keys, it will mean any metadata of this item will be accepted, for example: Not defining the data of a sword means even a half broken sword will be accepted for the crafting recipe!

Patterns
--------
A pattern will be defined with the `pattern` list. Each string represents one row in the crafting grid and each placeholder character within the String represents a column. As seen in the example above a space means that no item needs to be inserted at that position.

Keys
----
A key set is used in combination with patterns and contains keys whose name is the same as the placeholder character in the pattern list which it represents. One key may be defined to represent multiply items as it is the case for the wooden button. This means that the player can use one of the defined items for the crafting recipe, for example different types of wood.

```json
  "key": {
     "#": [
      {
        "item": "minecraft:planks",
         "data": 0
      },
      {
        "item": "minecraft:planks",
        "data": 1
      }
    ]
  }
```


Results
-------
Every `recipe` has to have a result tag to define the output item.

When crafting something, you can get out more than one item. This is achieved by defining the `count` number. If this is left out, meaning it doesn't exist within the result block, it defaults to 1. Negative values are not allowed here as an Itemstack cannot be smaller than 0. There is no option to use the `count` number anywhere else than for the result.
The `data` field is a optional and used to define the metadata of a block or item. It defaults to 0 when it doesn't exist.

!!! note

    Any item which uses `setHasSubtypes(true)` requires the data field. In this case, it is not optional!
    
Factories
---------
When programing, we speak of a factory as beeing an object to create another object. For more information, you may want to check [Wikipedia][Wikipedia]. To create your own factory, you have to create a `_factories.json`. Within this file a type has to be defined, for example: `recipes`,  `ingredients` or `conditions`. The basic rule is that each type will point to a class reference for example `IRecipeFactory `, `IIngredientFactory` or `IConditionFactory` with a known constructor and input method. At last a `name` which can be later used in your recipes and the fully qualified classname have to be specified which is a class you have to create which implements for example `IRecipeFactory` for a factory of the type `recipes`.

```json
{
    "<type>": {
        "<name>": "<fully qualified classname for the specified type>
    }
}
```

!!! note

    There is no need to create a new `_factories.json` for each type you want to specify.

Conditional recipes
-------------------
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
These conditions only apply to the recipe as a whole and not to ingredients. As an example, you might want to check if a mod is loaded using `forge:mod_loaded` and `"modid": "<mod to check>"`. 
!!! note

    Conditions will only be checked once at startup!
    
For ingredients, you have to specify a factory of the `ingredients` type and use `CraftingHelper.processConditions` to check if the conditions are met.

Constants
---------
It is possible to define constant values for your recipes. These values have to be defined within a `_constants.json` and can be used within any recipe of your mod by just writing `#<name>`. For filled buckets, you should use `fluid` instead of `data`.

```json
[
	{
		"name": "<name>",
		"ingredient": {
			"item": "<modid:item>",
			"data": <metadata>
		}
	}
]
```

[Wikipedia]: https://en.wikipedia.org/wiki/Factory_(object-oriented_programming)
[OreDictionary]: ../utilities/oredictionary.md
[Advancements]: #
[Wiki]: https://minecraft.gamepedia.com/Recipe
