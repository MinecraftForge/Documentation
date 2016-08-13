Introduction to Blockstate JSONs
================================

Blockstate JSONs tell the game which model it should use depending on the values of the block's [blockstate properties][blockstate].
A simple block with no properties only has a "*normal*" blockstate which is its default.
A more complex block that can be displayed in different ways has so called *variants*.

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

As you can see there is no normal state, only different variants depending on the value of "axis". Depending on which axis the log is aligned it will use either a model of the upright log, a model of the sideways log (rotated by 90° or not) or, should the block not have any axis set, it'll display the bark model which has the bark on all 6 sides.

The log only has one property: axis. A blockstate always has to be defined for all of its properties. In Minecraft 1.8's blockstate format, you have to specify the entire variant string, for each and every variant string. This leads to a very large number of variants, as each and every combination of properties must be defined. In order to keep this under control, Forge introduced its [own blockstate format][Forge blockstate], which is available in Minecraft 1.8 and up. Starting from Minecraft 1.9, Mojang also introduced the "multipart" format. You can find a definition of its format on the [wiki]. Forge's format and the multipart format are not better than each other, they each cover different use cases and it is your choice which one you want to use.

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
[Forge blockstate]: forgeBlockstates.md
[wiki]: http://minecraft.gamepedia.com/Model#Block_states
