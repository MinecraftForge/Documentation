Render Types
============

Adding the `render_type` entry at the top level allows specifying the render type this model will render in. If this is not specified, the model will fall back to the render types returned by `ItemBlockRenderTypes#getRenderLayers()`.

This replaces the deprecated method of setting the applicable render type(s) via `ItemBlockRenderTypes#setRenderLayer()` for blocks.

The following options with the respective chunk and entity render type are supplied by Forge (`NamedRenderTypeManager#preRegisterVanillaRenderTypes()`):

- `minecraft:solid`
    - Chunk render type: `RenderType#solid()`
    - Entity render type: `ForgeRenderTypes#ITEM_LAYERED_SOLID`
- `minecraft:cutout`
    - Chunk render type: `RenderType#cutout()`
    - Entity render type: `ForgeRenderTypes#ITEM_LAYERED_CUTOUT`
- `minecraft:cutout_mipped`
    - Chunk render type: `RenderType#cutoutMipped()`
    - Entity render type: `ForgeRenderTypes#ITEM_LAYERED_CUTOUT`
    - Chunk and entity render type differ due to mipmapping on the entity render type making items look weird
- `minecraft:cutout_mipped_all`
    - Chunk render type: `RenderType#cutoutMipped()`
    - Entity render type: `ForgeRenderTypes#ITEM_LAYERED_CUTOUT_MIPPED`
- `minecraft:translucent`
    - Chunk render type: `RenderType#translucent()`
    - Entity render type: `ForgeRenderTypes#ITEM_LAYERED_TRANSLUCENT`
- `minecraft:tripwire`
    - Chunk render type: `RenderType#tripwire()`
    - Entity render type: `ForgeRenderTypes#ITEM_LAYERED_TRANSLUCENT`
    - Chunk and entity render type differ due to the tripwire render type not being feasible as an entity render type

Custom named render types to be specified in a model can be registered in the `RegisterNamedRenderTypesEvent`.