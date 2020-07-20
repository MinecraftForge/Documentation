`IBakedModel`
=============

`IBakedModel` is the result of calling [`IModel#bake`][IModel#bake]. Unlike `IModel`, which purely represents a shape without any concept of items or blocks, `IBakedModel` is not as abstract; it represents geometry that has been optimized and reduced to a form where it is (almost) ready to go to the GPU. It can also process the state of an item or block to change the model.

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

When rendering this as an item, returning `true` causes the model to not be rendered, instead falling back to `ItemStackTileEntityRenderer#renderItem`. For certain vanilla items such as chests and banners, this method is hardcoded to copy data from the item into a `TileEntity`, before using a `TileEntitySpecialRenderer` to render that TE in place of the item. For all other items, it will use the `ItemStackTileEntityRenderer` instance provided by `Item#setTileEntityItemStackRenderer`; refer to [ItemStackTileEntityRenderer][teisr] page for more information.

### `getParticleTexture`

Whatever texture should be used for the particles. For blocks, this shows when an entity falls on it, when it breaks, etc. For items, this shows when it breaks or when it's eaten.

### <s>`getItemCameraTransforms`</s>

Deprecated in favor of implementing `handlePerspective`. The default implementation is fine if `handlePerspective` is implmented. See [Perspective][].

### `handlePerspective`

See [Perspective][].

### `getQuads`

This is the main method of `IBakedModel`. It returns `BakedQuad`s, which contain the low-level vertex data that will be used to render the model. If the model is being rendered as a block, then the `BlockState` passed in is non-null. Additionally, there is a [`IModelData`][modeldata] parameter which contains the data which is passed from the `TileEntity` allowing arbitrary data to be passed from the block to the model. If the model is being rendered as an item, the `ItemOverrideList` returned from `getOverrides` is responsible for handling the state of the item, and the `BlockState` parameter will be `null`.

The `Direction` passed in is used for face culling. If the block against the given side of the block being rendered is opaque, then the faces associated with that side are not rendered. If that parameter is `null`, all faces not associated with a side are returned (that will never be culled).

Note that this method is called very often: once for every combination of non-culled face and supported block render layer (anywhere between 0 to 28 times) *per block in world*. This method should be as fast as possible, and should probably cache heavily.

The `Random` parameter is used for randomised models.

### `getModelData`

This method provides the [`IModelData`][modeldata] instance to the `getQuads` method and has access to the `ILightReader` world, `BlockPos` for the block which is being rendered and the [`IModelData`][modeldata] instance as passed from the `TileEntity`. By default this will pass the [`IModelData`][modeldata] parameter straight to the `getQuads` method but can be used to modify `ModelProperty`'s (see [Model Data][modeldata]). An example use case of this method is to provide the `BlockState` to render for a camouflage block from the neighbouring blocks.

`BakedQuad`s
============

The `getQuads` method requires a list of quads to be drawn. These quads can either be generated algorithmically or can be copies of other block models using the `ModelManager`.

!!! note
    When using the quads from another block model, if you are going to manipulate the quads, be sure to copy the quads to not override the quads from the original model.

When constructing the `BakedQuad`s algorithmically, there are several parameters which need to be provided to construct a `BakedQuad` manually however it is often easier to use the `FaceBakery` to generate quads.

### `vertexData`

The vertex data is a structured `int` array providing information about the position of the vertices in the model, the shade color for each vertex and the vertex UV (see `FaceBakery#storeVertexData`). For blocks, each vertex in the quad has **7** float values which are converted into raw integer bits using `Float#floatToRawIntBits` and are as follows (also see `DefaultVertexFormats`):
1. The x position of the vertex as a float (for a regular JSON model, this is the x position of the vertex divided by 16)
2. The y position of the vertex formatted the same as with the x position
3. The z position as above
4. The shade colour - this uses the hard coded face brightness to apply the correct shading to the side of the quad
5. The texture U position as a float - this is the position of the texture as a proportion of the width of the `AtlasTexture`
6. The texture V position as a float - this is the position of the texture as a proportion of the height of the `AtlasTexture`
7. The vertex normal as an integer (see `ForgeHooksClient#fillNormal`)

### `tintIndex`

The tint index refers to which index to use with `IBlockColor` used to tint this quad. If this quad does not need a tint index, use the tint index `-1`

### `face`

The `Direction` that this quad is normal to. This should be the same face as from the `getQuads` method if the face is not null.

### `sprite`

The `TextureAtlasSprite` that is the texture for this quad

### `applyDiffuseLighting`

Whether to use lighting which depends on the side this quad is facing.

### `format`

The `VertexFormat` object which determines the structure of the `vertexData` parameter. See `DefaultVertexFormats` for all of the vertex format types.

[IModel#bake]: imodel.md#bake
[Perspective]: perspective.md
[ItemOverrideList]: itemoverridelist.md
[modeldata]: modeldata.md
[teisr]: ../../rendering/teisr.md
