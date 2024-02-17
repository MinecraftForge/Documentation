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
| `food`         | Makes the item eatable and is used to store information about the Hunger and Effects. |
| `durability`       | Sets the maximum damage value for this item. If it is over `0`, two item properties "damaged" and "damage" are added. |
| `defaultDurability`       | Sets the Item Durability for if it has a Maximum Damage of 0.
| `stacksTo`         | Sets the maximum stack size. You cannot have an item that is both damageable and stackable. |
| `setNoRepair`      | Makes this item impossible to repair, even if it is damageable. |
| `craftRemainder`   | Sets this item's container item, the way that lava buckets give you back an empty bucket when they are used. |
| `rarity`         | Sets the Item Name Color in the ToolTip based on Rarity.
| `fireResistant`         | Makes it so the item is resistant to fire.
| `setNoRepair`         | Makes the item impossible to Repair.

The above methods are chainable, meaning they `return this` to facilitate calling them in series.

### Advanced Items

Setting the properties of an item as above only works for simple items. If you want more complicated items, you should subclass `Item` and override its methods.

## Creative Tabs

An item can be added to a `CreativeModeTab` via `BuildCreativeModeTabContentsEvent` on the [mod event bus][modbus]. An item(s) can be added without any additional configurations via `#accept`.

```java
// Registered on the MOD event bus
// Assume we have RegistryObject<Item> and RegistryObject<Block> called ITEM and BLOCK
@SubscribeEvent
public void buildContents(BuildCreativeModeTabContentsEvent event) {
  // Add to ingredients tab
  if (event.getTabKey() == CreativeModeTabs.INGREDIENTS) {
    event.accept(ITEM);
    event.accept(BLOCK); // Takes in an ItemLike, assumes block has registered item
  }
}
```

You can also enable or disable items being added through a `FeatureFlag` in the `FeatureFlagSet` or a boolean determining whether the player has permissions to see operator creative tabs.

### Custom Creative Tabs

A custom `CreativeModeTab` must be [registered][registering]. The builder can be created via `CreativeModeTab#builder`. The tab can set the title, icon, default items, and a number of other properties. In addition, Forge provides additional methods to customize the tab's image, label and slot colors, where the tab should be ordered, etc.

```java
// Assume we have a DeferredRegister<CreativeModeTab> called REGISTRAR
// Assume we have RegistryObject<Item> and RegistryObject<Block> called ITEM and BLOCK
public static final RegistryObject<CreativeModeTab> EXAMPLE_TAB = REGISTRAR.register("example", () -> CreativeModeTab.builder()
  // Set name of tab to display
  .title(Component.translatable("item_group." + MOD_ID + ".example"))
  // Set icon of creative tab
  .icon(() -> new ItemStack(ITEM.get()))
  // Add default items to tab
  .displayItems((params, output) -> {
    output.accept(ITEM.get());
    output.accept(BLOCK.get());
  })
  .build()
);
```

Registering an Item
-------------------

Items must be [registered][registering] to function.

[modbus]: ../concepts/events.md#mod-event-bus
[registering]: ../concepts/registries.md#methods-for-registering
