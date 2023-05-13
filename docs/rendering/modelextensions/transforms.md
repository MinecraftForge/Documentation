Root Transforms
===============

Adding the `transform` entry at the top level of a model JSON suggests to the loader that a transformation should be applied to all geometry right before the rotations in the [blockstate] file in the case of a block model, and before the [display transforms][displaytransform] in the case of an item model. The transformation is available through `IGeometryBakingContext#getRootTransform()` in `IUnbakedGeometry#bake()`.

Custom model loaders may ignore this field entirely.

The root transforms can be specified in two formats:

1. A JSON object containing a singular `matrix` entry containing a raw transformation matrix in the form of a nested JSON array with the last row omitted (3*4 matrix, row major order). The matrix is the composition of the translation, left rotation, scale, right rotation and the transformation origin in that order. Example demonstrating the structure:
    ```js
    "transform": {
        "matrix": [
            [ 0, 0, 0, 0 ],
            [ 0, 0, 0, 0 ],
            [ 0, 0, 0, 0 ]
        ]
    }
    ```
2. A JSON object containing any combination of the following optional entries:
    * `origin`: origin point used for the rotations and scaling
    * `translation`: relative translation
    * `rotation` or `left_rotation`: rotation around the translated origin to be applied before scaling
    * `scale`: scale relative to the translated origin
    * `right_rotation` or `post_rotation`: rotation around the translated origin to be applied after scaling

Element-wise specification
-------------------------

If the transformation is specified as a combination of the entries mentioned in option 4, these entries will be applied in the order of `translation`, `left_rotation`, `scale`, `right_rotation`.  
The transformation is moved to the specified origin as a last step.

```js
{
    "transform": {
        "origin": "center",
        "translation": [ 0, 0.5, 0 ],
        "rotation": { "y": 45 }
    },
    // ...
}
```

The elements are expected to be defined as follows:

### Origin

The origin can be specified either as an array of 3 floating point values representing a three-dimensional vector: `[ x, y, z ]` or as one of the three default values:

* `"corner"` (0, 0, 0)
* `"center"` (.5, .5, .5)
* `"opposing-corner"` (1, 1, 1)

If the origin is not specified, it defaults to `"opposing-corner"`.

### Translation

The translation must be specified as an array of 3 floating point values representing a three-dimensional vector: `[ x, y, z ]` and defaults to (0, 0, 0) if not present.

### Left and Right Rotation

The rotations can be specified in any one of the following four ways:

* Single JSON object with a single axis => rotation degree mapping: `{ "x": 90 }`
* Array of an arbitrary amount of JSON objects with the above format (applied in the order they are specified in): `[ { "x": 90 }, { "y": 45 }, { "x": -22.5 } ]`
* Array of 3 floating point values specifying the rotation in degrees around each axis: `[ 90, 180, 45 ]`
* Array of 4 floating point values specifying a quaternion directly: `[ 0.38268346, 0, 0, 0.9238795 ]` (example equals 45 degrees around the X axis)

If the respective rotation is not specified, it will default to no rotation.

### Scale

The scale must be specified as an array of 3 floating point values representing a three-dimensional vector: `[ x, y, z ]` and defaults to (1, 1, 1) if not present.

[blockstate]: https://minecraft.fandom.com/wiki/Tutorials/Models#Block_states
[displaytransform]: ../modelloaders/transform.md