Items
=====

Along with blocks, items are a key component of most mods. While blocks make up the level around you, items exist within inventories.

Creating an Item
----------------

### Basic Items

Basic items that need no special functionality (think sticks or sugar) do not need custom classes. You can create an item by instantiating the `Item` class with an `Item$Properties` object. This `Item$Properties` object can be made via the constructor and customized by calling its methods. For instance:

|         Method         |                  Description                  |
|:----------------------:|:----------------------------------------------|
|         `tab`        | Sets which `CreativeModeTab` this item is under. Must be called if this item is meant to be shown on the creative menu. Vanilla tabs can be found in the class `CreativeModeTab`. |
|       `durability`      | Sets the maximum damage value for this item. If it is over `0`, two item properties "damaged" and "damage" are added. |
|     `stacksTo`     | Sets the maximum stack size. You cannot have an item that is both damageable and stackable. |
|      `setNoRepair`     | Makes this item impossible to repair, even if it is damageable. |
|     `craftRemainder`    | Sets this item's container item, the way that lava buckets give you back an empty bucket when they are used. |

The above methods are chainable, meaning they `return this` to facilitate calling them in series.

### Advanced Items

Setting the properties of an item as above only works for simple items. If you want more complicated items, you should subclass `Item` and override its methods.

Registering an Item
-------------------

Items must be [registered][registering] to function.

[registering]: ../concepts/registries.md#methods-for-registering
