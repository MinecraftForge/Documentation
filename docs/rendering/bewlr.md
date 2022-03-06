BlockEntityWithoutLevelRenderer
=======================
`BlockEntityWithoutLevelRenderer` is a method to handle dynamic rendering on items. This system is much simpler than the old `ItemStack` system, which required a `BlockEntity`, and did not allow access to the `ItemStack`.

Using BlockEntityWithoutLevelRenderer
--------------------------

BlockEntityWithoutLevelRenderer allows you to render your item using `public void renderByItem(ItemStack itemStack, TransformType transformType, PoseStack poseStack, MultiBufferSource bufferSource, int combinedLight, int combinedOverlay)`.

In order to use an BEWLR, the `Item` must first satisfy the condition that its model returns true for `BakedModel#isCustomRenderer`.
Once that returns true, the Item's BEWLR will be accessed for rendering. If it does not have one, it will use the default `ItemRenderer#getBlockEntityRenderer`.

To set the BEWLR for an Item, an anonymous instance of `IItemRenderProperties` must be consumed within `Item#initializeClient`. Within the anonymous instance, `IItemRenderProperties#getItemStackRenderer` should be overridden to return the instance of your BEWLR:

```java
// In your item class
@Override
public void initializeClient(Consumer<IItemRenderProperties> consumer) {
  consumer.accept(new IItemRenderProperties() {

    @Override
    public BlockEntityWithoutLevelRenderer getItemStackRenderer() {
      return myBEWLRInstance;
    }
  });
}
```

!!! important
    Each mod should only have one instance of a custom BEWLR.

That is it, no additional setup is necessary to use a BEWLR.
