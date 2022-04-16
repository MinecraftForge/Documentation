Custom Model Loaders
====================

A "model" is simply a shape. It can be a simple cube, it can be several cubes, it can be a truncated icosidodecahedron, or anything in between. Most models you'll see will be in the vanilla JSON format. Models in other formats are loaded into `IModelGeometry`s by an `IModelLoader` at runtime. Forge provides default implementations for WaveFront OBJ files, buckets, composite models, models in different render layers, and a reimplementation of Vanilla's `builtin/generated` item model. Most things do not care about what loaded the model or what format it's in as they are all eventually represented by an `BakedModel` in code.

WaveFront OBJ Models
--------------------

Forge adds a loader for the `.obj` file format. To use these models, the JSON must reference the `forge:obj` loader. This loader accepts any model location that is in a registered namespace and whose path ends in `.obj`. The `.mtl` file should be placed in the same location with the same name as the `.obj` to be used automatically. The `.mtl` file will probably have to be manually edited to change the paths pointing to textures defined within the JSON. Additionally, the V axis for textures may be flipped depending on the external program that created the model (i.e. V = 0 may be the bottom edge, not the top). This may be rectified in the modelling program itself or done in the model JSON like so:

```js
{
  // Add the following line on the same level as a 'model' declaration
  "loader": "forge:obj",
  "flip-v": true,
  "model": "examplemod:models/block/model.obj",
  "textures": {
    // Can refer to in .mtl using #texture0
    "texture0": "minecraft:block/dirt",
    "particle": "minecraft:block/dirt"
  }
}
```
