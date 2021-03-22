Introduction to Blockstate JSONs
================================

Blockstate JSONs are Minecraft's way to map "variant strings" to models. A variant string can be absolutely anything, from "inventory" to "power=5" to "I am your father." They represent an actual model, where the blockstate is just a container for them. In code, a variant string within a blockstate JSON is represented by a `ModelResourceLocation`.

When the game searches for a model corresponding to a block in the world, it takes the [blockstate][] for that position, and then it uses a map within `ModelManager` to find the corresponding `ModelResourceLocation` for it, which then refers to the actual model. `BlockModelShapes` uses the block's registry name as the location of the blockstate JSON. (E.g. block `examplemod:testblock` goes to the `ResourceLocation` `examplemod:testblock`.) The variant string is pieced together from the blockstate's properties.

As an example, let's take a look at the vanilla `oak_log.json`:

```json
{
    "variants": {
        "axis=y":    { "model": "block/oak_log" },
        "axis=z":    { "model": "block/oak_log", "x": 90 },
        "axis=x":    { "model": "block/oak_log", "x": 90, "y": 90 }
    }
}
```

Here we define 3 variant strings, and for each we use a certain model, either the upright log and the sideways log (rotated in the y direction or not). These variants will define the look of a log depending on the property `axis`.

A variant should be defined for every property that invokes a change in the model displayed. Any property not specified in the JSON will not have any bearing to determine the current model (e.g. `waterlogged` has no effect on how a model might look).

Each blockstate can be specified using one of two methods: variants and multiparts. A variant defines an associated array of states which point to the associated model to render. Note that every single property that changes the model must be defined (e.g. If 4 properties defines how the model looks, then 2 ^ 4 = 16 variants must be defined). Multiparts, on the other hand, use conditions to display a certain model when true (e.g. If a model is only shown when `north` was true, then when that case occurs, the model will display along with any other models whose conditions are met).

For a better understanding of multiparts, let's look at a variant built fence connection:

```json
"east=true,north=false,south=false,west=false": { "model": "oak_fence_n", "y": 90, "uvlock": true }
```

This represents one variant out of 16 possible states. Even worse, there must be models that can uniquely define unique states (a state that can be rotated to become another state is not unique for this purpose). For fences, there are 6 models: one for no connections, one connection, two connections in a straight line, two perpendicular connections, three connections, and one for all four connections.

Now let's view a modern day multipart built fence connection:

```json
{ "when": { "east": "true" },
  "apply": { "model": "oak_fence_side", "y": 90, "uvlock": true }
}
```

In this case, the JSON defines that if the east connector is true, then show the model `oak_fence_side` rotated 90 degrees. This allows the model to be broken up in only two files: the base post and the connection. It can also be represented as 5 statements, one that checks for each of the states is true and one that applies the base post unconditionally.

You can find more explanations and examples of these formats on the [wiki][].

[blockstate]: ../../blocks/states.md
[wiki]: https://minecraft.gamepedia.com/Model#Block_states
