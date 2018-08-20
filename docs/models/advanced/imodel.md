`IModel`
========

`IModel` is a type that represents a model in its raw state. This is how a model is represented right after it has been loaded. Usually this directly represents the source of the model (e.g. an object deserialized from JSON, or an OBJ container).

At this high level, a model has no concept of items, blocks, or anything of that sort; it purely represents a shape.

!!! important
    `IModel` is immutable. Methods such as `process` that alter the model should never mutate the `IModel`, as they should construct new `IModel`s instead.

### `getDependencies`

This is a collection of the `ResourceLocation`s of all the models this model depends on. These models are guaranteed to be loaded before this one is baked. For example, a model deserialized from a blockstate JSON will depend on the models defined within. Only models that are directly mapped to a block/item are loaded normally; to ensure loading of other models, they must be declared as dependencies of another. Cyclic dependencies will cause a `LoaderException` to be thrown.

### `getTextures`

This is a collection of the `ResourceLocation`s of all the textures this model depends on. These textures are guaranteed to be loaded before this model is baked. For example, a vanilla JSON model depends on all the textures defined within.

### `bake`

This is the main method of `IModel`. It takes an [`IModelState`][IModelState], a `VertexFormat`, and a function `ResourceLocation` → `TextureAtlasSprite`, to return an [`IBakedModel`][IBakedModel]. `IBakedModel` is less abstract than `IModel`, and it is what interacts with blocks and items. The function `ResourceLocation → TextureAtlasSprite` is used to get textures from `ResourceLocation`s (i.e. the `ResourceLocation`s of textures are passed to this function and the returned `TextureAtlasSprite` contains the texture).

### `process`

This method allows a model to process extra data from external sources. The Forge blockstate variant format provides a way to define this data in the resource pack. Within the Forge blockstate format, the property that is used to pass this data is called `custom`. First, an example:

```json
{
  "forge_marker": 1,
  "defaults": {
    "custom": {
      "__comment": "These can be any JSON primitives with any names, but models should only use what they understand.",
      "meaningOfLife": 42,
      "showQuestion": false
    },
    "model": "examplemod:life_meaning"
  },
  "variants": {
    "dying": {
      "true": {
        "__comment": "Custom data is inherited. Therefore, here `meaningOfLife` is inherited but `showQuestion` is overriden. The model itself remains inherited.",
        "custom": {
          "showQuestion": true
        }
      },
      "false": {}
    }
  }
}
```

As seen above, custom data can be of any type. Additionally, it is inherited from the defaults into the variants. The custom data is passed in as an `ImmutableMap<String, String>`. This is a map where the keys are the property names (in the above example, "meaningOfLife", "showQuestion", and "title"). Astute observers may notice that numeric and boolean data were defined in within the blockstate but this method only receives `String`s. This is because all data is converted into strings before being processed. If a model does not understand what a property means, it should just ignore it.

### `smoothLighting`

In vanilla, smooth lighting enables ambient occlusion. This flag can be controlled by the `smooth_lighting` property in a Forge blockstate (which can appear wherever a `model` property can and is inherited). The default implementation does nothing.

### `gui3D`

`gui3D` controls whether a model looks "flat" in certain positions (e.g. with `gui3d` set to `true`, `EntityItem` renders a stack with multiple items as several layers of the model. With `gui3d` set to `false`, the item is always one layer), and also controls lighting inside GUIs. This flag can be controlled by the `gui3d` property in a Forge blockstate. The default implementation does nothing.

### `retexture`

This method is used to change the textures a model might use. This is similar to how texture variables in vanilla JSON models work. A model can start out with certain faces with certain textures, and then by setting/overriding texture variables these faces can be changed. An example:

```json
{
  "forge_marker": 1,
  "defaults": {
    "textures": {
      "varA": "examplemod:items/hgttg",
      "varB": "examplemod:blocks/earth",
      "varC": "#varA",
      "varZ": null
    },
    "model": "examplemod:universe"
  }
}
```

In this example, the `textures` block will be deserialized as-is into an `ImmutableMap` with the exception that `null`s are turned into `""` (i.e. the final result is `"varA" → "examplemod:items/hgttg", "varB" → "examplemod:blocks/earth", "varC" → "#varA", "varZ" → ""`). Then, `retexture` is called to change the textures as needed. How this is done is up to the model. It may be advisable, however, to support resolving texture variables such as "#var" (like vanilla JSON models) instead of taking them literally. The default implementation does nothing.

### `uvlock`

This method is used to toggle UV lock. UV lock means that when the model itself rotates, the textures applied to the model do not rotate with it. The default implementation does nothing. This can be controlled with the `uvlock` property in a Forge blockstate. An example:

```json
{
  "forge_marker": 1,
  "defaults": {
    "model": "minecraft:half_slab",
    "textures": {
      "__comment": "Texture definitions here..."
    }
  },
  "variants": {
    "a": [{ "__comment": "No change" }],
    "b": [{
      "__comment": "This is like literally taking the slab and flipping it upside down. The 'side' texture on the side faces is cropped to the bottom half and rotated 180 degrees, just as if a real object were turned upside down.",
      "x": 180
    }],
    "c": [{
      "__comment": "Now this is more interesting. The UV vertices are altered so that the texture won't rotate with the model, so that the side faces have the side texture rightside up and cropped to the top half.",
      "x": 180,
      "uvlock": true
    }]
  }
}
```

[IModelState]: imodelstate+part.md
[IBakedModel]: ibakedmodel.md
