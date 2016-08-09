Blocks
======

Blocks are, obviously, essential to the Minecraft world. They make up all of the terrain, structures, and machines. Chances are if you are interested in making a mod, then you will want to add some blocks. This page will guide you through the creation of blocks, and some of the things you can do with them.

Creating a Block
----------------

### Basic Blocks

For simple blocks, which need no special functionality (think cobblestone, wood planks, etc.), a custom class is not necessary. By simply instantiating the `Block` class and calling some of the many setters, one can create many different types of blocks. For instance:

- `setHardness` - Controls the time it takes to break the block. It is an arbitrary value. For reference, stone has a hardness of 1.5, and dirt 0.5. If the block should be unbreakable, a convenience method `setBlockUnbreakable` is provided.
- `setResistance` - Controls the explosion resistance of the block. This is separate from hardness, but `setHardness` will also set the resistance to 5 times the hardness value, if the resistance is any lower than this value.
- `setSoundType` - Controls the sound the block makes when it is punched, broken, or placed. Requires a `SoundType` argument, see the [sounds] page for more details.
- `setLightLevel` - Controls the light emission of the block. **Note:** This method takes a value from zero to one, not zero to fifteen. To calculate this value, take the light level you wish your block to emit and divide by 16. For instance a block which emits level 5 light should pass `5 / 16f` to this method.
- `setLightOpacity` - Controls the amount light passing through this block will be dimmed. Unlike `setLightLevel` this value is on a scale from zero to 15. For example, setting this to `3` will lower light by 3 levels every time it passes through this type of block.
- `setUnlocalizedName` - Mostly self explanatory, sets the unlocalized name of the block. This name will be prepended with "tile." and appended with ".name" for localization purposes. For instance `setUnlocalizedName("foo")` will cause the block's actual localization key to be "tile.foo.name". For more advanced localization control, a custom Item will be needed. We'll get into this more later.
- `setCreativeTab` - Controls which creative tab this block will fall under. This must be called if the block should be shown in the creative menu. Tab options can be found in the `CreativeTabs` class.

All these methods are *chainable* which means you can call them in series. See `Block#registerBlocks` for examples of this.

### Advanced Blocks

Of course, the above only allows for extremely basic blocks. If you want to add functionality, like player interaction, a custom class is required. However, the `Block` class has many methods and unfortunately not every single one can be documented here. See the rest of the pages in this section for things you can do with blocks.

Registering a Block
-------------------

So now that you have this block you've created, it's time to actually put it in the game. Thankfully this is extremely simple to do.

As with most things, blocks can be registered using `GameRegistry.register(...)`. For this method your block must have a "registry name" which is just another way of saying "unique name". The preferred method to set your block's registry name is by calling `setRegistryName` on it inside the call to `register`. For instance, `GameRegistry.register(myBlock.setRegistryName("foo"))`.

!!! important

    There is a very large difference between a block in the world and a block in your inventory. A block in the world is governed by an instance of `Block`, it has a blockstate, a 4-bit meta, and maybe a tile entity. Meanwhile, an item in your inventory is controlled by an instance of `Item`, with a 16-bit damage/meta, and maybe an NBT tag. As a bridge between the different worlds of `Block` and `Item`, we have the class `ItemBlock`. `ItemBlock` is a subclass of `Item` that has a field `block` that holds a reference to the `Block` it represents. `ItemBlock` defines some of the behavior of a "block" as an item, like how a right click places the block. It's possible to have a `Block` without an `ItemBlock`. (E.g. `minecraft:water` is a block, but not an item.)
    
    When you register a block, you *only* register a block. The block does not automatically have an `ItemBlock`. In order to give your block an `ItemBlock`, you should construct an `ItemBlock` from it and register that as well. The simplest way to do this like this: `GameRegistry.register(new ItemBlock(myBlock).setRegistryName(myBlock.getRegistryName()))`.

!!! note

    When using a simple string, the currently active mod's ID will be added. So if I was doing this from "mymod", the real registry name would be "mymod:foo".

It is also possible to pass a `ResourceLocation` directly into `register`, but this is just convenience for calling `setRegistryName` with the `ResourceLocation` beforehand.

Further Reading
---------------

For information about block properties, such as those used for vanilla blocks like wood types, fences, walls, and many more, see the section on [blockstates].

[sounds]: ../effects/sounds.md
[blockstates]: ../blockstates/states.md
