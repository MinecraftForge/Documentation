Items
=====

Along with blocks, items are a key component of most mods. While blocks make up the level around you, items exist within inventories.

Creating an Item
----------------

### Basic Items

Basic items that need no special functionality (think sticks or sugar) do not need custom classes. You can create an item by instantiating the `Item` class with an `Item$Properties` object. This `Item$Properties` object can be made via the constructor and customized by calling its methods. For instance:

|      Method        |                  Description                  |
|:------------------:|:----------------------------------------------|
| `requiredFeatures` | Sets the required `FeatureFlag`s needed to see this item in the `CreativeModeTab` it is added to. |
| `durability`       | Sets the maximum damage value for this item. If it is over `0`, two item properties "damaged" and "damage" are added. |
| `stacksTo`         | Sets the maximum stack size. You cannot have an item that is both damageable and stackable. |
| `setNoRepair`      | Makes this item impossible to repair, even if it is damageable. |
| `craftRemainder`   | Sets this item's container item, the way that lava buckets give you back an empty bucket when they are used. |

The above methods are chainable, meaning they `return this` to facilitate calling them in series.

### Advanced Items

Setting the properties of an item as above only works for simple items. If you want more complicated items, you should subclass `Item` and override its methods.

## `CreativeModeTabEvent`

An item can be added to a `CreativeModeTab` via `CreativeModeTabEvent$BuildContents` on the [mod event bus][modbus]. An item(s) can be added without any additional configurations via `#accept`.

```java
// Registered on the MOD event bus
// Assume we have RegistryObject<Item> and RegistryObject<Block> called ITEM and BLOCK
@SubscribeEvent
public void buildContents(CreativeModeTabEvent.BuildContents event) {
  // Add to ingredients tab
  if (event.getTab() == CreativeModeTabs.INGREDIENTS) {
    event.accept(ITEM);
    event.accept(BLOCK); // Takes in an ItemLike, assumes block has registered item
  }
}
```

You can also enable or disable items being added through a `FeatureFlag` in the `FeatureFlagSet` or a boolean determining whether the player has permissions to see operator creative tabs.

### Custom Creative Tabs

A custom `CreativeModeTab` can be created via `CreativeModeTabEvent$Register#registerCreativeModeTab` on the [mod event bus][modbus]. This takes in the name of the tab and a consumer of the builder. In addition, a list of `ResourceLocation`s or `CreativeModeTab`s can be provided to determine where this tab should be located.

```java
// Registered on the MOD event bus
// Assume we have RegistryObject<Item> and RegistryObject<Block> called ITEM and BLOCK
@SubscribeEvent
public void buildContents(CreativeModeTabEvent.Register event) {
  event.registerCreativeModeTab(new ResourceLocation(MOD_ID, "example"), builder ->
    // Set name of tab to display
    builder.title(Component.translatable("item_group." + MOD_ID + ".example"))
    // Set icon of creative tab
    .icon(() -> new ItemStack(ITEM.get()))
    // Add default items to tab
    .displayItems((enabledFlags, populator, hasPermissions) -> {
      populator.accept(ITEM.get());
      populator.accept(BLOCK.get());
    })
  );
}
```

Registering an Item
-------------------

Items must be [registered][registering] to function.

[modbus]: ../concepts/events.md#mod-event-bus
[registering]: ../concepts/registries.md#methods-for-registering
