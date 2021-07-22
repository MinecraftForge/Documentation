TileEntityRenderer
==================

A `TileEntityRenderer` or `TER` (previously `TileEntitySpecialRenderer` or `TESR`) is used to render blocks in a way that cannot be represented with a static baked model (JSON, OBJ, B3D, others). A tile entity renderer requires the block to have a `TileEntity`.

Creating a TER
--------------

To create a TER, create a class that inherits from `TileEntityRenderer`. It takes a generic argument specifying the block's `TileEntity` class. The generic argument is used in the TER's `render` method.

Only one TER exists for a given `TileEntityType`. Therefore, values that are specific to a single instance in the world should be stored in the tile entity being passed to the renderer rather than in the TER itself. For example, an integer that increments every frame, if stored in the TER, will increment every frame for every tile entity of this type in the world.

### `render`

This method is called every frame in order to render the tile entity. 

#### Parameters
* `tileentityIn`: This is the instance of the tile entity being rendered.
* `partialTicks`: The amount of time, in fractions of a tick, that has passed since the last full tick.
* `matrixStackIn`: A stack holding four-dimensional matrix entries offset to the current position of the tile entity.
* `bufferIn`: A rendering buffer able to access a vertex builder.
* `combinedLightIn`: An integer of the current light value on the tile entity.
* `combinedOverlayIn`: An integer set to the current overlay of the tile entity, usually `OverlayTexture#NO_OVERLAY` or 655,360.

Registering a TER
-----------------

In order to register a TER, call `ClientRegistry#bindTileEntityRenderer` passing the `TileEntityType` to be rendered with this TER and the instance of the TER used to render all TEs of this type.
