Items
=====

Along with blocks, items are a key component of most mods. While blocks make up the world around you, items are what let you change it.

Creating an Item
----------------

### Basic Items

Basic items that need no special functionality (think sticks or sugar) don't need custom classes. You can simply instantiate `Item` and call its various setters to set some simple properties.

|         Method         |                  Description                  |
|:----------------------:|:----------------------------------------------|
|    `setCreativeTab`    | Sets which creative tab this item is under. Must be called if this item is meant to be shown on the creative menu. Vanilla tabs can be found in the class `CreativeTabs`. |
|     `setMaxDamage`     | Sets the maximum damage value for this item. If it's over `0`, 2 item properties "damaged" and "damage" are added. |
|    `setMaxStackSize`   | Sets the maximum stack size.                  |
|      `setNoRepair`     | Makes this item impossible to repair, even if it is damageable. |
|  `setUnlocalizedName`  | Sets this item's unlocalized name, with "item." prepended. |
|    `setHarvestLevel`   | Adds or removes a pair of harvest class (`"shovel"`, `"axe"`) and harvest level. This method is not chainable. |

The above methods are chainable, unless otherwise stated, meaning they `return this` to facilitate calling them in series.

### Advanced Items

Setting the properties of an item as above only works for simple items. If you want more complicated items, you should subclass Item and override its methods.

Registering an Item
-------------------

Items must be [registered][registering] to function.

Coloring an Item
----------------

There are items, textures of which are colored within the code, and in fact, there are a lot of such items. For example, leather helmets, spawn eggs, potions and other.

### Item Color Handlers

An item color handler is required to color an item and is an instance of `IItemColor`, and therefore implements the following method.

```java
int getColorFromItemstack(
  ItemStack stack, 
  int tintIndex)
```

This method returns a hex representation of a color in an integer.

Tint indexes are specified for faces of an element in item's model JSON file. When a face with a tint index is being drawn, its tint index is passed to the method. A face without a tint index won't be colored. 

### Registering an Item Color Handler

Item color handlers must be registered by calling `ItemColors#registerItemColorHandler(IItemColor, Item)` to function. Same can be done for multiple items. An instance of `ItemColors` can be obtained by calling `Minecraft#getItemColors()`. This must be done during the initialization phase and only on the client side.

[registering]: ../concepts/registries.md#registering-things