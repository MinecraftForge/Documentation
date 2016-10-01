`IBakedModel`
=============

`IBakedModel` is the result of calling [`IModel::bake`][IModel::bake]. Unlike `IModel`, which purely represents a shape without any concept of items or blocks, `IBakedModel` is a level lower; it processes the state of a block or item to find the final `BakedQuad`s for it.

### `isAmbientOcclusion`

If the model is being rendered as a block in the world, the block in question does not emit any light, and ambient occlusion is enabled, this causes the model to be rendered with ambient occlusion.

### `isGui3D`

If the model is being rendered as an item in an inventory, on the ground as an entity, on an item frame, etc. this makes it look "flat." In GUIs this also disables the lighting.

### `isBuiltInRenderer`

!!! important
    Unless you know what you're doing and are OK with using deprecated features, just `return false` from this and continue on.

When rendering this as an item, returning `true` causes the model to not be rendered, instead falling back to `TileEntityItemStackRenderer::renderItem`. For certain vanilla items such as chests and banners, this method is hardcoded to copy data from the item into a `TileEntity`, before using a `TileEntitySpecialRenderer` to render that TE in place of the item. For all other items, this queries a registry to find the `Class<? extends TileEntity>` corresponding to the item, finds the `TileEntitySpecialRenderer<T>` for that, and renders that in place of the model itself. `ForgeHooksClient::registerTESRItemStack` is used to register this kind of mapping. When a TESR is called like this, it receives `null` as it's `TileEntity` parameter.

### `getParticleTexture`

Self-explanatory; whatever texture should be used for the particles. For blocks this shows when an entity falls on it, when it breaks, etc. For items this shows when it breaks or when it's eaten.

### <s>`getItemCameraTransforms`</s>

Deprecated in favor of implementing `IPerspectiveAwareModel`. If a model implements that interface this method will not be called, in favor of an `instanceof` check and a call to `IPerspectiveAwareModel::handlePerspective`. Therefore, most `IBakedModel`s that also implement `IPerspectiveAwareModel` should `return ItemCamerTransforms.DEFAULT` here.

### `getOverrides`

Returns the `ItemOverrideList` to use for this model. This is only used if this model is being rendered as an item.

### `getQuads`

This is the main method of `IBakedModel`. It returns `BakedQuad`s, which contain the low-level vertex data that will be used to render the model. If the model is being rendered as a block, then the `IBlockState` passed in is non-null. Additionally, when applicable, [`Block::getExtendedState`][extended blockstates] is called to create the passed `IBlockState`, which allows for arbitrary data to be passed from the block to the model. The `EnumFacing` passed in is used for face culling. If the block against the given side of the block being rendered is opaque, then the faces associated with that side are not rendered. If that parameter is `null`, all faces not associated with a side are returned (that will never be culled). The `long` parameter is a random number.

If the model is being rendered as an item, the `ItemOverrideList` returned from `getOverrides` is responsible for handling the state of the item, and the `IBlockState` parameter will be `null`.

[IModel::bake]: imodel.md#bake
[extended blockstates]: extended-blockstates.md
