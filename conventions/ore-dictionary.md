# Ore Dictionary Naming

The Ore Dictionary is a feature of Forge that allows equivalency for different ItemStacks
based on names, such as "ingotIron". It's main use is crafting recipes, but it's good for
a lot of other cool dynamics behaviors too. We'll only be covering crafting, as it's
simpler.

**Remember**: the Ore Dictionary isn't just for ores, that's just what it was originally
made for. It is a generic ItemStack equivalency system, and can be useful for any number
of things.

## Construction

An ore dictionary name consists of a group and a type. The well-known groups are:

 - 'ingot', for any  ingot
 - 'block', for any block
 - 'gem', for any gem
 - 'dust', for any dust versions of ingots
 - 'nugget', for any 1/9 piece of an ingot

Forge also maps some vanilla blocks to Ore Dictionary names by default. These are:

 - 'logWood', 'plankWood', 'slabWood', 'stairWood', 'stickWood'
 - 'treeSapling', 'treeLeaves'
 - 'oreGold', 'oreIron', 'oreLapis', 'oreDiamond', 'oreRedstone', 'oreEmerald', 'oreQuartz', 'oreCoal'
 - 'blockGold', 'blockIron', 'blockLapis', 'blockDiamond', 'blockRedstone', 'blockEmerald', 'blockQuartz', 'blockCoal'
 - 'blockGlassColorless' (non-stained glass)
 - 'blockGlass' (glass, including stained)
 - 'paneGlassColorless' (non-stained glass panes)
 - 'paneGlass' (glass panes, including stained)
 - 'ingotIron', 'ingotGold', 'ingotBrick', 'ingotBrickNether'
 - 'nuggetGold'
 - 'gemDiamond', 'gemEmerald', 'gemQuartz', 'gemLapis'
 - 'dustRedstone', 'dustGlowstone'
 - 'slimeball'
 - 'glowstone'
 - 'cropWheat', 'cropPotato', 'cropCarrot'
 - 'stone', 'cobblestone'
 - 'sand'
 - 'dye' (any dye of any color)
 - 'record' (any record with any music)
 - 'chest' (ender, trapped, and normal chests)
 - 'chestWood', 'chestEnder', 'chestTrapped'
 - 'dyeBlack', 'dyeRed', 'dyeGreen', 'dyeBrown', 'dyeBlue', 'dyePurple', 'dyeCyan', 'dyeLightGray', 'dyeGray'
   'dyePink', 'dyeLime', 'dyeYellow', 'dyeLightBlue', 'dyeMagenta', 'dyeOrange', 'dyeWhite'

Some unofficial extensions that may or may not be present:

 - 'gemNetherStar', 'blockNetherStar'
 - 'gemEnderPearl', 'dustEnderPearl', 'blockEnderPearl'

If you add wood, sticks, a new crop, dyes, records, etc, it is strongly encouraged to give them relevant ore dictionary names.
For example, if you add a new tree, let's say cypress, then you would add it's logs to logWood, it's planks to plankWood, slabs
to slabWood, stairs to stairWood, and it would probably craft into normal sticks, but if not, it's sticks into stickWood.

It's sapling would also go under treeSapling, and it's leaves under treeLeaves.

// TODO