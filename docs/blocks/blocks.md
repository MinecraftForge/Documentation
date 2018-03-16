Blocks
======

Blocks are, obviously, essential to the Minecraft world. They make up all of the terrain, structures, and machines. Chances are if you are interested in making a mod, then you will want to add some blocks. This page will guide you through the creation of blocks, and some of the things you can do with them.

Creating a Block
----------------

### Basic Blocks

For simple blocks, which need no special functionality (think cobblestone, wood planks, etc.), a custom class is not necessary. By simply instantiating the `Block` class and calling some of the many setters, one can create many different types of blocks. For instance:

- `setHardness` - Controls the time it takes to break the block. It is an arbitrary value. For reference, stone has a hardness of 1.5, and dirt 0.5. If the block should be unbreakable, a convenience method `setBlockUnbreakable` is provided.
- `setResistance` - Controls the explosion resistance of the block. This is separate from hardness, but `setHardness` will also set the resistance to 5 times the hardness value, if the resistance is any lower than this value.
- `setSoundType` - Controls the sound the block makes when it is punched, broken, or placed. Requires a `SoundType` argument, see the [sounds][] page for more details.
- `setLightLevel` - Controls the light emission of the block. **Note:** This method takes a value from zero to one, not zero to fifteen. To calculate this value, take the light level you wish your block to emit and divide by 16. For instance a block which emits level 5 light should pass `5 / 16f` to this method.
- `setLightOpacity` - Controls the amount light passing through this block will be dimmed. Unlike `setLightLevel` this value is on a scale from zero to 15. For example, setting this to `3` will lower light by 3 levels every time it passes through this type of block.
- `setUnlocalizedName` - Mostly self explanatory, sets the unlocalized name of the block. This name will be prepended with "tile." and appended with ".name" for localization purposes. For instance `setUnlocalizedName("foo")` will cause the block's actual localization key to be "tile.foo.name". For more advanced localization control, a custom Item will be needed. We'll get into this more later.
- `setCreativeTab` - Controls which creative tab this block will fall under. This must be called if the block should be shown in the creative menu. Tab options can be found in the `CreativeTabs` class.

All these methods are *chainable* which means you can call them in series. See `Block#registerBlocks` for examples of this.

### Advanced Blocks

Of course, the above only allows for extremely basic blocks. If you want to add functionality, like player interaction, a custom class is required. However, the `Block` class has many methods and unfortunately not every single one can be documented here. See the rest of the pages in this section for things you can do with blocks.

Registering a Block
-------------------

Blocks must be [registered][registering] to function.

!!! important

    A block in the world and a "block" in an inventory are very different things. A block in the world is represented by an `IBlockState`, and its behavior defined by an instance of `Block`. Meanwhile, an item in an inventory is an `ItemStack`, controlled by an `Item`. As a bridge between the different worlds of `Block` and `Item`, there exists the class `ItemBlock`. `ItemBlock` is a subclass of `Item` that has a field `block` that holds a reference to the `Block` it represents. `ItemBlock` defines some of the behavior of a "block" as an item, like how a right click places the block. It's possible to have a `Block` without an `ItemBlock`. (E.g. `minecraft:water` exists a block, but not an item. It is therefore impossible to hold it in an inventory as one.)

    When a block is registered, *only* a block is registered. The block does not automatically have an `ItemBlock`. To create a basic `ItemBlock` for a block, one should use `new ItemBlock(block).setRegistryName(block.getRegistryName())`. The unlocalized name is the same as the block's. Custom subclasses of `ItemBlock` may be used as well. Once an `ItemBlock` has been registered for a block, `Item.getItemFromBlock` can be used to retrieve it. `Item.getItemFromBlock` will return `null` if there is no `ItemBlock` for the `Block`, so if you are not certain that there is an `ItemBlock` for the `Block` you are using, check for `null`.

Further Reading
---------------

For information about block properties, such as those used for vanilla blocks like wood types, fences, walls, and many more, see the section on [blockstates][].

[sounds]: ../effects/sounds.md
[registering]: ../concepts/registries.md#registering-things
[blockstates]: states.md
