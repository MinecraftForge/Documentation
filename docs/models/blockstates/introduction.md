Introduction to Blockstate JSONs
================================

Blockstate JSONs are Minecraft's way to map "variant strings" to models. A variant string can be absolutely anything, from "inventory" to "power=5" to "I am your father." They represent an actual model, where the blockstate is just a container for them. In code, a variant string within a blockstate JSON is represented by a `ModelResourceLocation`.

When the game searches for a model corresponding to a block in the world, it takes the [blockstate][] for that position, and then it uses an `IStateMapper` to find the corresponding `ModelResourceLocation` for it, which then refers to the actual model. The default `IStateMapper` uses the block's registry name as the location of the blockstate JSON. (E.g. block `examplemod:testblock` goes to the `ResourceLocation` `examplemod:testblock`.) The variant string is pieced together from the blockstate's properties. More information can be found [here][statemapper].

As an example, let's take a look at the vanilla `oak_log.json`:

```json
{
  "variants": {
    "axis=y":  { "model": "oak_log" },
    "axis=z":   { "model": "oak_log_side" },
    "axis=x":   { "model": "oak_log_side", "y": 90 },
    "axis=none":   { "model": "oak_bark" }
  }
}
```

Here we define 4 variant strings, and for each we use a certain model, either the upright log, the sideways log (rotated or not), and the all bark model (this model is not seen normally in vanilla; you have to use `/setblock` to create it). Since logs use the default `IStateMapper`, these variants will define the look of a log depending on the property `axis`.

A blockstate always has to be defined for all possible variant strings. When you have many properties, this results in lots of possible variants, as every combination of properties must be defined. In Minecraft 1.8's blockstate format, you have to define every string explicitly, which leads to long, complicated files. It also doesn't support the concept of submodels, or multiple models in the same blockstate. In order to allievate this, Forge introduced its [own blockstate format][Forge blockstate], which is available in Minecraft 1.8 and up.

Starting from Minecraft 1.9, Mojang also introduced the "multipart" format. You can find a definition of its format on the [wiki][]. Forge's format and the multipart format are not better than each other; they each cover different use cases and it is your choice which one you want to use.

!!! note
    The Forge format is really more like syntactic sugar for automatically calculating the set of all possible variants for you behind the scenes. This allows you to use the resulting `ModelResourceLocation`s for things other than blocks. ([Such as items][item blockstates]. This is also true of the 1.8 format, but there is almost no reason to use that format.) The 1.9 format is a more complicated system that depends on having an `IBlockState` to pick the model. It will not directly work in other contexts without some code around it.

For reference, here's an excerpt from the 1.8 blockstate for fences, `fence.json`:

```json
"east=true,north=false,south=false,west=false": { "model": "oak_fence_n", "y": 90, "uvlock": true }
```

This is just one variant out of 16. Even worse, there are 6 models for fences, one each for no connections, one connection, two connections in a straight line, two perpendicular connections, three connections, and one for all four connections.

Here's an excerpt from the same file in 1.9, which uses the multipart format:

```json
{ "when": { "east": "true" },
  "apply": { "model": "oak_fence_side", "y": 90, "uvlock": true }
}
```

This is one case of 5. You can read this as "when east=true, use the model oak_fence_side rotated 90 degrees". This allows the final model to be built up from 5 smaller parts, 4 of which (the connections) are conditional and the 5th being the unconditional central post. This uses only two models, one for the post, and one for the side connection.

[blockstate]: ../../blocks/states.md
[statemapper]: ../using.md#block-models
[Forge blockstate]: forgeBlockstates.md
[wiki]: https://minecraft.gamepedia.com/Model#Block_states
[item blockstates]: ../using.md#blockstate-jsons-for-items
