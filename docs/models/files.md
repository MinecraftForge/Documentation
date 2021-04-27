Model Files
===========

A "model" is simply a shape. It can be a simple cube, it can be several cubes, it can be a truncated icosidodecahedron, or anything in between. Most models you'll see will be in the vanilla JSON format. Models in other formats are loaded into `IModelGeometry`s by an `IModelLoader` at runtime. Forge provides default implementations for WaveFront OBJ files, buckets, composite models, models in different render layers, and a reimplementation of Vanilla's `builtin/generated` item model. Most things do not care about what loaded the model or what format it's in as they are all eventually represented by an `IBakedModel` in code.

When `ResourceLocation` refers to a model, the path is normally relative to `models` (e.g. `examplemod:block/block` → `assets/examplemod/models/block/block.json`).

Block and item models differ in a few ways, the major one being [item property overrides][overrides].

Textures
--------

Textures, like models, are contained within resource packs and are referred to with `ResourceLocation`s. When `ResourceLocation`s refer to textures in models, the paths are taken to be relative to `textures/` (e.g. `examplemod:block/test` → `assets/examplemod/textures/block/test.png`). Additionally, in Minecraft, the [UV coordinates][uv] (0,0) are taken to mean the **top-left** corner. UVs are *always* from 0 to 16. If a texture is larger or smaller, the coordinates are scaled to fit. A texture should also be square, and the side length of a texture should be a power of two, as doing otherwise breaks mipmapping (e.g. 1x1, 2x2, 8x8, 16x16, and 128x128 are good. 5x5 and 30x30 are not recommended because they are not powers of 2. 5x10 and 4x8 are completely broken as they are not square.). If there is an `mcmeta` file associated with the texture, and an animation is defined, the image can be rectangular and is interpreted as a vertical sequence of square regions from top to bottom, where each square is a frame of the animation.

JSON Models
-----------

Vanilla Minecraft's JSON model format is rather simple. It defines cuboid (cube/rectangular prism) elements and assigns textures to their faces. On the [wiki][], there is a definition of its format.

!!! note
    JSON models only support cuboid elements; there is no way to express a triangular wedge or anything like it. To have more complicated models, another format must be used.

When a `ResourceLocation` refers to the location of a JSON model, it is not suffixed with `.json`, unlike OBJ models (e.g. `minecraft:block/cube_all`, not `minecraft:block/cube_all.json`).

WaveFront OBJ Models
--------------------

Forge adds a loader for the `.obj` file format. To use these models, the JSON must reference the `forge:obj` loader. This loader accepts any model location that is in a registered namespace and whose path ends in `.obj`. The `.mtl` file should be placed in the same location with the same name as the `.obj` to be used automatically. The `.mtl` file will probably have to be manually edited to change the paths pointing to textures defined within the JSON. Additionally, the V axis for textures may be flipped depending on the external program that created the model (i.e. V = 0 may be the bottom edge, not the top). This may be rectified in the modelling program itself or done in the model JSON like so:

```json
{
  "__comment": "Add the following line on the same level as a 'model' declaration.",
  "loader": "forge:obj",
  "flip-v": true,
  "model": "examplemod:models/block/model.obj",
  "textures": {
    "_comment": "Can refer to in .mtl using #texture0",
    "texture0": "minecraft:block/dirt",
    "particle": "minecraft:block/dirt"
  }
}
```

[statejson]: blockstates/introduction.md
[overrides]: overrides.md
[uv]: https://en.wikipedia.org/wiki/UV_mapping
[wiki]: https://minecraft.gamepedia.com/Model#Block_models
