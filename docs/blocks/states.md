Block States
============

Please read **all** of this guide before starting to code. Your understanding will be more comprehensive and correct than if you just picked parts out.
This guide is designed for an entry level introduction to Block States. You might notice some simplifying assumptions I've made below. They are intentional and are meant to avoid overloading beginners with information they may not immediately need.

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
This is where `Property<?>` comes in. Each Block has a set of zero or more of these objects, that describe, unsurprisingly, *properties* that the block have. Examples of this include color (`Property<NoteBlockInstrument>`), facing (`Property<Direction>`), integer and boolean values, etc. Each property can have a *value* of the type parametrized by `Property`. For example, for the respective example properties, we can have values `DyeColor.WHITE`, `Direction.EAST`, `1`, or `false`.

Then, following from this, we see that every unique triple (Block, set of properties, set of values for those properties) is a suitable abstracted replacement for Block and metadata. Now, instead of "minecraft:stone_button meta 9" we have "minecraft:stone_button[facing=east,powered=true]". Guess which is more meaningful?

We have a very special name for these triples - they're called `BlockState`'s.

Imbuing your Blocks with these Magical Properties
-------------------------------------------------

Now that I've successfully convinced you that properties and values are superior to arbitrary numbers, let's move on to the actual how-to-do part.

In your Block class, create static final `Property<>` objects for every property that your Block has. Vanilla provides us several convenience implementations:
  
  * `PropertyInteger`: Implements `Property<Integer>`. Created by calling PropertyInteger.create("<name>", <min>, <max>);
  * `PropertyBool`: Implements `Property<Boolean>`. Created by calling PropertyBool.create("<name>");
  * `PropertyEnum<E extends Enum<E>>`: Implements `Property<E>`, Defines a property that can take on the values of an Enum class. Created by calling PropertyEnum.create("name", <enum_class>);
    * You can also use only a subset of the Enum values (for example, you can use only 4 of the 16 `DyeColor`'s. Take a look at the other overloads of `PropertyEnum.create`)
  * `PropertyDirection`: This is a convenience implementation of `PropertyEnum<Direction>`
    * Several convenience predicates are also provided. For example, to get a property that represents the cardinal directions, you would call `PropertyDirection.create("<name>", Direction.Plane.HORIZONTAL)`. Or to get the X directions, `PropertyDirection.create("<name>", Direction.Axis.X)`

Note that you are free to make your own `Property<>` implementations, but the means to do that are not covered in this article.
In addition, note that you can share the same `Property` object between different blocks if you wish. Vanilla generally has separate ones for every single block, but it is merely personal preference.

!!! Note 
    If your mod has an API or is meant to be interacted with from other mods, it is **very highly** recommended that you instead place your `Property`'s (and any classes used as values) in your API. That way, people can use properties and values to set your blocks in the world instead of having to suffer with arbitrary numbers like you used to.

After you've created your `Property<>` objects, override `fillStateContainer` in your Block class. In that method, simply write `builder.add(...);`. Pass every `Property` you want the block to have.

Every block will also have a "default" state that is automatically chosen for you. You can overwrite this "default" by overwriting the `getDefaultState()` method. More importantly, when your block is placed it will become this "default" state. However if you wish to customise which `BlockState` is placed when you your block is placed you can overwrite `getStateForPlacement()`. This can be used to for example set the direction of your block depending on where the player is standing when they place it.

`BlockState`'s are immutable and pregenerated, this means calling `BlockState.with(<PROPERTY>, <NEW_VALUE>)` will simply go to the `BlockState`/`StateContainer` and request the BlockState with the set of values you want, instead of constructing a new `BlockState`.

It follows very easily from this that since basic `BlockState`'s are generated into a fixed set at startup, you are able and encouraged to use reference comparison (==) to check if they are equal!


Using `BlockState`'s
---------------------

`BlockState`, as we know now, is a powerful object. You can get the value of a property by calling `get(<PROPERTY>)`, passing it the `Property<>` you want to test.
If you want to get an `BlockState` with a different set of values, simply call `with(<PROPERTY>, <NEW_VALUE>)` as mentioned above. This will return another of the pregenerated `BlockState`'s with the values you requested.

You can get and put `BlockState`'s in the world using `setBlockState()` and `getBlockState()`.


Flattening
----------
As of Minecraft 1.13 metadata values have also been removed, instead of creating blocks with many blockstates to set its properties it is now preferred to simply make more blocks. Do you have a new wooden object that should have a variant for every wood type? In the past you'd have used blockstates for this, but now it is preferred to create separate blocks for each wood type.

A good rule of thumb is: if it has a different name, it should be a different block/item.

So consider whether or not you actually need to use blockstates or whether it's better to have separate blocks.
Take flower pots as an example: you might think the plant in the flower pot would be stored in a blockstate, but it's not! Each plant has its own flower pot block.
