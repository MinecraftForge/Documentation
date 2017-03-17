TileEntitySpecialRenderer
=========================

A `TileEntitySpecialRenderer` (TESR) is used for handling additional rendering behavior for tile entities. OpenGL (via `GlStateManager`) is used to handle rendering in a TESR. See the OpenGL documentation to learn more.

Creating a TESR
---------------

To create a TESR, create a class that inherits from `TileEntitySpecialRenderer`. It takes a generic argument, of which the object must inherit from `TileEntity`. The generic argument is used in the TESR's method, `renderTileEntityAt`.

Only one TESR exists for a given tile entity. Therefore, values that are specific to a single instance in the world should be stored in the tile entity being passed to the renderer rather than in the TESR itself. For example, an integer that increments every frame, if stored in the TESR, will increment every frame for every tile entity of this type in the world.

### `renderTileEntityAt`

This method is called every frame in order to render the tile entity. 

#### Parameters
* `tileentity`: This is the instanceof the tile entity being rendered. It uses the generic argument, so, if the class is being inherited correctly, it will not need to be cast to your tile entity class.
* `x`, `y`, `z`: The coordinates of the tile entity as doubles. They are at the origin of the block.
* `partialTicks`: The amount of times, in fractions of a tick, that have passed since the last full tick.
* `destroyStage`: The destroy stage for the block if it is being broken.

Registering a TESR
------------------

In order to register a TESR, call `ClientRegistry#bindTileEntitySpecialRenderer` passing the tile entity class to be renderer with this TESR and the instance of the TESR to use to render all TEs of this class.
