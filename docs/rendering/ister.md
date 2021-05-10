ItemStackTileEntityRenderer
=======================
`ItemStackTileEntityRenderer` is a method to handle dynamic rendering on items. This system is much simpler than the old TESR `ItemStack` system, which required a `TileEntity`, and did not allow access to the `ItemStack`.

Using ItemStackTileEntityRenderer
--------------------------

ItemStackTileEntityRenderer allows you to render your item using `public void renderByItem(ItemStack itemStackIn, TransformType transformTypeIn, MatrixStack matrixStackIn, IRenderTypeBuffer bufferIn, int combinedLightIn, int combinedOverlayIn)`.

In order to use an ISTER, the `Item` must first satisfy the condition that its model returns true for `IBakedModel#isCustomRenderer`.
Once that returns true, the Item's ISTER will be accessed for rendering. If it does not have one, it will use the default `ItemStackTileEntityRenderer#instance`.

To set the ISTER for an Item, use `Item$Properties#setISTER`. Each Item can only ever provide one ISTER, and the getter is final so that mods do not return new instances each frame.

That is it, no additional setup is necessary to use a ISTER.
