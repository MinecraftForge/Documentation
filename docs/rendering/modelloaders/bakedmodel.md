`BakedModel`
=============

`BakedModel` is the result of calling `UnbakedModel#bake` for the vanilla model loader or `IModelGeometry#bake` for custom model loaders. Unlike `UnbakedModel` or `IModelGeometry`, which purely represents a shape without any concept of items or blocks, `BakedModel` is not as abstract. It represents geometry that has been optimized and reduced to a form where it is (almost) ready to go to the GPU. It can also process the state of an item or block to change the model.

In a majority of cases, it is not really necessary to implement this interface manually. One can instead use one of the existing implementations.

### `getOverrides`

Returns the [`ItemOverrides`][overrides] to use for this model. This is only used if this model is being rendered as an item.

### `useAmbientOcclusion`

If the model is rendered as a block in the level, the block in question does not emit any light, and ambient occlusion is enabled. This causes the model to be rendered with [ambient occlusion](ambocc).

### `isGui3d`

If the model is rendered as an item in an inventory, on the ground as an entity, on an item frame, etc., this makes the model look "flat." In GUIs, this also disables the lighting.

### `isCustomRenderer`

!!! important
    Unless you know what you're doing, just `return false` from this and continue on.

When rendering this as an item, returning `true` causes the model to not be rendered, instead falling back to `BlockEntityWithoutLevelRenderer#renderByItem`. For certain vanilla items such as chests and banners, this method is hardcoded to copy data from the item into a `BlockEntity`, before using a `BlockEntityRenderer` to render that BE in place of the item. For all other items, it will use the `BlockEntityWithoutLevelRenderer` instance provided by `IItemRenderProperties#getItemStackRenderer`. Refer to [BlockEntityWithoutLevelRenderer][bewlr] page for more information.

### `getParticleIcon`

Whatever texture should be used for the particles. For blocks, this shows when an entity falls on it, when it breaks, etc. For items, this shows when it breaks or when it's eaten.

!!! important
    The vanilla method with no parameters has been deprecated in favor of `#getParticleIcon(IModelData)` since model data can have an effect on how a particular model might be rendered.

### <s>`getTransforms`</s>

Deprecated in favor of implementing `#handlePerspective`. The default implementation is fine if `#handlePerspective` is implemented. See [Perspective][perspective].

### `handlePerspective`

See [Perspective][perspective].

### `getQuads`

This is the main method of `BakedModel`. It returns a list of `BakedQuad`s: objects which contain the low-level vertex data that will be used to render the model. If the model is being rendered as a block, then the `BlockState` passed in is non-null. If the model is being rendered as an item, the `ItemOverrides` returned from `#getOverrides` is responsible for handling the state of the item, and the `BlockState` parameter will be `null`.

The `Direction` passed in is used for face culling. If the block against the given side of another block being rendered is opaque, then the faces associated with that side are not rendered. If that parameter is `null`, all faces not associated with a side are returned (that will never be culled).

The `rand` parameter is an instance of Random.

It also takes in a non null `IModelData` instance. This can be used to define extra data when rendering the specific model via `ModelProperty`s. For example, one such property is `CompositeModelData`, which is used to store any additional submodel data for a model using the `forge:composite` model loader.

Note that this method is called very often: once for every combination of non-culled face and supported block render layer (anywhere between 0 to 28 times) *per block in a level*. This method should be as fast as possible, and should probably cache heavily.

[overrides]: ./itemoverrides.md
[ambocc]: https://en.wikipedia.org/wiki/Ambient_occlusion
[bewlr]: ../../items/bewlr.md
[perspective]: ./perspective.md
