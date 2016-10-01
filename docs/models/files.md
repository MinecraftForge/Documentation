Model Files
===========

A "model" is simply a shape. It can be a simple cube, it can be several cubes, it can be a truncated icosidodecahedron, or anything in between. Most models you'll see will be in the vanilla JSON format. Models in other formats are loaded into `IModel`s by an `ICustomModelLoader` at runtime. Forge provides default implementations for WaveFront OBJ files and Blitz3D files. Most things do not care about what loaded the model or what format it's in as they all implement a common interface `IModel` in code.

Whenever you refer to a model using a `ResourceLocation`, the path is normally relative to `models` (e.g. `examplemod:block/block` → `assets/examplemod/models/block/block`). A notable exception is within a [blockstate JSON][], where model paths are relative to `models/block` (e.g. `examplemod:block` → `assets/examplemod/models/block/block`).

Block and item models differ in a few ways, the major one being [item property overrides][overrides].

When referring to textures in models, keep a few things in mind. First, you reference textures as RLs relative to `textures/`. (E.g. `examplemod:blocks/test` → `assets/examplemod/textures/blocks/test.png`.) Second, when specifying [UV coordinates][UV], (0,0) is taken to mean the **top-left** corner. UVs are *always* from 0 to 16. If the texture is larger or smaller, it is scaled to fit. A texture must also be square. The side length of a texture should also be a power of two, as doing otherwise breaks mipmapping. (E.g. 1x1, 2x2, 8x8, 16x16, and 128x128 are good. 5x5 and 30x30 are not recommended because they are not powers of 2. 5x10 and 4x8 are completely broken as they are not square.) If there is an `mcmeta` file associated with the texture, and an animation is defined, the image can be rectangular and is interpreted as a vertical sequence of square regions from top to bottom, where each square is a frame of the animation.


JSON Models
-----------

Vanilla Minecraft's JSON model format isn't very complicated. You simply define cuboid (cube/rectangular prism) elements, and assign textures to their faces. You can find a definition of the format on the [wiki][]. Note that JSON models only support cuboid elements, there is no way to express a triangular wedge or something similar. If you want more complicated models, you must use another format.

When you refer to the location of a JSON model, you do not suffix it with `.json`. (E.g. `minecraft:block/cube_all`, not `minecraft:block/cube_all.json`.)

WaveFront OBJ Models
--------------------

Forge adds a loader for the `.obj` file format. To use these models, you must register the resource domain through `OBJLoader.addDomain`. This loader accepts any model location that is in a registered domain and whose path ends in `.obj`. The `.mtl` file should be placed next to the `.obj` and will be automatically used with the `.obj`. Note that you likely have to manually edit the `.mtl` file to change the paths pointing to textures into Minecraft RLs. Also note that the V axis for textures may be flipped if an external program created the model (i.e. V = 0 is the bottom edge, not the top). You may rectify this in the modelling program itself, or you can do so in a forge blockstate JSON like so:

```json
{
  "custom": { "flip-v": true },
  "model": "examplemod:model.obj"
}
```

Blitz3D Files
-------------

Forge adds a loader for the `.b3d` file format. To use these models, you must register the resource domain through `B3DLoader.addDomain`. This loader accepts any model location that is in a registered domain and whose path ends in `.b3d`.

[wiki]: http://minecraft.gamepedia.com/Model#Block_models
[overrides]: overrides.md
[blockstate JSON]: blockstates/introduction.md
[UV]: https://en.wikipedia.org/wiki/UV_mapping
