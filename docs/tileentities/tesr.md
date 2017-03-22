TileEntitySpecialRenderer
=========================

A `TileEntitySpecialRenderer` (TESR) is used to render blocks in a way that cannot be represented with a static baked model (JSON, OBJ, B3D, others). A TESR requires the block to have a TileEntity.

By default OpenGL (via `GlStateManager`) is used to handle rendering in a TESR. See the OpenGL documentation to learn more. It is recommended to use a FastTESR instead whenever possible.

Creating a TESR
---------------

To create a TESR, create a class that inherits from `TileEntitySpecialRenderer`. It takes a generic argument specifying the block's TileEntity class. The generic argument is used in the TESR's `renderTileEntityAt` method.

Only one TESR exists for a given tile entity. Therefore, values that are specific to a single instance in the world should be stored in the tile entity being passed to the renderer rather than in the TESR itself. For example, an integer that increments every frame, if stored in the TESR, will increment every frame for every tile entity of this type in the world.

### `renderTileEntityAt`

This method is called every frame in order to render the tile entity. 

#### Parameters
* `tileentity`: This is the instance of the tile entity being rendered.
* `x`, `y`, `z`: The position at which the tile entity should be rendered.
* `partialTicks`: The amount of time, in fractions of a tick, that has passed since the last full tick.
* `destroyStage`: The destroy stage for the block if it is being broken.

Registering a TESR
------------------

In order to register a TESR, call `ClientRegistry#bindTileEntitySpecialRenderer` passing the tile entity class to be renderer with this TESR and the instance of the TESR to use to render all TEs of this class.

`FastTESR`
----------

A TESR can opt-in to being a FastTESR by extending the `FastTESR` class instead of `TileEntitySpecialRenderer` and returning true from `TileEntity#hasFastRenderer`. Instead of implementing `renderTileEntityAt`, `renderTileEntityFast` must be implemented.

A FastTESR can offer performance improvements over a traditional TESR and should be used wherever possible. This is due to the fact that all FastTESR instances are batched together and only issue _one_ combined draw call for all FastTESRs per frame to the GPU. This advantage comes at the cost of making direct OpenGL access via `GlStateManager` or the `GLXX` classes impossible. Instead a FastTESR must only add vertices to the provided `VertexBuffer`, which represents the combined vertex data for all FastTESRs. This allows rendering `IBakedModel`s. An example can be found in Forge's `AnimationTESR`.
