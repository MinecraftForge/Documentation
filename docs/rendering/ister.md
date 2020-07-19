ItemStackTileEntityRenderer
=======================
ItemStackTileEntityRenderer is a method to use MatrixStack and IRenderTypeBuffer to render on items. This system is much simpler than the old TESRItemStack system, which required a TileEntity, and did not allow access to the ItemStack.

Using ItemStackTileEntityRenderer
--------------------------

ItemStackTileEntityRenderer allows you to render your item using `public void render(ItemStack itemStackIn, MatrixStack matrixStackIn, IRenderTypeBuffer bufferIn, int combinedLightIn, int combinedOverlayIn)`.
There is an overload that takes partialTicks as a parameter, but it is never called in vanilla.

In order to use a ISTER, the Item must first satisfy the condition that its model returns true for `IBakedModel#isBuiltInRenderer`.
Once that returns true, the Item's ISTER will be accessed for rendering. If it does not have one, it will use the default `ItemStackTileEntityRenderer.instance`.

To set the ISTER for an Item, use `Item.Properties#setISTER`. Each Item can only ever provide one ISTER, and the getter is final so that mods do not return new instances each frame.

That's it, no additional setup is necessary to use a ISTER.

If you need to access the TransformType for rendering, you can store the one passed through `IBakedModel#handlePerspective`, and use it during rendering. This method will always be called before `ItemStackTileEntityRenderer#render`.
