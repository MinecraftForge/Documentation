Extended Blockstates
====================

Extended blockstates provide a way for blocks to pass arbitrary data to their models. Ordinary blockstates and properties occupy only a fixed set of possible states, while extended states can form infinite sets. This accomplished through the use of unlisted properties (`IUnlistedProperty<V>`), extended block states (`IExtendedBlockState`), and extended block state containers (`ExtendedBlockState`).

Ordinary block state containers (`BlockStateContainer`) take a set of listed properties (`IProperty<V>`) that define all possible values for themselves and use those to create all possible combinatons of values. These combinations are then turned into `IBlockState`s and stored in the finite set of all possible states. The properties are called "listed" as they appear on the F3 debug screen, all the way to the right.

Extended block state containers take a set of listed properties, and also a set of *unlisted* properties. Unlisted properties do not define all of their possible values, but instead provide a predicate for checking if a value is valid. The listed properties are again used to create the set of states, this time `IExtendedBlockState`s, but the unlisted properties remain unset. The unlisted properties are only set when `IExtendedBlockState::withProperty` is called to do so. This allows unlisted properties to have any type, even other `IBlockState`s.

One possible use case for this is to have advanced camouflaging blocks. The camouflaging block may have a tile entity that holds the `IBlockState` representative of the camouflagee, and an unlisted property to hold that state during rendering. This property can then be filled by `getExtendedState`. Finally, a custom `IBakedModel` can steal the model for that state and use it instead of using the uncamouflaged model.

The methods on `IExtendedBlockState` are self-explanatory, perhaps with the exception of `getClean`. All `getClean` does is return the base `IBlockState` with none of the unlisted properties set.

Using Extended Blockstates
--------------------------

A block using `ExtendedBlockState` simply constructs and returns one from its `createBlockState`. The constructor takes the set of listed and unlisted properties. Unlisted properties themselves may be created by implementing the interface in a class and instantiating it, or by wrapping a listed property in one through `Properties.PropertyAdapter`/`Properties.toUnlisted`. Unlisted properties should have default values set in the block's default blockstate, which must be done by casting the `Block::getDefaultState` to `IExtendedBlockState`, setting the properties, and then setting it as the default with `setDefaultState`.

In order for extended states to be actually useful, the block must also override `getExtendedState`, which is similar to `getActualState` in that it enriches a blockstate by filling in the values for unlisted properties. This returned `IBlockState` is what is passed into `IBakedModel::getQuads`.
