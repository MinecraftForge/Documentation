Root Transforms
===============

Adding the `transform` entry at the top level of a model JSON allows specifying a transformation that will be baked into the vertex data of the quads. These transforms apply before the transforms specified in the [blockstate][blockstate] file of a block model and the [display transforms][displaytransform] of an item model.

The root transforms can be specified in four formats:

- A string referring to a default value (currently only supports the value `"identity"`)
- A raw transformation matrix in the form of a nested JSON array with the last row ommited (3*4 matrix, row major order)
- A JSON object containing a singular `matrix` entry with the same format as above
- A JSON object containing any combination of the following optional entries:
    - `origin`: origin point used for the rotations and scaling, defaults to `opposing-corner`
        - Array with 3 floating point values for x, y, z
        - One of the default values: `"corner"` (0, 0, 0), `"center"` (.5, .5, .5) or `"opposing-corner"` (1, 1, 1)
    - `translation`: relative translation, defaults to (0, 0, 0)
        - Array with 3 floating point values for x, y, z
    - `rotation` or `left_rotation`: rotation around the translated origin to be applied before scaling, defaults to no rotation
        - Single JSON object with a single axis -> rotation degree mapping
        - Array of an arbitrary amount of JSON objects with the above format
        - Array of 3 floating point values specifying the rotation in degrees around each axis
        - Array of 4 floating point values specifying a quaternion directly
    - `scale`: scale relative to the translated origin, defaults to (1, 1, 1)
        - Single floating point value
        - Array with 3 floating point values for x, y, z
    - `right_rotation` or `post_rotation`: rotation around the translated origin to be applied after scaling, defaults to no rotation
        - Single JSON object with a single axis -> rotation degree mapping
        - Array of an arbitrary amount of JSON objects with the above format
        - Array of 3 floating point values specifying the rotation in degrees around each axis
        - Array of 4 floating point values specifying a quaternion directly

[blockstate]: https://minecraft.fandom.com/wiki/Tutorials/Models#Block_states
[displaytransform]: ../modelloaders/transform.md