Model Files
===========

A "model" is simply a shape. It can be a simple cube, it can be several cubes, it can be a truncated icosidodecahedron, or anything in between. Most models you'll see will be in the vanilla JSON format. Models in other formats are loaded into `IModel`s by an `ICustomModelLoader` at runtime. Forge provides default implementations for WaveFront OBJ files and Blitz3D files. Most things do not care about what loaded the model or what format it's in as they all implement a common interface, `IModel`, in code.

When `ResourceLocation` refers to a model, the path is normally relative to `models` (e.g. `examplemod:block/block` → `assets/examplemod/models/block/block`). A notable exception is within a [blockstate JSON][] (all 3 formats), where model paths are relative to `models/block` (e.g. `examplemod:block` → `assets/examplemod/models/block/block`).

Block and item models differ in a few ways, the major one being [item property overrides][overrides].

Textures
--------

Textures, like models, are contained within resource packs and are referred to with `ResourceLocation`s. When `ResourceLocation`s refer to textures in models, the paths are taken to be relative to `textures/` (e.g. `examplemod:blocks/test` → `assets/examplemod/textures/blocks/test.png`). Additionally, in Minecraft, the [UV coordinates][UV] (0,0) are taken to mean the **top-left** corner. UVs are *always* from 0 to 16. If a texture is larger or smaller, the coordinates are scaled to fit. A texture must also be square, and the side length of a texture should be a power of two, as doing otherwise breaks mipmapping. (E.g. 1x1, 2x2, 8x8, 16x16, and 128x128 are good. 5x5 and 30x30 are not recommended because they are not powers of 2. 5x10 and 4x8 are completely broken as they are not square.) If there is an `mcmeta` file associated with the texture, and an animation is defined, the image can be rectangular and is interpreted as a vertical sequence of square regions from top to bottom, where each square is a frame of the animation.

JSON Models
-----------

Vanilla Minecraft's JSON model format is rather simple. It defines cuboid (cube/rectangular prism) elements, and assigns textures to their faces. On the [wiki][JSON model format], there is a definition of its format.

!!! note
    JSON models only support cuboid elements; there is no way to express a triangular wedge or anything like it. To have more complicated models, another format must be used.

When a `ResourceLocation` refers to the location of a JSON model, it is not suffixed with `.json`, unlike OBJ and B3D models (e.g. `minecraft:block/cube_all`, not `minecraft:block/cube_all.json`).

WaveFront OBJ Models
--------------------

Forge adds a loader for the `.obj` file format. To use these models, the resource namespace must be registered through `OBJLoader.addDomain`. This loader accepts any model location that is in a registered namespace and whose path ends in `.obj`. The `.mtl` file should be placed next to the `.obj` and will automatically be used with the `.obj`. The `.mtl` file will probably have to be manually edited to change the paths pointing to textures into Minecraft `ResourceLocation`s. Additinally, the V axis for textures may be flipped depending on the external program that created the model (i.e. V = 0 may be the bottom edge, not the top). This may be rectified in the modelling program itself or done in a Forge blockstate JSON like so:

```json
{
  "__comment": "Add the following line on the same level as a 'model' declaration.",
  "custom": { "flip-v": true },
  "model": "examplemod:model.obj"
}
```

Blitz3D Models
--------------

Forge adds a loader for the `.b3d` file format. To use these models, the resource namespace must be registered through `B3DLoader.addDomain`. This loader accepts any model location that is in a registered namespace and whose path ends in `.b3d`.

[JSON model format]: https://minecraft.gamepedia.com/Model#Block_models
[overrides]: overrides.md
[blockstate JSON]: blockstates/introduction.md
[UV]: https://en.wikipedia.org/wiki/UV_mapping
