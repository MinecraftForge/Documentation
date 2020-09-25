TileEntityRenderer
==================

A `TileEntityRenderer` or `TER` (previously `TileEntitySpecialRenderer` or `TESR`) is used to render blocks in a way that cannot be represented with a static baked model (JSON, OBJ, B3D, others). A tile entity renderer requires the block to have a TileEntity.

Creating a TER
--------------

To create a TER, create a class that inherits from `TileEntityRenderer`. It takes a generic argument specifying the block's TileEntity class. The generic argument is used in the TER's `render` method.

Only one TER exists for a given tile entity. Therefore, values that are specific to a single instance in the world should be stored in the tile entity being passed to the renderer rather than in the TER itself. For example, an integer that increments every frame, if stored in the TER, will increment every frame for every tile entity of this type in the world.

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

In order to register a TESR, call `ClientRegistry#bindTileEntitySpecialRenderer` passing the tile entity class to be renderer with this TER and the instance of the TER to use to render all TEs of this class.

IRenderTypeBuffer - Vertex Builders
-----------------------------------
This class gives you access to `IRenderTypeBuffer`, which in turn provides a series of `IVertexBuilder` instances via the `IRenderTypeBuffer#getBuffer` method.

To get an example vertex builder (VB), see the `RenderTypes` class for a set of prebuilt builders.

There are various vertex builders that Minecraft provides by default; here is a small overview of the main VB instances:

| Render Type |  Example Purpose
| :---------- | :--------------
| SOLID | Rendering block faces
| CUTOUT_MIPPED | Rendering parts of a block, or additional, dynamic models
| CUTOUT | See above, difference is texture sheet usage
| LINES | Directional lines

The best way to get started with these is to look at the `RenderType` class and inspect the various definitions at the top.

If you need a custom VB implementation, the easiest way is to subclass `RenderType` and declare custom instances of `RenderType` in the same manner as defined above. Look at the various builder properties to get a feel for how Minecraft natively sets up a GL state; each method effectively has a setup and teardown function defined.

Increasing render distance
--------------------------

For large TESR renderings (multiblock renders, for example) will stop rendering if the primary tile entity goes outside of the player's view (view frustum culling).

In order to address this, change the `AxisAlignedBB` that is returned from `TileEntity#getRenderBoundingBox`. This value should contain your main tile entity bounds, as well as any additional bounds needed to render the full structure.