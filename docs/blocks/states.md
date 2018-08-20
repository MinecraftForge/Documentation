Block States
============

Please read **all** of this guide before starting to code. Your understanding will be more comprehensive and correct than if you just picked parts out.
This guide is designed for an entry level introduction to Block States. If you know what Extended States are, you'll notice some simplifying assumptions I've made below. They are intentional and are meant to avoid overloading beginners with information they may not immediately need. If you don't know what they are, no need to fear, there will be another document for them eventually.

Motivation
----------

In Minecraft 1.8 and above, direct manipulation of blocks and metadata values have been abstracted away into what is known as blockstates.
The premise of the system is to remove the usage and manipulation of raw metadata numbers, which are nondescript and carry no meaning.

For example, consider this switch statement for some arbitrary block that can face a direction and be on either half of the block space:

```Java
switch(meta) {
  case 0: // it's south and on the lower half of the block
  case 1: // it's south on the upper side of the block
  case 2: // it's north and on the lower half of the block
  case 3: // it's north and on the upper half of the block
  ... etc.
}
```

The numbers themselves carry no meaning whatsoever! If the comments weren't there we would have no idea what the meaning of each number is.

A New Way of Thinking
---------------------

How about, instead of having to munge around with numbers everywhere, we instead use some system that abstracts out the details of saving from the semantics of the block itself?
This is where `IProperty<?>` comes in. Each Block has a set of zero or more of these objects, that describe, unsurprisingly, *properties* that the block have. Examples of this include color (`IProperty<EnumDyeColor>`), facing (`IProperty<EnumFacing>`), integer and boolean values, etc. Each property can have a *value* of the type parametrized by `IProperty`. For example, for the respective example properties, we can have values `EnumDyeColor.WHITE`, `EnumFacing.EAST`, `1`, or `false`.

Then, following from this, we see that every unique triple (Block, set of properties, set of values for those properties) is a suitable abstracted replacement for Block and metadata. Now, instead of "minecraft:stone_button meta 9" we have "minecraft:stone_button[facing=east,powered=true]". Guess which is more meaningful?

We have a very special name for these triples - they're called `IBlockState`'s.

Imbuing your Blocks with these Magical Properties
-------------------------------------------------

Now that I've successfully convinced you that properties and values are superior to arbitrary numbers, let's move on to the actual how-to-do part.

In your Block class, create static final `IProperty<>` objects for every property that your Block has. Vanilla provides us several convenience implementations:
  
  * `PropertyInteger`: Implements `IProperty<Integer>`. Created by calling PropertyInteger.create("<name>", <min>, <max>);
  * `PropertyBool`: Implements `IProperty<Boolean>`. Created by calling PropertyBool.create("<name>");
  * `PropertyEnum<E extends Enum<E>>`: Implements `IProperty<E>`, Defines a property that can take on the values of an Enum class. Created by calling PropertyEnum.create("name", <enum_class>);
    * You can also use only a subset of the Enum values (for example, you can use only 4 of the 16 `EnumDyeColor`'s. Take a look at the other overloads of `PropertyEnum.create`)
  * `PropertyDirection`: This is a convenience implementation of `PropertyEnum<EnumFacing>`
    * Several convenience predicates are also provided. For example, to get a property that represents the cardinal directions, you would call `PropertyDirection.create("<name>", EnumFacing.Plane.HORIZONTAL)`. Or to get the X directions, `PropertyDirection.create("<name>", EnumFacing.Axis.X)`

Note that you are free to make your own `IProperty<>` implementations, but the means to do that are not covered in this article.
In addition, note that you can share the same `IProperty` object between different blocks if you wish. Vanilla generally has separate ones for every single block, but it is merely personal preference.

!!! Note 
    If your mod has an API or is meant to be interacted with from other mods, it is **very highly** recommended that you instead place your `IProperty`'s (and any classes used as values) in your API. That way, people can use properties and values to set your blocks in the world instead of having to suffer with arbitrary numbers like you used to.

After you've created your `IProperty<>` objects, override `createBlockState` in your Block class. In that method, simply write `return new BlockState()`. Pass the `BlockState` constructor first your Block, `this`, then follow it with every `IProperty` you want to declare. Note that in 1.9 and above, the `BlockState` class has been renamed to `BlockStateContainer`, more in line with what this class actually does.

The object you just created is a pretty magical one - it manages the generation of all the triples above. That is, it generates all possible combinations of every value for each property (for math-oriented people, it takes the set of possible values of each property and computes the cartesian product of those sets). Thus, it generates every unique (Block, properties, values) possible - every `IBlockState` possible for the given properties.

If you do not set one of these `IBlockState`'s to act as the "default" state for your Block, then one is chosen for you. You probably don't want this (it will cause weird things to happen most of the time), so at the end of your Block's constructor call `setDefaultState()`, passing in the `IBlockState` you want to be the default. Get the one that was chosen for you using `this.blockState.getBaseState()` then set a value for *every* property using `withProperty`

Because `IBlockState`'s are immutable and pregenerated, calling `IBlockState.withProperty(<PROPERTY>, <NEW_VALUE>)` will simply go to the `BlockState`/`BlockStateContainer` and request the IBlockState with the set of values you want, instead of constructing a new `IBlockState`.

It follows very easily from this that since basic `IBlockState`'s are generated into a fixed set at startup, you are able and encouraged to use reference comparison (==) to check if they are equal!


Using `IBlockState`'s
---------------------

`IBlockState`, as we know now, is a powerful object. You can get the value of a property by calling `getValue(<PROPERTY>)`, passing it the `IProperty<>` you want to test.
If you want to get an IBlockState with a different set of values, simply call `withProperty(<PROPERTY>, <NEW_VALUE>)` as mentioned above. This will return another of the pregenerated `IBlockState`'s with the values you requested.

You can get and put `IBlockState`'s in the world using `setBlockState()` and `getBlockState()`.


Illusion Breaker
----------------

Sadly, abstractions are lies at their core. We still have the responsibility of translating every `IBlockState` back into a number between 0 and 15 inclusive that will be stored in the world and vice versa for loading.

If you declare any `IProperty`'s, you **must** override `getMetaFromState` and `getStateFromMeta`

Here you will read the values of your properties and return an appropriate integer between 0 and 15, or the other way around; the reader is left to check examples from vanilla blocks by themselves.

!!! Warning
    Your `getMetaFromState` and `getStateFromMeta` methods **must** be one to one! In other words, the same set of properties and values must map to the same meta value and back. Failing to do this, unfortunately, **won't** cause a crash. It'll just cause everything to behave extremely weirdly.


"Actual" States
-------------

Some sharper minds might know that fences don't save any of their connections to meta, yet they still have properties and values in the F3 menu! What is this blasphemy?!

Blocks can declare properties that are not saved to metadata. These are usually used for rendering purposes, but could possibly have other useful applications.
You still declare them in `createBlockState` and set their value in `setDefaultState`. However, these properties you do **not** touch **at all** in `getMetaFromState` and `getStateFromMeta`.

Instead, override `getActualState` in your Block class. Here you will receive the `IBlockState` corresponding with the metadata in the world, and you return another `IBlockState` with missing information such as fence connections, redstone connections , etc. filled in using `withProperty`. You can also use this to read Tile Entity data for a value (with appropriate safety checks of course!).

!!! Warning
    When you read tile entity data in `getActualState` you must perform additional safety checks. By default, `getTileEntity` attempts to create the tile entity if it is not already present. However, `getActualState` and `getExtendedState` can and will be called from different threads, which can cause the world's tile entity list to throw a `ConcurrentModificationException` if it tries to create a missing tile entity. Therefore, you must check if the `IBlockAccess` argument is a `ChunkCache` (the object passed to alternate threads), and if so, cast and use the non-writing variant of `getTileEntity`. An example of this safety check can be found in `BlockFlowerPot.getActualState()`.

!!! Note
    Querying `world.getBlockState()` will give you the `IBlockState` representing only the metadata. Thus the returned `IBlockState` will not have data from `getActualState` filled in. If that matters to your code, make sure you call `getActualState`!

[Extended Blockstates][]
------------------------

Extended blockstates are a way to pass arbitrary data into `IBakedModel`s during the rendering of a block. They are mainly used in the context of rendering, and therefore are documented in the Models section.

[Extended Blockstates]: ../models/advanced/extended-blockstates.md
