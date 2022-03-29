Coloring Textures
=================

Many blocks and items in vanilla change their texture color depending on where they are or what properties they have, such as grass. Models support specifying "tint indices" on faces, which are integers that can then be handled by `BlockColor`s and `ItemColor`s. See the [wiki][] for information on how tint indices are defined in vanilla models.

### `BlockColor`/`ItemColor`

Both of these are single-method interfaces. `BlockColor` takes a `BlockState`, a (nullable) `BlockAndTintGetter`, and a (nullable) `BlockPos`. `ItemColor` takes an `ItemStack`. Both of them take an `int` parameter `tintIndex`, which is the tint index of the face being colored. Both of them return an `int`, a color multiplier. This `int` is treated as 4 unsigned bytes, alpha, red, green, and blue, in that order, from most significant byte to least. For each pixel in the tinted face, the value of each color channel is `(int)((float) base * multiplier / 255.0)`, where `base` is the original value for the channel, and `multiplier` is the associated byte from the color multiplier. Note that blocks do not use the alpha channel. For example, the grass texture, untinted, looks white and gray. The `BlockColor` and `ItemColor` for grass return color multipliers with low red and blue components, but high alpha and green components, (at least in warm biomes) so when the multiplication is performed, the green is brought out and the red/blue diminished.

If an item inherits from the `builtin/generated` model, each layer ("layer0", "layer1", etc.) has a tint index corresponding to its layer index.

### Creating Color Handlers

`BlockColor`s need to be registered to the `BlockColors` instance of the game. `BlockColors` can be acquired through `ColorHandlerEvent$Block`, and an `BlockColor` can be registered by `BlockColors#register`. Note that this does not cause the `BlockItem` for the given block to be colored. `BlockItem`s are items and need to be colored with an `ItemColor`.

```java
@SubscribeEvent
public void registerBlockColors(ColorHandlerEvent.Block event){
  event.getBlockColors().register(myBlockColor, coloredBlock1, coloredBlock2, ...);
}
```

`ItemColor`s need to be registered to the `ItemColors` instance of the game. `ItemColors` can be acquired through `ColorHandlerEvent$Item`, and an `ItemColor` can be registered by `ItemColors#register`. This method is overloaded to also take `Block`s, which simply registers the color handler for the item `Block#asItem` (i.e. the block's `BlockItem`).

```java
@SubscribeEvent
public void registerItemColors(ColorHandlerEvent.Item event){
  event.getItemColors().register(myItemColor, coloredItem1, coloredItem2, ...);
}
```

[wiki]: https://minecraft.gamepedia.com/Model#Block_models
