Introduction to blockstate JSONs
================================

Blockstate JSONs tell the game which model it should use depending on the values of the block's [blockstate properties][blockstate].
A simple block with no properties only has a "*normal*" blockstate which is its default.
A more complex block that can be displayed in different ways has so called *variants*.

As an example, let's take a look at the vanilla `oak_log.json`:

```json
{
    "variants": {
        "axis=y":    { "model": "oak_log" },
        "axis=z":     { "model": "oak_log_side" },
        "axis=x":     { "model": "oak_log_side", "y": 90 },
        "axis=none":   { "model": "oak_bark" }
    }
}
```

As you can see there is no normal state, only different variants depending on the value of "axis". Depending on which axis the log is aligned it will use either a model of the upright log, a model of the sideways log (rotated by 90° or not) or, should the block not have any axis set, it'll display the bark model which has the bark on all 6 sides.

The log only has one property: axis. A blockstate always has to be defined for all of its properties. This can quickly lead to a combinatorial explosion of variants. Let's look at one variant of the vanilla fence:

```json
"east=false,north=false,south=false,west=false": { "model": "oak_fence_post" }
```

!!! Note
    The properties of a variant string of a blockstate should be dictionary ordered. For example, `"east=false,north=false,south=false,west=false"` is valid, while `"east=false,south=false,west=false,north=false"` is invalid. 

And that is only one variant of 16. This can quickly lead to very big and verbose blockstate files, and is one of the main problems in Minecraft 1.8. Minecraft 1.9 will introduce a system that allows to get this under control. [Forge's Blockstate Json][forge] allows you to do so in 1.8.

Customize state mappers
--------------------------------

In general, there are one-to-one relations between blockstates of a block and variant strings. However, in some cases, several properties should be ignored when considering block models, such as the growth of a cactus, and whether a block of leaves is decayable. Besides, some blocks have blockstates related to various blockstate json files, such as dirt blocks (`dirt.json`, `coarse_dirt.json`, and `podzol.json`) and sandstones (`sandstone.json`, `chiseled_sandstone.json`, and `smooth_sandstone.json`). When we want to map blockstates to variant strings manually, we need to customize our own state mappers. 

We register our state mappers on the pre-initialization stage like this. Do not forget that it is client side only: 

```java
ModelLoader.setCustomStateMapper(yourBlock, yourStateMapper);
```

As the second parameter, all of the state mappers are implementations of an interface, `IStateMapper`. One of the solutions is a subclass of a pre-defined abstract class, `StateMapperBase`. 

The abstract method to be implemented in `StateMapperBase`, `getModelResourceLocation`, provides a map from `IBlockState`, which represents blockstates, to `ModelResourceLocation`, which provides file names (before '#') and variant strings (after '#'). Method `getPropertyString` should be used to serialize properties. 

In addition, a builder called `StateMap.Builder` is generally used instead of our own implementation. an example of vanilla leaves is below: 

```java
                        // set the property ("variant") which decides the main part
                        // of file names ("oak", "spruce", "birch", and "jungle")
(new StateMap.Builder()).withName(BlockOldLeaf.VARIANT)
                        // set the suffix of file names ("oak_leaves.json", "spruce_leaves.json",
                        // "birch_leaves.json", and "jungle_leaves.json") to avoid conflicts
                        .withSuffix("_leaves")
                        // set the properties which should be ignored
                        // in the variant strings ("check_decay" and "decayable")
                        .ignore(new IProperty[] {BlockLeaves.CHECK_DECAY, BlockLeaves.DECAYABLE})
                        // build
                        .build();
```

Below is part of a map inferred from the state mapper: 

| `IBlockState`                                                        | `ModelResourceLocation`          |
|:---------------------------------------------------------------------|:---------------------------------|
| `minecraft:leaves[check_decay=true,decayable=true,variant=oak]`      | `minecraft:oak_leaves#normal`    |
| `minecraft:leaves[check_decay=true,decayable=true,variant=spruce]`   | `minecraft:spruce_leaves#normal` |
| `minecraft:leaves[check_decay=true,decayable=true,variant=birch]`    | `minecraft:birch_leaves#normal`  |
| `minecraft:leaves[check_decay=true,decayable=true,variant=jungle]`   | `minecraft:jungle_leaves#normal` |
| `minecraft:leaves[check_decay=true,decayable=false,variant=jungle]`  | `minecraft:jungle_leaves#normal` |
| `minecraft:leaves[check_decay=false,decayable=false,variant=jungle]` | `minecraft:jungle_leaves#normal` |

[forge]: forgeBlockstates.md "Forge's Blockstate JSON"
[blockstate]: states.md "blockstate properties"