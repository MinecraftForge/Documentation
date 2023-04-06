Part Visibility
===============

Adding the `visibility` entry at the top level of a model JSON allows control over the visibility of different parts of the model to decide whether they should be baked into the final [`BakedModel`][bakedmodel]. The definition of a "part" is dependent on the model loader loading this model. Out of the model loaders provided by Forge only the [composite model loader][composite] and the [OBJ model loader][obj] make use of this functionality. The visibility entries are specified as `"part name": boolean` entries.

Composite model with two parts, the second of which will not be baked into the final model:
```js
{
  "loader": "forge:composite",
  "children": {
    "part_one": {
      "parent": "mymod:mypartmodel_one"
    },
    "part_two": {
      "parent": "mymod:mypartmodel_two"
    }
  },
  "visibility": {
    "part_two": false
  }
}
```

The visibility of a given part is determined by checking whether the model specifies a visibility for this part and, if not present, recursively checking the model's parent until either an entry is found or there is no further parent to check, in which case it defaults to true.

This allows setups like the following where multiple models use different parts of a single composite model:

1. A composite model specifies multiple components
2. Multiple models specify this composite model as their parent
3. These child models individually specify different visibilities for the parts

[bakedmodel]: ../modelloaders/bakedmodel.md
[composite]: ../modelloaders/index.md/#composite-models
[obj]: ../modelloaders/index.md/#wavefront-obj-models