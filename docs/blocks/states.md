Block States
============

Legacy Behavior
---------------------------------------

In Minecraft 1.7 and previous versions, blocks which need to store placement or state data that did not have TileEntities used **metadata**. Metadata was an extra number stored with the block, allowing different rotations, facings, or even completely separate behaviors within a block.

However, the metadata system was confusing and limited, since it was stored as only a number alongside the block ID, and had no meaning except what was commented in the code. For example, to implement a block that can face a direction and be on either the upper or lower half of a block space (such as a stair):

```Java
switch (meta) {
    case 0: { ... } // south and on the lower half of the block
    case 1: { ... } // south on the upper side of the block
    case 2: { ... } // north and on the lower half of the block
    case 3: { ... } // north and on the upper half of the block
    ... etc. ...
}
```

Because the numbers carry no meaning by themselves, no one could know what they represent unless they had access to the source code and comments.

Introduction of States
---------------------------------------

In Minecraft 1.8 and above, the metadata system, along with the block ID system, was deprecated and eventually replaced with the **block state system**. The block state system abstracts out the details of the block's properties from the other behaviors of the block.

Each *property* of a block is described by an instance of `IProperty<?>`. Examples of block properties include instruments (`Property<NoteBlockInstrument>`), facing (`Property<Direction`), poweredness (`Property<Boolean>`), etc. Each property has the value of the type `T` parametrized by `Property<T>`.

A unique pair can be constructed from the block and a map of the properties to their associated values. This unique pair is called a `BlockState`.

The previous system of meaningless metadata values were replaced by a system of block properties, which are easier to interpret and deal with. Previously, a stone button which is facing east and is powered or held down is represented by "`minecraft:stone_button` with metadata `9`. Now, this is represented by "`minecraft:stone_button[facing=east,powered=true]`".

Proper Usage of Block States
---------------------------------------

The `BlockState` system is a flexible and powerful system, but it also has limitations. `BlockState`s are immutable, and all combinations of their properties are generated on startup of the game. This means that having a `BlockState` with many properties and possible values will slow down the loading of the game, and befuddle anyone trying to make sense of your block logic.

Not all blocks and situations require the usage of `BlockState`; only the most basic properties of a block should be put into a `BlockState`, and any other situation is better off with having a `TileEntity` or being a separate `Block`. Always consider if you actually need to use blockstates for your purposes.

!!! Note
    A good rule of thumb is: **if it has a different name, it should be a separate block**.

An example is making chair blocks: the *direction* of the chair should be a *property*, while the different *types of wood* should be separated into different blocks.
An "Oak Chair" facing east (`oak_chair[facing=east]`) is different from a "Spruce Chair" facing west (`spruce_chair[facing=west]`).

Implementing Block States
---------------------------------------

In your Block class, create or reference `static final` `Property<?>` objects for every property that your Block has. You are free to make your own `Property<?>` implementations, but the means to do that are not covered in this article. The vanilla code provides several convenience implementations:

  * `IntegerProperty`
    * Implements `Property<Integer>`. Defines a property that holds an integer value.
    * Created by calling `IntegerProperty#create(String propertyName, int minimum, int maximum)`.
  * `BooleanProperty`
    * Implements `Property<Boolean>`. Defines a property that holds a `true` or `false` value.
    * Created by calling `BooleanProperty#create(String propertyName)`.
  * `EnumProperty<E extends Enum<E>>`
    * Implements `Property<E>`. Defines a property that can take on the values of an Enum class.
    * Created by calling `EnumProperty#create(String propertyName, Class<E> enumClass)`.
    * It is also possible to use only a subset of the Enum values (e.g. 4 out of 16 `DyeColor`s). See the overloads of `EnumProperty#create`.
  * `DirectionProperty`
    * This is a convenience implementation of `EnumProperty<Direction>`
    * Several convenience predicates are also provided. For example, to get a property that represents the cardinal directions, call `DirectionProperty.create("<name>", Direction.Plane.HORIZONTAL)`; to get the X directions, `DirectionProperty.create("<name>", Direction.Axis.X)`.

The class `BlockStateProperties` contains shared vanilla properties which should be used or referenced whenever possible, in place of creating your own properties.

When you have your desired `Property<>` objects, override `Block#createBlockStateDefinition(StateContainer$Builder)` in your Block class. In that method, call `StateContainer$Builder#add(...);`  with the parameters as every `Property<?>` you wish the block to have.

Every block will also have a "default" state that is automatically chosen for you. You can change this "default" state by calling the `Block#registerDefaultState(BlockState)` method from your constructor. When your block is placed it will become this "default" state. An example from `DoorBlock`:

```Java
this.registerDefaultState(
    this.stateDefinition.any()
        .setValue(FACING, Direction.NORTH)
        .setValue(OPEN, false)
        .setValue(HINGE, DoorHingeSide.LEFT)
        .setValue(POWERED, false)
        .setValue(HALF, DoubleBlockHalf.LOWER)
);
```

If you wish to change what `BlockState` is used when placing your block, you can overwrite `Block#getStateForPlacement(BlockItemUseContext)`. This can be used to, for example, set the direction of your block depending on where the player is standing when they place it.

Because `BlockState`s are immutable, and all combinations of their properties are generated on startup of the game, calling `BlockState#setValue(Property<T>, T)` will simply go to the `Block`'s `StateContainer` and request the `BlockState` with the set of values you want.

Because all possible `BlockState`s are generated at startup, you are free and encouraged to use the reference equality operator (`==`) to check if two `BlockState`s are equal.

Using `BlockState`'s
---------------------

You can get the value of a property by calling `BlockState#getValue(Property<?>)`, passing it the property you want to get the value of.
If you want to get a `BlockState` with a different set of values, simply call `BlockState#setValue(Property<T>, T)` with the property and its value.

You can get and place `BlockState`'s in the world using `World#setBlockAndUpdate(BlockPos, BlockState)` and `World#getBlockState(BlockState)`. If you are placing a `Block`, call `Block#defaultBlockState()` to get the "default" state, and use subsequent calls to `BlockState#setValue(Property<T>, T)` as stated above to achieve the desired state.
