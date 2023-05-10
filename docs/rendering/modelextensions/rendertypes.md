Render Types
============

Adding the `render_type` entry at the top level allows specifying the render type this model will render in.  
If this is not specified, the model will fall back to the render types returned by `ItemBlockRenderTypes#getRenderLayers()`.  
This is merely a hint to the model loader and custom model loaders are free to ignore this entry.

!!! note
    Since 1.19 this is preferred over the deprecated method of setting the applicable render type(s) via `ItemBlockRenderTypes#setRenderLayer()` for blocks.

Example of a model for a cutout block with the glass texture

```js
{
  "render_type": "minecraft:cutout",
  "parent": "block/cube_all",
  "textures": {
    "all": "block/glass"
  }
}
```

Vanilla Values
--------------

The following options with the respective chunk and entity render type are supplied by Forge (`NamedRenderTypeManager#preRegisterVanillaRenderTypes()`):

* `minecraft:solid`
    * Chunk render type: `RenderType#solid()`
    * Entity render type: `ForgeRenderTypes#ITEM_LAYERED_SOLID`
    * Used for fully solid blocks (i.e. Stone)
* `minecraft:cutout`
    * Chunk render type: `RenderType#cutout()`
    * Entity render type: `ForgeRenderTypes#ITEM_LAYERED_CUTOUT`
    * Used for blocks where any given pixel is either fully transparent or fully opaque (i.e. Glass Block)
* `minecraft:cutout_mipped`
    * Chunk render type: `RenderType#cutoutMipped()`
    * Entity render type: `ForgeRenderTypes#ITEM_LAYERED_CUTOUT`
    * Chunk and entity render type differ due to mipmapping on the entity render type making items look weird
    * Used for blocks where any given pixel is either fully transparent or fully opaque and the texture should be scaled down at larger distances ([mipmapping]) to avoid visual artifacts (i.e. Leaves)
* `minecraft:cutout_mipped_all`
    * Chunk render type: `RenderType#cutoutMipped()`
    * Entity render type: `ForgeRenderTypes#ITEM_LAYERED_CUTOUT_MIPPED`
    * Used in similar cases as `minecraft:cutout_mipped` when the item representation should also have mipmapping applied
* `minecraft:translucent`
    * Chunk render type: `RenderType#translucent()`
    * Entity render type: `ForgeRenderTypes#ITEM_LAYERED_TRANSLUCENT`
    * Used for blocks where any given pixel may be partially transparent (i.e. Stained Glass)
* `minecraft:tripwire`
    * Chunk render type: `RenderType#tripwire()`
    * Entity render type: `ForgeRenderTypes#ITEM_LAYERED_TRANSLUCENT`
    * Chunk and entity render type differ due to the tripwire render type not being feasible as an entity render type
    * Used for blocks with the special requirement of being rendered to the weather render target (i.e. Tripwire)

Custom Values
-------------

Custom named render types to be specified in a model can be registered in the `RegisterNamedRenderTypesEvent`. This event is fired on the mod event bus.

A custom named render type consists of two or three components:

* A chunk render type - any of the types in the list returned by `RenderType.chunkBufferLayers()` can be used
* A render type with the `DefaultVertexFormat.NEW_ENTITY` vertex format ("entity render type")
* A render type with the `DefaultVertexFormat.NEW_ENTITY` vertex format for use when the *Fabulous!* graphics mode is selected (optional)

The chunk render type is used when a block using this named render type is rendered as part of the chunk geometry.  
The required entity render type is used when an item using this named render type is rendered in the Fast and Fancy graphics modes (inventory, ground, item frame, etc.).  
The optional entity render type is used the same way as the required entity render type when the *Fabulous!* graphics mode is selected. This render type is needed in cases where the required entity render type does not work in the *Fabulous!* graphics mode (typically only applies to translucent render types).

```java
public static void onRegisterNamedRenderTypes(RegisterNamedRenderTypesEvent event)
{
  event.register("special_cutout", RenderType.cutout(), Sheets.cutoutBlockSheet());
  event.register("special_translucent", RenderType.translucent(), Sheets.translucentCullBlockSheet(), Sheets.translucentItemSheet());
}
```

[mipmapping]: https://en.wikipedia.org/wiki/Mipmap