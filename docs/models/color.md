Coloring Textures
=================

Many blocks and items in vanilla change their texture color depending on where they are, such as grass. Models support specifying "tint indices" on faces, which are integers that can then be handled by `IBlockColor`s and `IItemColor`s. See the [wiki][] for information on how tint indices are defined in vanilla models.

### `IBlockColor`/`IItemColor`

Both of these are single-method interfaces. `IBlockColor` takes an `IBlockState`, an (nullable) `IBlockAccess`, and a (nullable) `BlockPos`. `IItemColor` takes an `ItemStack`. Both of them take a parameter `tintindex`, which is the tint index of the face being colored. Both of them return an `int`, a color multiplier. This `int` is treated as 4 unsigned bytes, alpha, red, green, and blue, in that order, from most significant byte to least. For each pixel in the tinted face, the value of each color channel is `(int)((float)base * multiplier / 255)`, where `base` is the original value for the channel, and `multiplier` is the associated byte from the color multiplier. Note that blocks do not use the alpha channel. For example, the grass texture, untinted, looks white and gray. The `IBlockColor` and `IItemColor` for grass return color multipliers with low red and blue components, but high alpha and green components, (at least in worm biomes) so when the multiplication is performed, the green is brought out and the red/blue diminished.

If an item inherits from the `builtin/generated` model, each layer ("layer0", "layer1", etc.) has a tint index corresponding to its layer index.

### Creating Color Handlers

`IBlockColors` need to be registered to the `BlockColors` instance of the game. `BlockColors` can be acquired through `Minecraft.getMinecraft().getBlockColors()`, and an `IBlockColor` can be registered by `BlockColors::registerBlockColorHandler`. Note that this does not cause the `ItemBlock` for the given block to be colored. `ItemBlock`s are items and need to colored with an `IItemColor`.

`IItemColors` need to be registered to the `ItemColors` instance of the game. `ItemColors` can be acquired through `Minecraft.getMinecraft().getItemColors()`, and an `IItemColor` can be registered by `ItemColors::registerItemColorHandler`. This method is overloaded to also take `Block`s, which simply registers the color handler for the item `Item.getItemFromBlock(block)` (i.e. the block's `ItemBlock`).

This registration must be done client-side, in the initialization phase.

[wiki]: https://minecraft.gamepedia.com/Model#Block_models
