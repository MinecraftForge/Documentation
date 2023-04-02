Part Visibility
===============

Adding the `visibility` entry at the top level of a model JSON allows control over the visibility of different parts of the model to decide whether they should be baked into the final [`BakedModel`][bakedmodel]. The definition of a "part" is dependent on the model loader loading this model. Out of the model loaders provided by Forge only the [composite model loader][composite] and the [OBJ model loader][obj] make use of this functionality.

The visibility entries are specified as `"part name": boolean` entries. The check for the visibility of a given part traverses the full dependency chain until it finds an entry or reaches the end of the chain such that if a model doesn't specify the visibility of a part its parent will be interrogated for the visibility of that part. If no model in the dependency chain specifies a visibility for a part the visibility will default to true.

This allows things like a composite model with multiple parts which multiple models use as their parent and then specify different visibility settings for the parts.

[bakedmodel]: ../modelloaders/bakedmodel.md
[composite]: ../modelloaders/index.md/#composite-models
[obj]: ../modelloaders/index.md/#wavefront-obj-models