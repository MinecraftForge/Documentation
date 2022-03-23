Blocks
======

Blocks are, obviously, essential to the Minecraft world. They make up all of the terrain, structures, and machines. Chances are if you are interested in making a mod, then you will want to add some blocks. This page will guide you through the creation of blocks, and some of the things you can do with them.

Creating a Block
----------------

### Basic Blocks

For simple blocks, which need no special functionality (think cobblestone, wooden planks, etc.), a custom class is not necessary. You can create a block by instantiating the `Block` class with a `BlockBehaviour$Properties` object. This `BlockBehaviour$Properties` object can be made using `BlockBehaviour$Properties#of`, and it can be customized by calling its methods. For instance:

- `strength` - The hardness controls the time it takes to break the block. It is an arbitrary value. For reference, stone has a hardness of 1.5, and dirt 0.5. If the block should be unbreakable a hardness of -1.0 should be used, see the definition of `Blocks#BEDROCK` as an example. The resistance controls the explosion resistance of the block. For reference, stone has a resistance of 6.0, and dirt 0.5.
- `sound` - Controls the sound the block makes when it is punched, broken, or placed. Requires a `SoundType` argument, see the [sounds][] page for more details.
- `lightLevel` - Controls the light emission of the block. Takes a function with a `BlockState` parameter that returns a value from zero to fifteen.
- `friction` - Controls how slippery the block is. For reference, ice has a slipperiness of 0.98.

All these methods are *chainable* which means you can call them in series. See the `Blocks` class for examples of this.

!!! note
    Blocks have no setter for their `CreativeModeTab`. This has been moved to the `BlockItem` and is now its responsibility. Furthermore, there is no setter for translation key as it is now generated from the registry name.

### Advanced Blocks

Of course, the above only allows for extremely basic blocks. If you want to add functionality, like player interaction, a custom class is required. However, the `Block` class has many methods and unfortunately not every single one can be documented here. See the rest of the pages in this section for things you can do with blocks.

Registering a Block
-------------------

Blocks must be [registered][registering] to function.

!!! important
    A block in the level and a "block" in an inventory are very different things. A block in the level is represented by an `BlockState`, and its behavior defined by an instance of `Block`. Meanwhile, an item in an inventory is an `ItemStack`, controlled by an `Item`. As a bridge between the different worlds of `Block` and `Item`, there exists the class `BlockItem`. `BlockItem` is a subclass of `Item` that has a field `block` that holds a reference to the `Block` it represents. `BlockItem` defines some of the behavior of a "block" as an item, like how a right click places the block. It's possible to have a `Block` without an `BlockItem`. (E.g. `minecraft:water` exists a block, but not an item. It is therefore impossible to hold it in an inventory as one.)

    When a block is registered, *only* a block is registered. The block does not automatically have an `BlockItem`. To create a basic `BlockItem` for a block, one should set the registry name of the `BlockItem` to that of its `Block`. Custom subclasses of `BlockItem` may be used as well. Once an `BlockItem` has been registered for a block, `Block#asItem` can be used to retrieve it. `Block#asItem` will return `Items#AIR` if there is no `BlockItem` for the `Block`, so if you are not certain that there is an `BlockItem` for the `Block` you are using, check for if `Block#asItem` returns `Items#AIR`.

#### Optionally Registering Blocks

In the past there have been several mods that have allowed users to disable blocks/items in a configuration file. However, you shouldn't do this. There is no limit on the amount of blocks that can be register, so register all blocks in your mod! If you want a block to be disabled through a configuration file, you should disable the crafting recipe.

Further Reading
---------------

For information about block properties, such as those used for vanilla blocks like fences, walls, and many more, see the section on [blockstates][].

[sounds]: ../gameeffects/sounds.md
[registering]: ../concepts/registries.md#methods-for-registering
[blockstates]: states.md
