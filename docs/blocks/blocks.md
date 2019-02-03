Blocks
======

Blocks are, obviously, essential to the Minecraft world. They make up all of the terrain, structures, and machines. Chances are if you are interested in making a mod, then you will want to add some blocks. This page will guide you through the creation of blocks, and some of the things you can do with them.

Creating a Block
----------------

### Basic Blocks

If the block you are creating has no special functionality (think cobblestone, wooden planks), it is not necessary to create a new class for your block. You can simply instantiate the `Block` class. When doing this you will need a `Block.Builder` to pass to the constructor. This is how we set properties the properties of a block in 1.13+. Here's an exmaple:

```java
new Block(Block.Builder.from(Blocks.COBBLESTONE).lightValue(15)).setRegistryName("mymod:myblock");
```

See `Block.registerBlocks` for more examples on how to create simple blocks.

!!! Note

    Blocks have no setter for Item Group (formerly Creative Tab). This has been moved to the ItemBlock, and is now its responsibility. Furthermore, there is no setter for translation key (this is generated based on registry name now).

### `Block.Builder`
To set the properties of the block, you need to use a `Block.Builder`. There are a couple of options when creating a one. You can use `Block.Builder.from` to copy the properties of an existing block or `Block.Builder.create` to create a new one.

The `Block.Builder` has the following setters:

  - `doesNotBlockMovement` - makes it so the block does not block movement, Example Usage: plants.
  - `slipperiness` - defaults to `0.6F` high values make it more slippery. Example Usage: Ice. **Note:** Vanilla minecraft does not exceed `1.0F` in their blocks slipperiness.
  - `sound` - Defaults to `SoundType.STONE` see [sounds][] for more information.
  - `lightValue` - The amount of light emitted by the block. Example Usage: Glowstone. **Note:** this method takes a value from 1 to 15.
  - `hardnessAndResistance` - Hardness is how long it takes to mine a block (set to -1 for unbreakable). Resistance is explosion resistance.
  - `needsRandomTick` - makes the block recieve random ticks. Example Usage: Plants.
  - `variableOpacity` - if set to true, the game will work out the opacity of your block everytime either `IBlockstate.getOpacity`, `IBlockState.propagatesSkylightDown` or `IBlockState.getLightOpacity` is called. Example Usage: Shulker Boxes.

### Advanced Blocks

Of course, the above only allows for extremely basic blocks. If you want to add functionality, like player interaction, a custom class is required. However, the `Block` class has many methods and unfortunately not every single one can be documented here. See the rest of the pages in this section for things you can do with blocks.

Registering a Block
-------------------

Blocks must be [registered][registering] to function.

!!! important

    A block in the world and a "block" in an inventory are very different things. A block in the world is represented by an `BlockState`, and its behavior defined by an instance of `Block`. Meanwhile, an item in an inventory is an `ItemStack`, controlled by an `Item`. As a bridge between the different worlds of `Block` and `Item`, there exists the class `BlockItem`. `BlockItem` is a subclass of `Item` that has a field `block` that holds a reference to the `Block` it represents. `BlockItem` defines some of the behavior of a "block" as an item, like how a right click places the block. It's possible to have a `Block` without an `BlockItem`. (E.g. `minecraft:water` exists a block, but not an item. It is therefore impossible to hold it in an inventory as one.)

    When a block is registered, *only* a block is registered. The block does not automatically have an `BlockItem`. To create a basic `BlockItem` for a block, one should use `new BlockItem(block).setRegistryName(block.getRegistryName())`. Custom subclasses of `BlockItem` may be used as well. Once an `BlockItem` has been registered for a block, `Item.getItemFromBlock` can be used to retrieve it. `Item#.getItemFromBlock` will return `null` if there is no `BlockItem` for the `Block`, so if you are not certain that there is an `BlockItem` for the `Block` you are using, check for `null`.

#### Optionally Registering Blocks

In the past there have been several mods that have allowed users to disable blocks/items in a configuration file. However, you shouldn't do this. There is no limit on the amount of blocks that can be register, register all blocks in your mod! If you want a block to be disabled through a configuration file you should disable the crafting recipe or remove the block from the creative menu. (`ItemGroup`)

Further Reading
---------------

For information about block properties, such as those used for vanilla blocks like fences, walls, and many more, see the section on [blockstates][].

[sounds]: ../effects/sounds.md
[registering]: ../concepts/registries.md#methods-for-registering
[blockstates]: states.md
