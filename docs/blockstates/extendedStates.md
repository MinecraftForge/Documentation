Extended States
===================

Prerequisites:
* Understanding of [block states](../states.md). This article will assume you have read and understood the linked article.
* Limited understanding of custom baked models, as they are pretty much the only use case for extended states.

Motivation
------------

The rendering system of Minecraft 1.8 and above operates exclusively upon `IBlockState` instances, in that it assumes all information about the block's appearance is captured in that single object. The problem, however, is that regular `IBlockState`s need to know all possible combinations of properties and values ahead of time. This becomes a problem if you do not know all possible values at startup, or if the number of possible values is very large or infinite.

*Extended States* and *Unlisted Properties* are Forge-introduced extensions to the blockstates system that address this problem.

!!! Note
	Extended states and unlisted properties are systems intended to address this problem only in the context of rendering.
	Although the logical server still has the code and infrastructure for extended states, it cannot communicate it over the network, and nearly all server-side logical actions disregard extended states completely.
	As a result, extended states are intended to only be used on the logical client.

Unlisted Properties
-----------------------

Unlisted properties are an alternative kind of `IProperty<V>`, where every possible value combination is *not* generated on startup. Because of this, and because they do not show up on the game's F3 debug menu, we call them "unlisted".
The interface type for unlisted properties is `IUnlistedProperty<V>`. The interface methods for both types have nearly identical semantics, except that instead of `IProperty.getAllowedValues()`, which returns a collection of all valid values, we have `IUnlistedProperty.isValid(V)` to detect whether a value is valid.

Examples:
* Forge itself has a [`PropertyFloat`](https://github.com/MinecraftForge/MinecraftForge/blob/e3777f455991b6803eb826ff6305d17749462a3b/src/main/java/net/minecraftforge/common/property/PropertyFloat.java), which can hold any float value passing a certain Predicate.
* Botania has a generic [`PropertyObject`](https://github.com/Vazkii/Botania/blob/c58ae21173ff63da2f107e328f19a31e0d609778/src/main/java/vazkii/botania/api/state/PropertyObject.java) used to pass any sort of `Object` on to a custom model.

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

Filling Extended States
----------------------------

Before an `IBlockState` is used for rendering purposes, it will always have `Block.getExtendedState` called on it first. In this method, you will give all your unlisted properties values. Assuming you registered at least one unlisted property in the previous section, the `IBlockState` parameter can be safely casted to `IExtendedBlockState`, which has a `withProperty` method for unlisted properties analogous to its listed property cousin. Here, you can query whatever you want from the World, the Tile Entity, etc. (with appropriate safety checks, of course) and insert it into the extended blockstate.

!!! Warning
	It is highly recommended that your unlisted property values be immutable. Baked model implementations will use the extended state and unlisted values on multiple threads, so any value must be used in a threadsafe manner. The easiest way is to simply make that information an immutable snapshot.
	Because of this, `Block.getExtendedState` is the last opportunity you have on the main thread to pass information to the rendering system. Anything you might possibly want to know in your custom `IBakedModel`, you should be passing an immutable snapshot of through `Block.getExtendedState`.

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
public List<BakedQuad> getQuads(IBlockState state, EnumFacing facing, long rand) {
	IExtendedBlockState ex = (IExtendedBlockState) state;
	String id = ex.getValue(UNLISTED_PROP);
	IBakedModel fallback = Minecraft.getMinecraft().getBlockRendererDispatcher().getBlockModelShapes().getModelManager().getMissingModel();
	return submodels.getOrDefault(id, fallback).getQuads(state, facing, rand);
}
```
