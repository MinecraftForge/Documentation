OreDictionary
======

The OreDictionary exists primarily for inter-mod compatibility. 

By registering ores to the OreDictionary, mods make it possible to use the ores and ingots from another, similar mod in their recipes.

Despite its name, the OreDictionary is used for much more than ores. Any item that is similar to another item (for example, dyes) can be registered to and used with the OreDictionary.

## OreDictionary Name Convention

!!! note
    Unlike registry names, you do not want the OreDictionary name to be too unique. Follow these conventions for the most compatibility.
	
All OreDictionary names should be camelCase (compound words that begin with a lowercase letter, where each successive word begins with a capital letter). Avoid spaces or underscores.

The first word in the OreDictionary name indicates the type of item. For unique items (such as `record`, `dirt`, `egg`, and `vine`), one word is specific enough.

The last part of the name indicates the material of the item -- for example, `Wood` or `Iron`.

When two words are not specific enough, a third word can be added. For instance, brick is registered as `ingotBrick` while nether brick is registered as `ingotBrickNether`.

See [Common OreDictionary Names](#common-oredictionary-names) for a list of commonly used prefixes and suffixes.

## WILDCARD_VALUE

This value is used to indicate that the metadata of an `ItemStack` is not important. See below for an example of its use.

As of MinecraftForge for 1.5, `WILDCARD_VALUE` is 32767. The javadoc encourages using `WILDCARD_VALUE` instead of hardcoding its expected value, in case it changes again.

## Using OreDictionary in Crafting Recipes

Recipes that use the OreDictionary are created and registered much the same way as regular crafting recipes. The main difference is the use of a `String` to define the OreDictionary `ItemStack` to accept.

For example, the following code will register a shapeless recipe that combines a glass bottle, diamond, and lime dye to make a Bottle O' Enchanting:

```java
GameRegistry.addShapelessRecipe(new ItemStack(Items.EXPERIENCE_BOTTLE), Items.DIAMOND, new ItemStack(Items.DYE, 1, 10));
```

Converting this recipe to accept any other diamonds or lime dye in the OreDictionary requires an instance of a `ShapelessOreRecipe` or `ShapedOreRecipe`:

```java
ShapelessOreRecipe recipe = new ShapelessOreRecipe(new ItemStack(Items.EXPERIENCE_BOTTLE), "gemDiamond", "dyeLime");
GameRegistry.addRecipe(recipe);
```

Another use of the OreDictionary in crafting is the [WILDCARD_VALUE](#wildcard_value). Registering a crafting recipe with an `ItemStack` that has `OreDictionary.WILDCARD_VALUE` as the metadata value will cause it to be less strict about item damage.

For example, the following code will use any damaged stone axe and a diamond to craft a non-damaged stone axe:

```java
GameRegistry.addShapelessRecipe(new ItemStack(Items.STONE_AXE, 1, 0), new ItemStack(Items.STONE_AXE, 1, OreDictionary.WILDCARD_VALUE), Items.DIAMOND);
```

## Registering Items to the OreDictionary

Add entries to the OreDictionary during the `FMLPreInitializationEvent` phase, after initializing the blocks and items that you will register.

Simply call `OreDictionary.registerOre(ItemStack stack, String name)` with an `ItemStack` containing your item or block and its metadata value to register it to the OreDictionary.

You can also call one of the overloads of `OreDictionary.registerOre` that takes a `Block` or `Item` to avoid creating the `ItemStack` yourself.

See [OreDictionary Name Convention](#oredictionary-name-convention) for tips on formatting the OreDictionary name of the `ItemStack`.

## Common OreDictionary Names

All OreDictionary names for Minecraft items and blocks can be found in `net.minecraftforge.oredict.OreDictionary`. A full list will not be included here.

Common prefixes already used in the OreDictionary include `ore`, `ingot`, `nugget`, `dust`, `gem`, `dye`, `block`, `stone`, `crop`, `slab`, `stair`, and `pane`.

Common prefixes for modded items include `gear`, `rod`, `stick`, `plate`, `dustTiny`, and `cover`. 

Common suffixes in the OreDictionary include `Wood`, `Glass`, `Iron`, `Gold`, `Leaves`, and `Brick`. 

Common suffixes for modded items include the names of metals (`Copper`, `Aluminum`, `Lead`, `Steel`, etc.) and subtypes of items.
