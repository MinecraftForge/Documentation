TileEntityRenderer
==================

A `TileEntityRenderer` or `TER` (previously `TileEntitySpecialRenderer` or `TESR`) is used to render blocks in a way that cannot be represented with a static baked model (JSON, OBJ, B3D, others). A tile entity renderer requires the block to have a TileEntity.

By default OpenGL (via `GlStateManager`) is used to handle rendering in a TER. See the OpenGL documentation to learn more. It is recommended to use a `TileEntityRendererFast` instead whenever possible.

Creating a TER
--------------

To create a TER, create a class that inherits from `TileEntityRenderer`. It takes a generic argument specifying the block's TileEntity class. The generic argument is used in the TER's `render` method.

Only one TER exists for a given tile entity. Therefore, values that are specific to a single instance in the world should be stored in the tile entity being passed to the renderer rather than in the TER itself. For example, an integer that increments every frame, if stored in the TER, will increment every frame for every tile entity of this type in the world.

### `render`

This method is called every frame in order to render the tile entity. 

#### Parameters
* `tileentity`: This is the instance of the tile entity being rendered.
* `x`, `y`, `z`: The position at which the tile entity should be rendered.
* `partialTicks`: The amount of time, in fractions of a tick, that has passed since the last full tick.
* `destroyStage`: The destroy stage for the block if it is being broken.

Registering a TER
-----------------

In order to register a TESR, call `ClientRegistry#bindTileEntitySpecialRenderer` passing the tile entity class to be renderer with this TER and the instance of the TER to use to render all TEs of this class.
