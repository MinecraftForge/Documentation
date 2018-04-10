TileEntityItemStackRenderer
=======================
!!! note
    The features used here only exist in forge versions >= 14.23.2.2638.

TileEntityItemStackRenderer is a method to use OpenGL to render on items.  This system is much simpler than the old TESRItemStack system, which required a TileEntity, and did not allow access to the ItemStack.

Using TileEntityItemStackRenderer
--------------------------

TileEntityItemStackRenderer allows you to render your item using `public void renderByItem(ItemStack itemStackIn)`.  
There is an overload that takes partialTicks as a parameter, but it is never called in vanilla.

In order to use a TEISR, the Item must first satisfy the condition that its model returns true for `IBakedModel#isBuiltInRenderer`.
Once that returns true, the Item's TEISR will be accessed for rendering.  If it does not have one, it will use the default `TileEntityItemStackRenderer.instance`.

To set the TEISR for an Item, use `Item#setTileEntityItemStackRenderer`.  Each Item can only ever provide one TEISR, and the getter is final so that mods do not return new instances each frame.

That's it, no additional setup is necessary to use a TEISR.

If you need to access the TransformType for rendering, you can store the one passed through `IBakedModel#handlePerspective`, and use it during rendering.  This method will always be called before `TileEntityItemStackRenderer#renderByItem`.
