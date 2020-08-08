Biome Properties
================

The `Biome.Builder` class
-------------------------

Like blocks and items, different biomes have different properties. To
specify properties for your Biome, create a new instance of `Biome.Builder`.
Unlike blocks and items, multiple properties are mandatory. There will
be a simple list below describing each property in the order that you 
should specify them and their purpose in the game.

| Required Properties | Type | Description |
|----------------:|:---------------------------:|:---------------:|
|`surfaceBuilder` |`ConfiguredSurfaceBuilder<?>`|Determines which block to use for the surface layer. The `SurfaceBuilder` class has static instances for ConfiguredSurfaceBuilders commonly used in Vanilla Biomes. |
|`precipitation`  |      `Biome.RainType`       |Determines how weather appears in this biome. Think of how rain doesn't appear in desert biomes or how snow appears in the mountains.|
|`category`       |      `Biome.Category`       |Determines what type of biome this is. Certain biome types have special behavior.|
|`depth`          |          `float`            |Used in world generation and maps.|
|`scale`          |          `float`            |Another float with a use in world generation similar to `depth`.|
|`temperature`    |          `float`            |Determines foliage, grass, sky color, and certain other behaviors in the game. Choose this value based on the temperature of your biome relative to other biomes.|
|`downfall`       |          `float`            |Has a purpose similar to `temperature`.|
|`field_235096_j_`|          `BiomeAmbience`    |Determines biome sounds, music, water color, fog color, and biome particles.|

| Optional Properties | Type |   Description   |
|----------------:|:---------------------------:|:---------------:|
|`parent`         | `String`                    |The registry name of the "parent" biome. Used for mutations of normal biomes, such as the Flower Forest biome.|
|`field_235095_i_`| `List<Biome.Attributes>`    |Determines the spawning behaviour of this biome when used with the NetherBiomeProvider.|

SurfaceBuilder
--------------
Surface builders are used to decorate the surface of the terrain. 
Most biomes use the default surface builder, but more unique biomes
like the Swamp and the Mega Taiga have custom surface builders.
When making a new type of surface builder, [you must register it][registering].

Precipitation
-------------
The precipitation of a biome determines how weather appears when it is raining in the world.
- `RainType.NONE` - No particles will appear when it is raining.
- `RainType.RAIN` - Rain will appear as normal when it is raining and snow will appear above y=128.
- `RainType.SNOW` - Snow will appear instead of rain at all y levels when it is raining. 
                    Rabbits will spawn as snowy variants.

Category
--------
Biome categories are used to group different biomes that have similarities together.
Not all categories have special traits in vanilla. Ones that do are listed here:
- `Category.NONE` - This biome is not considered similar to any other biome in the game.
                    Used by Stone Beach and The Void.
- `Category.JUNGLE` - This biome will use the `JUNGLE_EDGE` biome as its "shore" biome in `ShoreLayer`.
- `Category.OCEAN` - Ocean music will play in this biome and normal creative/survival music does not play in this biome.
                     If another biome tries to generate an `OceanMonumentStructure` that spills into this biome,
                     then this biome is a valid spawning location for that `OceanMonumentStructure`.
- `Category.DESERT` - Rabbits will spawn as dessert variants.
- `Category.RIVER` - Same as `Category.OCEAN` and mob spawns have a 2% chance to not spawn.
- `Category.MUSHROOM` - Pillager patrols and village sieges will not appear in this biome.

Other biome categories have no special behavior.

Outside of biome properties, it is recommended to
use `BiomeDictionary.Type` instead of `Biome.Category` whenever possible.

Depth and Scale
---------------
Depth and Scale are values used to determine what kind of terrain this biome will have.
You can see how these values are used in `NoiseChunkGenerator`. Higher values tend to create
hillier and taller terrain. The Plains biome has a depth of `0.125f` and a scale of `0.05f`.

Temperature and Downfall
------------------------
Temperature and Downfall are values used to determine several colors of this biome,
including grass color, foliage color (leaves and tall grass), 
and the `TempCategory` temperature category.

Biome Ambience
--------------
Biome Ambience determines special effects and sounds for the biome.
Here are the properties of Biome Ambience:
- `fogColor` - The biome fog color if the dimension has fog enabled. Think Nether biomes
- `waterColor` - The color of water in this biome. Think different ocean biomes or the swamp biomes.
- `waterFogColor` - The color of the fog that appears when the player swims underwater.
- `particle` - The particle effects that appear in this biome. Think Basalt Deltas.
- `ambientSound` - The ambient sound effect that plays in this biome.
- `moodSound` - The sound that plays in dark areas. Think cave sounds.
- `additionsSound` - An additional biome sound that plays randomly.
- `music` - A unique music track for this biome. Only used by nether biomes so far.

Biome Attributes
----------------
Biome Attributes are float values that are used in `NetherBiomeProvider`
for picking biome locations. Typically, a biome will only use a single instance
of `BiomeAttributes` but it is safe to use multiple instances. It is not mandatory
to set BiomeAttributes for your biome but it is recommended for data-driven dimensions.

Parent Biomes
-------------
Parent biomes are specified in Mutation biomes. Mutation biomes are biomes like the
Flower Forest and Modified Jungle Edge. It is also used in the `HillsLayer` during world generation.
The parent string is parsed the same as a normal `ResourceLocation`.

[registering]: ../concepts/registries.md#registering-things