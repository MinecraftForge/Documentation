# BlockEntities

`BlockEntities` are like simplified `Entities` that are bound to a Block.
They are used to store dynamic data, execute tick based tasks, and dynamic rendering.
Some examples from vanilla Minecraft would be handling of inventories on chests, smelting logic on furnaces, or area effects on beacons.
More advanced examples exist in mods, such as quarries, sorting machines, pipes, and displays.

!!! note
    `BlockEntities` aren't a solution for everything and they can cause lag when used wrongly.
    When possible, try to avoid them.

## Registering

Block Entities are created and removed dynamically and as such are not registry objects on their own.

In order to create a `BlockEntity`, you need to extend the `BlockEntity` class. As such, another object is registered instead to easily create and refer to the *type* of the dynamic object. For a `BlockEntity`, these are known as `BlockEntityType`s.

A `BlockEntityType` can be [registered][registration] like any other registry object. To construct a `BlockEntityType`, its builder form can be used via `BlockEntityType$Builder#of`. This takes in two arguments: a `BlockEntityType$BlockEntitySupplier` which takes in a `BlockPos` and `BlockState` to create a new instance of the associated `BlockEntity`, and a varargs of `Block`s which this `BlockEntity` can be attached to. Building the `BlockEntityType` is done by calling `BlockEntityType$Builder#build`. This takes in a `Type` which represents the type-safe reference used to refer to this registry object in a `DataFixer`. Since `DataFixer`s are an optional system to use for mods, this can be passed as `null`.

```java
// For some DeferredRegister<BlockEntityType<?>> REGISTER
public static final RegistryObject<BlockEntityType<MyBE>> MY_BE = REGISTER.register("mybe", () -> BlockEntityType.Builder.of(MyBE::new, validBlocks).build(null));

// In MyBE, a BlockEntity subclass
public MyBE(BlockPos pos, BlockState state) {
  super(MY_BE.get(), pos, state);
}
```

## Creating a `BlockEntity`

To create a `BlockEntity` and attach it to a `Block`, the `EntityBlock` interface must be implemented on your `Block` subclass. The method `EntityBlock#newBlockEntity(BlockPos, BlockState)` must be implemented and return a new instance of your `BlockEntity`.

## Storing Data within your `BlockEntity`

In order to save data, override the following two methods:
```java
BlockEntity#saveAdditional(CompoundTag tag)

BlockEntity#load(CompoundTag tag)
```
These methods are called whenever the `LevelChunk` containing the `BlockEntity` gets loaded from/saved to a tag.
Use them to read and write to the fields in your block entity class.

!!! note
		Whenever your data changes, you need to call `BlockEntity#setChanged`; otherwise, the `LevelChunk` containing your `BlockEntity` might be skipped while the level is saved.

!!! important
		It is important that you call the `super` methods!

    The tag names `id`, `x`, `y`, `z`, `ForgeData` and `ForgeCaps` are reserved by the `super` methods.

## Ticking `BlockEntities`

If you need a ticking `BlockEntity`, for example to keep track of the progress during a smelting process, another method must be implemented and overridden within `EntityBlock`: `EntityBlock#getTicker(Level, BlockState, BlockEntityType)`. This can implement different tickers depending on which logical side the user is on, or just implement one general ticker. In either case, a `BlockEntityTicker` must be returned. Since this is a functional interface, it can just take in a method representing the ticker instead:

```java
// Inside some Block subclass
@Nullable
@Override
public <T extends BlockEntity> BlockEntityTicker<T> getTicker(Level level, BlockState state, BlockEntityType<T> type) {
  return type == MyBlockEntityTypes.MYBE.get() ? MyBlockEntity::tick : null;
}

// Inside MyBlockEntity
public static void tick(Level level, BlockPos pos, BlockState state, T blockEntity) {
  // Do stuff
}
```

!!! note
    This method is called each tick; therefore, you should avoid having complicated calculations in here. If possible, you should make more complex calculations every X ticks. (The amount of ticks in a second may be lower then 20 (twenty) but won't be higher)

## Synchronizing the Data to the Client

There are three ways of syncing data to the client: synchronizing on chunk load, on block updates, and with a custom network message.

### Synchronizing on LevelChunk Load

For this you need to override
```java
BlockEntity#getUpdateTag()

IForgeBlockEntity#handleUpdateTag(CompoundTag tag)
```
Again, this is pretty simple, the first method collects the data that should be sent to the client,
while the second one processes that data. If your `BlockEntity` doesn't contain much data, you might be able to use the methods out of the [Storing Data within your `BlockEntity`][storing-data] section.

!!! important
    Synchronizing excessive/useless data for block entities can lead to network congestion. You should optimize your network usage by sending only the information the client needs when the client needs it. For instance, it is more often than not unnecessary to send the inventory of a block entity in the update tag, as this can be synchronized via its `AbstractContainerMenu`.

### Synchronizing on Block Update

This method is a bit more complicated, but again you just need to override two or three methods.
Here is a tiny example implementation of it:
```java
@Override
public CompoundTag getUpdateTag() {
  CompoundTag tag = new CompoundTag();
  //Write your data into the tag
  return tag;
}

@Override
public Packet<ClientGamePacketListener> getUpdatePacket() {
  // Will get tag from #getUpdateTag
  return ClientboundBlockEntityDataPacket.create(this);
}

// Can override IForgeBlockEntity#onDataPacket. By default, this will defer to the #load.
```
The static constructors `ClientboundBlockEntityDataPacket#create` takes:

* The `BlockEntity`.
* An optional function to get the `CompoundTag` from the `BlockEntity`. By default, this uses `BlockEntity#getUpdateTag`.

Now, to send the packet, an update notification must be given on the server.
```java
Level#sendBlockUpdated(BlockPos pos, BlockState oldState, BlockState newState, int flags)
```
The `pos` should be your `BlockEntity`'s position.
For `oldState` and `newState`, you can pass the current `BlockState` at that position.
`flags` is a bitmask that should contain `2`, which will sync the changes to the client. See `Block` for more info as well as the rest of the flags. The flag `2` is equivalent to `Block#UPDATE_CLIENTS`.

### Synchronizing Using a Custom Network Message

This way of synchronizing is probably the most complicated but is usually the most optimized,
as you can make sure that only the data you need to be synchronized is actually synchronized.
You should first check out the [`Networking`][networking] section and especially [`SimpleImpl`][simple_impl] before attempting this.
Once you've created your custom network message, you can send it to all users that have the `BlockEntity` loaded with `SimpleChannel#send(PacketDistributor$PacketTarget, MSG)`.

!!! warning
    It is important that you do safety checks, the `BlockEntity` might already be destroyed/replaced when the message arrives at the player! You should also check if the chunk is loaded (`Level#hasChunkAt(BlockPos)`).

[registration]: ../concepts/registries.md#methods-for-registering
[storing-data]: #storing-data-within-your-blockentity
[networking]: ../networking/index.md
[simple_impl]: ../networking/simpleimpl.md
