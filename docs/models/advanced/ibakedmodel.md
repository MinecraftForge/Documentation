`IBakedModel`
=============

`IBakedModel` is the result of calling [`IModel::bake`][IModel::bake]. Unlike `IModel`, which purely represents a shape without any concept of items or blocks, `IBakedModel` is not as abstract; it represents geometry that has been optimized and reduced to a form where it is (almost) ready to go to the GPU. It can also process the state of an item or block to change the model.

In a majority of cases, it is not really necessary to implement this interface manually. One can instead use one of the existing implementations.

### `getOverrides`

Returns the [`ItemOverrideList`][ItemOverrideList] to use for this model. This is only used if this model is being rendered as an item.

### `isAmbientOcclusion`

If the model is being rendered as a block in the world, the block in question does not emit any light, and ambient occlusion is enabled, this causes the model to be rendered with ambient occlusion.

### `isGui3D`

If the model is being rendered as an item in an inventory, on the ground as an entity, on an item frame, etc. this makes it look "flat." In GUIs this also disables the lighting.

### `isBuiltInRenderer`

!!! important
    Unless you know what you're doing and are OK with using deprecated features, just `return false` from this and continue on.

When rendering this as an item, returning `true` causes the model to not be rendered, instead falling back to `TileEntityItemStackRenderer::renderItem`. For certain vanilla items such as chests and banners, this method is hardcoded to copy data from the item into a `TileEntity`, before using a `TileEntitySpecialRenderer` to render that TE in place of the item. For all other items, it will use the `TileEntityItemStackRenderer` instance provided by `Item#setTileEntityItemStackRenderer`; refer to [TileEntityItemStackRenderer][teisr] page for more information.

### `getParticleTexture`

Whatever texture should be used for the particles. For blocks, this shows when an entity falls on it, when it breaks, etc. For items, this shows when it breaks or when it's eaten.

### <s>`getItemCameraTransforms`</s>

Deprecated in favor of implementing `handlePerspective`. The default implementation is fine if `handlePerspective` is implmented. See [Perspective][].

### `handlePerspective`

See [Perspective][].

### `getQuads`

This is the main method of `IBakedModel`. It returns `BakedQuad`s, which contain the low-level vertex data that will be used to render the model. If the model is being rendered as a block, then the `IBlockState` passed in is non-null. Additionally, [`Block::getExtendedState`][extended blockstates] is called to create the passed `IBlockState`, which allows for arbitrary data to be passed from the block to the model. If the model is being rendered as an item, the `ItemOverrideList` returned from `getOverrides` is responsible for handling the state of the item, and the `IBlockState` parameter will be `null`.

The `EnumFacing` passed in is used for face culling. If the block against the given side of the block being rendered is opaque, then the faces associated with that side are not rendered. If that parameter is `null`, all faces not associated with a side are returned (that will never be culled).

Note that this method is called very often: once for every combination of non-culled face and supported block render layer (anywhere between 0 to 28 times) *per block in world*. This method should be as fast as possible, and should probably cache heavily.

The `long` parameter is a random number.

[IModel::bake]: imodel.md#bake
[Perspective]: perspective.md
[ItemOverrideList]: itemoverridelist.md
[extended blockstates]: extended-blockstates.md
[teisr]: ../../rendering/teisr.md
