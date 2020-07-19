Recipes
=======

With the update to Minecraft 1.12, Mojang introduced a new data-driven recipe system based on JSON files. Since then it has been adopted by Forge as well and was expanded in Minecraft 1.13 into [datapacks][datapack].

Loading Recipes
---------------
Forge will load all recipes which can be found within the `./data/<modid>/recipes/` folder. You can call these files whatever you want, thought the vanilla convention is to name them after the output item. For multiple recipes from different sources (Smelting, Crafting, etc) one vanilla convention is to use `item_name_from_smelting.json`. This name is also used as the registration key, but does not affect the operation of the recipe.

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
            "item": "mymod:myfirstitem",
        }
    },
    "result":
    {
        "item": "mymod:myitem",
        "count": 9,
    }
}
```

!!! note

    When you first obtain an ingredient to a vanilla recipe it will automatically unlock the recipe in the recipe book. To achieve the same effect, you have to use the [`Advancement`][Advancements] system and create a new `Advancement` for each of your ingredients.

    The advancement has to exist. This doesn't mean it has to be visible in the advancement tree.

### Type

The type of a recipe with the type field. You can think of this as the definition of which crafting layout is to be used, for example `minecraft:crafting_shaped` or `minecraft:crafting_shapeless`.

### Groups

Optionally you can add a group to your recipes to be displayed within the recipe helper interface. All recipes with the same group String will be shown in the same group. For example, this can be used to have all door recipes shown in the recipe helper interface as a single entry, even though there are different types of doors.

Types of crafting recipes
-----------------------------
Within this section we will take a closer look on the differences between defining a shaped and a shapeless crafting recipe.

### Shaped crafting

Shaped recipes require the `pattern` and `key` keywords. A pattern defines the slot an item must appear in using placeholder characters. You can choose whatever character you want to be a placeholder for an item. Keys on the other hand define what items are to be used instead of the placeholders. A key is defined by a placeholder character and the item.

### Shapeless crafting

A shapeless recipe doesn't make use of the `pattern` and `key` keywords.

To define a shapeless recipe, you have to use the `ingredients` list. It defines which items have to be used for the crafting process. There are [many more][Wiki] of these types which can be used here and you can even register your own. It is even possible to define multiple instances of the same item which means multiple of these items have to be in place for the crafting recipe to take place.

!!! note

    While there is no limit on how many ingredients your recipe requires the vanilla crafting table does only allow 9 items to be placed for each crafting recipe.

The following example shows how an ingredient list looks like within JSON.

```json
    "ingredients": [
        {
            "tag": "forge:gems/diamond"
        },
        {
            "item": "minecraft:nether_star"
        }
    ],
```

Recipe Elements
---------------

### Patterns

A pattern will be defined with the `pattern` list. Each string represents one row in the crafting grid and each placeholder character within the String represents a column. As seen in the example above a space means that no item needs to be inserted at that position.

### Keys

A key set is used in combination with patterns and contains keys whose name is the same as the placeholder character in the pattern list which it represents. One key may be defined to represent multiply items as it is the case for the wooden button. This means that the player can use one of the defined items for the crafting recipe, for example different types of wood.

```json
  "key": {
     "#": [
      {
        "item": "minecraft:oak_planks"
      },
      {
        "item": "minecraft:spruce_planks"
      }
    ]
  }
```

### Results

Every `recipe` has to have a result tag to define the output item.

When crafting something, you can get out more than one item. This is achieved by defining the `count` number. If this is left out, meaning it doesn't exist within the result block, it defaults to 1. Negative values are not allowed here as an Itemstack cannot be smaller than 0. There is no option to use the `count` number anywhere else than for the result.

[Wikipedia]: https://en.wikipedia.org/wiki/Factory_(object-oriented_programming)
[OreDictionary]: ../utilities/oredictionary.md
[Advancements]: #
[Wiki]: https://minecraft.gamepedia.com/Recipe
[Factories]: #factories
[datapack]: datapacks.md
