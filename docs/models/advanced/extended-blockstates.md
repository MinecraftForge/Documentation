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


Declaring Unlisted Properties
------------------------------------

Unlisted properties are declared in `Block.createBlockState`, the same place as regular ("listed") properties. Instead of returning a `BlockStateContainer`, one must return an `ExtendedBlockState`. Forge provides a builder `BlockStateContainer.Builder`, which will automatically handle returning an `ExtendedBlockState` for you.

Example:
```Java
@Override
public BlockStateContainer createBlockState() {
	return new BlockStateContainer.Builder(this).add(LISTED_PROP).add(UNLISTED_PROP).build();
}
```

Note that you do not need to set default values for your unlisted properties. 


Filling Extended States
----------------------------

Before an `IBlockState` is passed to an `IBakedModel`, it will always have `Block.getExtendedState` called on it first. In this method, you will give all your unlisted properties values. Assuming you registered at least one unlisted property in the previous section, the `IBlockState` parameter can be safely casted to `IExtendedBlockState`, which has a `withProperty` method for unlisted properties analogous to its listed property cousin. Here, you can query whatever you want from the World, the Tile Entity, etc. (with appropriate safety checks, of course) and insert it into the extended blockstate.

!!! warning
	It is highly recommended that your unlisted property values be immutable. Baked model implementations will use the extended state and unlisted values on multiple threads, so any value must be used in a threadsafe manner. The easiest way is to simply make that information an immutable snapshot. Anything you might possibly want to know in your custom `IBakedModel`, you should be passing an immutable snapshot of through `Block.getExtendedState`.

Example:
```Java
@Override
public IExtendedBlockState getExtendedState(IBlockState state, IBlockAccess world, BlockPos pos) {
	IExtendedBlockState ext = (IExtendedBlockState) state;
	TileEntity te = world.getTileEntity(pos);
	if (te instanceof MyTE) {
		ext = ext.withProperty(UNLISTED_PROP, ((MyTE) te).getSomeImmutableData());
	}
	return ext;
}
```

Using Extended States
--------------------------

In a custom `IBakedModel`, the `IBlockState` parameter passed to you will be exactly the object you returned in `Block.getExtendedState`, and you can pull data out of it and use it to affect your rendering as you wish.

Here is a basic example of using an unlisted property to determine which model to render, assuming `UNLISTED_PROP` is an `IUnlistedProperty<String>`:
```Java
// in custom IBakedModel
private final Map<String, IBakedModel> submodels = new HashMap<>(); // populated in a custom manner out of the scope of this article

@Override
public List<BakedQuad> getQuads(@Nullable IBlockState state, EnumFacing facing, long rand) {
	IBakedModel fallback = Minecraft.getMinecraft().getBlockRendererDispatcher().getBlockModelShapes().getModelManager().getMissingModel();
	if (state == null)
		return fallback.getQuads(state, facing, rand);

	IExtendedBlockState ex = (IExtendedBlockState) state;
	String id = ex.getValue(UNLISTED_PROP);
	return submodels.getOrDefault(id, fallback).getQuads(state, facing, rand);
}
```

Since there are no longer a fixed set of `IExtendedBlockState` generated at startup, comparisons involving an extended state must use `getClean()`, which is a method on `IExtendedBlockState` that returns the vanilla state (i.e. the fixed set of `IBlockState` with only the listed properties).
```Java
IExtendedBlockState state = ...;
IBlockState worldState = world.getBlockState(pos);
if(state.getClean() == worldState) {
	...
}
```

[IBakedModel]: ibakedmodel.md
