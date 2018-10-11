OreDictionary
=============

The OreDictionary exists primarily for inter-mod compatibility.

Items that are registered to the OreDictionary become interchangeable with other items that have the same OreDictionary name. This allows recipes to use either item to produce the same result.

Despite its name, the OreDictionary is used for much more than ores. Any item that is similar to another item (for example, dyes) can be registered to and used with the OreDictionary.

OreDictionary Name Convention
-----------------------------

!!! note
    Because OreDictionary names are meant to be shared between items from different mods, they should be fairly general. Use a name that other mods are likely to use.

Forge does not require names to be in any particular format, but the following has become a popular standard for OreDictionary names:

The entire OreDictionary name typically uses camelCase (compound words that begin with a lowercase letter, where each successive word begins with a capital letter) and avoids spaces or underscores.

The first word in the OreDictionary name indicates the type of item. For unique items (such as `record`, `dirt`, `egg`, and `vine`), one word is specific enough.

The last part of the name indicates the material of the item. This differentiates between `ingotIron` and `ingotGold`, for example.

When two words are not specific enough, a third word can be added. For instance, granite is registered as `blockGranite` while polished granite is registered as `blockGranitePolished`.

See [Common OreDictionary Names](#common-oredictionary-names) for a list of commonly used prefixes and suffixes.

WILDCARD_VALUE
--------------

This value is used to indicate that the metadata of an `ItemStack` is not important. See [below](#using-oredictionary-in-crafting-recipes) for an example of its use.

Using OreDictionary in Crafting Recipes
---------------------------------------

Recipes that use the OreDictionary are created and registered in much the same way as regular crafting recipes. The main difference is the use of an OreDictionary name instead of a specific `Item` or `ItemStack`.

To make a recipe that can use OreDictionary entries, create an ingredient with `type` of `forge:ore_dict` in your recipe json, and specify the ore dictionary entry name in `ore` field:

```json
{
    "type": "forge:ore_dict",
    "ore": "ingotIron"
}
```

More information about recipe json may be found [here](recipes.md).

Another use of the OreDictionary in crafting is the [WILDCARD_VALUE](#wildcard_value). Use by passing `32767` into `data` field of a regular item ingredient:

```json
{
    "item": "minecraft:wool",
    "data": 32767
}
```

!!! note
    The constant `OreDictionary.WILDCARD_VALUE` (`32767`) should only be used for the recipe input. Using `WILDCARD_VALUE` in the recipe output will only hardcode the damage of the output `ItemStack`.

Registering Items to the OreDictionary
--------------------------------------

Add entries to the OreDictionary during the `FMLPreInitializationEvent` phase, after initializing the blocks and items that you will register.

Simply call `OreDictionary.registerOre(ItemStack stack, String name)` with an `ItemStack` containing your item or block and its metadata value to register it to the OreDictionary.

You can also call one of the overloads of `OreDictionary.registerOre` that take a `Block` or `Item` to avoid creating the `ItemStack` yourself.

See [OreDictionary Name Convention](#oredictionary-name-convention) for tips on formatting the OreDictionary name of the `ItemStack`.

Common OreDictionary Names
--------------------------

All OreDictionary names for Minecraft items and blocks can be found in `net.minecraftforge.oredict.OreDictionary`. A full list will not be included here.

Common prefixes already used in the OreDictionary include `ore`, `ingot`, `nugget`, `dust`, `gem`, `dye`, `block`, `stone`, `crop`, `slab`, `stair`, and `pane`.

Common prefixes for modded items include `gear`, `rod`, `stick`, `plate`, `dustTiny`, and `cover`.

Common suffixes in the OreDictionary include `Wood`, `Glass`, `Iron`, `Gold`, `Leaves`, and `Brick`.

Common suffixes for modded items include the names of metals (`Copper`, `Aluminum`, `Lead`, `Steel`, etc.) and other modded materials.
