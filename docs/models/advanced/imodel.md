`IModel`
========

`IModel` is a type that represents a model in its raw state. This is how a model is represented right after it has been loaded. Usually this directly represents the source of the model (e.g. an object deserialized from JSON, or an OBJ container). It also defines some important methods.

If an `IModel` also implements certain subinterfaces of `IModel`, it can also process some extra information. External entities using the model can do this processing through the static helpers in `ModelProcessingHelper`.

At this high level, a model has no concept of items, blocks, or anything of that sort; it purely represents a shape.

!!! important
    `IModel` is immutable. Methods such as `IModelCustomData::process` that alter the model should never modify the `IModel`, as they should construct new `IModel`s instead.

### `getDependencies`

This is a collection of the `ResourceLocation`s of all the models this model depends on. These models are guaranteed to be loaded before this one is baked. For example, a model deserialized from a blockstate JSON will depend on the models defined within. Only models that are directly mapped to a block/item are loaded normally; to ensure loading of other models, they must be declared as dependencies of another. Cyclic dependencies will cause a `LoaderException` to be thrown.

### `getTextures`

This is a collection of the `ResourceLocation`s of all the textures this model depends on. These textures are guaranteed to be loaded before this model is baked. For example, a vanilla JSON model depends on all the textures defined within.

### `bake`

This is the main method of `IModel`. It takes an `IModelState`, a `VertexFormat`, and a function `ResourceLocation` → `TextureAtlasSprite`, to return an `IBakedModel`. `IBakedModel` is lower-level than `IModel`, and it is what interacts with blocks and items. The function RL → TAS is used to get textures from RLs (i.e. the RLs of textures are passed to this function and the returned TAS contains the texture).

`IAnimatedModel`
----------------

`IAnimatedModel` is part of the currently WIP animation API. Right now it does nothing.

`IModelCustomData`
------------------

`IModelCustomData` allows a model to process extra data from external sources. The Forge blockstate variant format provides a way to define this data in the resource pack. Within the Forge blockstate format, the property that is used to pass this data is called `custom`. First, an example:

```json
{
  "forge_marker": 1,
  "defaults": {
    "custom": {
      "__comment": "These can be any JSON primitives with any names, but models should only use what they understand.",
      "meaningOfLife": 42,
      "showQuestion": false
    },
    "__comment": "This model will receive the data in custom iff it is an `ICustomModelData`.",
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
    },
    "book": {
      "true": {
        "submodel": {
          "custom": {
            "__comment": "This works anywhere where a `model` property could be. This includes here, in a submodel.",
            "title": "The Hitcherhiker's Guide to the Galaxy"
          },
          "model": "examplemod:book"
        }
      },
      "false": {}
    }
  }
}
```

This is fairly self-explanatory. In essence, custom data is just that, custom data that gets processed by the model itself. As seen above, custom data can be of any type. Additionally, it is inherited from the defaults into the variants. Finally, custom data will only be passed to the model if the model is a `IModelCustomData` and implementers of that interface should ignore data they don't understand.

### `process`

This is the core of `IModelCustomData`. The custom data is passed in as an `ImmutableMap<String, String>`. This is a map where the keys are the property names (in the above example, "meaningOfLife", "showQuestion", and "title"). Astute observers may notice that numeric and boolean data were defined in within the blockstate but this method only receives `String`s. This is because all data is converted into strings before being processed. If a model does not understand what a property means, it should just ignore it.

This method returns an `IModel` with the changes contained in the custom data.

`IModelSimpleProperties`
------------------------

Models implementing `IModelSimpleProperties` support two simple properties, smooth lighting and gui3D. In vanilla, smooth lighting is called ambient occlusion. Gui3D controls whether a model looks "flat" in certain positions (e.g. with gui3d set to `true`, `EntityItem` renders a stack with multiple items as several layers of the model. With gui3d set to `false`, the item is always one layer), and also controls lighting inside GUIs. These flags can be controlled by the `smooth_lighting` and `gui3d` properties in a Forge blockstate variant. Here's an example:

```json
{
  "forge_marker": 1,
  "defaults": {
    "__comment": "The lighting is smooth, but inside GUIs OpenGL lighting is disabled, and the item looks 'flat' in certain contexts.",
    "smooth_lighting": true,
    "gui3d": false,
    "__comment": "The model receives these parameters iff it is an `IModelSimpleProperties`",
    "model": "examplemod:book"
  },
  "variants": {
    "magical": {
      "true": {
        "__comment": "This works anywhere where a `model` property could be.",
        "gui3d": true
      },
      "false": {}
    }
  }
}
```

This is fairly self-explanatory. The two parameters get passed into the `IModelSimpleProperties` by calling the respective methods.

`IRetexturableModel`
--------------------

`IRetextureableModel` represents a model whose textures can be changed. This is similar to how texture variables in vanilla JSON models work. A model can start out with certain faces with certain textures, and then by setting/overriding texture variables these faces can be changed. An example:

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
    "__comment": "The texture variables apply iff this is an `IRetextureableModel`.",
    "model": "examplemod:universe"
  }
}
```

In this example, the `textures` block will be deserialized as-is into an `ImmutableMap` with the exception that `null`s are turned into `""` (i.e. the final result is `"varA" → "examplemod:items/hgttg", "varB" → "examplemod:blocks/earth", "varC" → "#varA", "varZ" → ""`). Then, if the model is an `IRetexturableModel`, `retexture` is called to change the textures as needed. How this is done is up to the model. It may be advisable, however, to support resolving texture variables such as "#var" (like vanilla JSON models) instead of taking them literally.

`IModelUVLock`
--------------

`IModelUVLock` represents a model that can toggle UV lock through the `uvlock` method. UV lock means that when the model itself rotates, the textures applied to the model do not rotate with it. This can be controlled with the `uvlock` property in blockstate JSONs. An example:

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
