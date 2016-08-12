Model Files
===========

A "model" is simply a shape. It can be a simple cube, it can be several cubes, it can be a truncated icosidodecahedron, or anything in between. Most models you'll see will be in [JSON] format. Models in other formats are loaded into `IModel`s by an `ICustomModelLoader` at runtime. Forge provides default implementations for WaveFront OBJ files and Blitz3D files.

Model files are referred to as `<domain>:<path>`, which means `assets/<domain>/models/block/<path>` or `assets/<domain>/models/item/<path>`. Block and item models differ in a few ways, the major one being [item property overrides][overrides]. Most things do not care about what loaded the model or what format it's in. A [blockstate JSON], for example, doesn't care what format its models are in, as long as it can load them properly.

When referring to textures in models, keep a few things in mind. First, you reference textures as `<domain>:<path>`, which normally means `assets/<domain>/textures/<path>.png`. (E.g. `examplemod:blocks/test`.) Second, when specifying UV coordinates, (0,0) is taken to mean the **top-left** corner. UVs are *always* from 0 to 16. If the texture is larger or smaller, it is scaled to fit. A texture must also be square, and its side must be a power of two (e.g. 1x1, 2x2, 4x4, 8x8, but not 4x8).

JSON Models
-----------

Vanilla Minecraft's JSON model format isn't very complicated. You simply define cuboid (cube/rectangular prism) elements, and assign textures to their faces. You can find a definition of the format on the [wiki]. Note that JSON models only support cuboid elements, there is no way to express a triangular wedge or something similar. If you want more complicated models, you must use another format. When you refer to the location of a JSON model, you do not suffix it with `.json`. (E.g. `minecraft:cube_all`, not `minecraft:cube_all.json`.)

WaveFront OBJ Models
--------------------

Forge adds a loader for the `.obj` file format. To use these models, you must register the resource domain through `OBJLoader.addDomain`. This loader accepts any model location that is in a registered domain and whose path ends in `.obj`. The `.mtl` file should be placed next to the `.obj` and will be automatically used with the `.obj`.

Blitz3D Files
-------------

Forge adds a loader for the `.b3d` file format. To use these models, you must register the resource domain through `B3DLoader.addDomain`. This loader accepts any model location that is in a registered domain and whose path ends in `.b3d`.

[JSON]: http://www.json.org
[wiki]: http://minecraft.gamepedia.com/Model#Block_models
[overrides]: overrides.md
[blockstate JSON]: blockstates/introduction.md
