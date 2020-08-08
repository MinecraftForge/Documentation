Biomes
======

Biomes are different regions that appear around the world. They have their
own structures, world generation features, mob spawning, and colors.
Forge provides several hooks and compatibility features to allow mods to
modify existing biomes and to add their own custom biomes.

Making a new Biome
------------------

A new Biome will usually use a subclass of Biome. Think `PlainsBiome`,
`GravellyMountainsBiome`, `BadlandsBiome`, or `ForestBiome`. There are
five main things to consider when making a new Biome: Properties, 
Structures, Features, Mob Spawning, and Biome Dictionary Types.
Biome properties are mandatory, everything else is optional.