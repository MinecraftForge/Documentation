Extended Blockstates
====================

Extended blockstates provide a way for blocks to pass arbitrary data to their models. Ordinary blockstates and properties occupy only a fixed set of possible states, while extended states can form infinite sets. This accomplished through the use of unlisted properties (`IUnlistedProperty<V>`), extended block states (`IExtendedBlockState`), and extended block state containers (`ExtendedBlockState`).

Ordinary block state containers (`BlockStateContainer`) take a set of listed properties (`IProperty<V>`) that define all possible values for themselves and use those to create all possible combinatons of values. These combinations are then turned into `IBlockState`s and stored in the finite set of all possible states. The properties are called "listed" as they appear on the F3 debug screen, all the way to the right.

Extended block state containers take a set of listed properties, and also a set of *unlisted* properties. Unlisted properties' values can be anything that matches their type, and are not limited to a finite set. However, values are still required to satisfy the predicate `IUnlistedProperty::isValid`. The listed properties are again used to create the set of states, this time `IExtendedBlockState`s, but the unlisted properties remain unset. The unlisted properties are only set when `IExtendedBlockState::withProperty` is called to do so.

Most of the methods on `IExtendedBlockState` are self-explanatory, maybe with the exception of `getClean`. `getClean` returns the base `IBlockState` with none of the unlisted properties set.

Why Extended Blockstates
------------------------

Why use extended blockstates at all? Why not simply pass an `IBlockAccess` and `BlockPos` into the rendering system directly and have the [`IBakedModel`][IBakedModel] itself deal with it? Indeed, extended blockstates allow this to happen anyway! Why have the system at all when we could just do that? The reason is that it makes the system more flexible. External code can take an `IExtendedBlockState` and fill in some data by itself, overriding the block's own data. This allows that code to alter the model in ways that would be impossible if it was just a black box that took a world and a position and spat out some geometry.

One such use case is advanced camouflaging blocks. The camouflaging block may have a tile entity that holds the `IBlockState` representative of the camouflagee, and an unlisted property to hold that state during rendering. This property can then be filled by `getExtendedState`. Finally, a custom [`IBakedModel`][IBakedModel] can steal the model for that state and use it instead of using the uncamouflaged model.

Using Extended Blockstates
--------------------------

```java
public class ExampleBlock extends Block {
  public static final IProperty<Boolean> LPROP_1 = ...;
  public static final IProperty<Boolean> LPROP_2 = ...; // Some listed properties
  public static final IUnlistedProperty<Float> ROTATION = new IUnlistedProperty<Float>() {
    // Implementation
  };
  // Note that one can use Properties.PropertyAdapter/Properties.toUnlisted to wrap a IProperty in an IUnlistedProperty too.

  @Override
  public BlockStateContainer createBlockState() {
    return new ExtendedBlockState(this,
                                  new IProperty<?>[] { LPROP_1, LPROP_2 }, // Listed properties
                                  new IUnlistedProperty<?>[] { ROTATION }  // Unlisted properties
    );
  }

  // Implement getState/MetaFromMeta/State and getActualState (if required) too

  // Analogous to getActualState, in that it enriches an existing IBlockState with extra data. It is only called in the context of rendering
  @Override
  public IBlockState getExtendedState(IBlockState actualState, IBlockAccess world, BlockPos pos) { // result of getActualState is passed in
    return ((IExtendedBlockState)actualState).withProperty(ROTATION, ...);
  }

  public ExampleBlock() {
    // Other stuff...
    // Remember to set defaults for unlisted properties.
    setDefaultState(((IExtendedBlockState)getDefaultState()) // Cast required to set unlisted properties.
                    .withProperty(LPROP_1, ...)
                    .withProperty(LPROP_2, ...) // Set listed properties
                    .withProperty(ROTATION, 0F) // Set unlisted ones too
    );
  }
}
```

[IBakedModel]: ibakedmodel.md
