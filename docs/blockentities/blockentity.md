# BlockEntities

`BlockEntities` are like simplified `Entities` that are bound to a Block.
They are used to store dynamic data, execute tick based tasks, and dynamic rendering.
Some examples from vanilla Minecraft would be handling of inventories on chests, smelting logic on furnaces, or area effects on beacons.
More advanced examples exist in mods, such as quarries, sorting machines, pipes, and displays.

!!! note
    `BlockEntities` aren't a solution for everything and they can cause lag when used wrongly.
    When possible, try to avoid them.

## Creating a `BlockEntity`

In order to create a `BlockEntity`, you need to extend the `BlockEntity` class.
To register it, listen for the appropriate registry event and create a `BlockEntityType`:
```java
@SubscribeEvent
public static void registerTE(RegistryEvent.Register<BlockEntityType<?>> evt) {
  BlockEntityType<?> type = BlockEntityType.Builder.of(supplier, validBlocks).build(null);
  type.setRegistryName("mymod", "mybe");
  evt.getRegistry().register(type);
}
```
In this example, `supplier` is a `BlockEntityType$BlockEntitySupplier` that creates a new instance of your BlockEntity. A method reference or a lambda is commonly used. The variable `validBlocks` is one or more blocks (`BlockEntityType$Builder#of` is varargs) that the block entity can exist for.

## Attaching a `BlockEntity` to a `Block`

To attach your new `BlockEntity` to a `Block`, the `EntityBlock` interface must be implemented on your `Block` subclass. The method `EntityBlock#newBlockEntity(BlockPos, BlockState)` must be implemented and return a new instance of your `BlockEntity`.

## Storing Data within your `BlockEntity`

In order to save data, override the following two methods:
```java
BlockEntity#save(CompoundTag tag)

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
    This method is called each tick; therefore, you should avoid having complicated calculations in here.
    If possible, you should make more complex calculations every X ticks.
    (The amount of ticks in a second may be lower then 20 (twenty) but won't be higher)

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

This method is a bit more complicated, but again you just need to override two methods.
Here is a tiny example implementation of it:
```java
@Override
public ClientboundBlockEntityDataPacket getUpdatePacket(){
    CompoundTag tag = new CompoundTag();
    //Write your data into the tag
    return new ClientboundBlockEntityDataPacket(getBlockPos(), -1, tag);
}

@Override
public void onDataPacket(Connection connection, ClientboundBlockEntityDataPacket pkt){
    CompoundTag tag = pkt.getTag();
    //Handle your Data
}
```
The Constructor of `ClientboundBlockEntityDataPacket` takes:

* The position of your `BlockEntity`.
* An id, though it isn't really used besides by Vanilla; therefore, you can just put a -1 in there.
* A `CompoundTag` which should contain your data.

Now, to send the packet, an update notification must be given on the server.
```java
Level#sendBlockUpdated(BlockPos pos, BlockState oldState, BlockState newState, int flags)
```
The `pos` should be your `BlockEntity`'s position.
For `oldState` and `newState`, you can pass the current `BlockState` at that position.
`flags` is a bitmask that should contain `2`, which will sync the changes to the client. See `Constants$BlockFlags` for more info as well as the rest of the flags. The flag `2` is equivalent to `Constants$BlockFlags#BLOCK_UPDATE`.

### Synchronizing Using a Custom Network Message

This way of synchronizing is probably the most complicated but is usually the most optimized,
as you can make sure that only the data you need to be synchronized is actually synchronized.
You should first check out the [`Networking`][networking] section and especially [`SimpleImpl`][simple_impl] before attempting this.
Once you've created your custom network message, you can send it to all users that have the `BlockEntity` loaded with `SimpleChannel#send(PacketDistributor$PacketTarget, MSG)`.

!!! warning

    It is important that you do safety checks, the `BlockEntity` might already be destroyed/replaced when the message arrives at the player!
    You should also check if the chunk is loaded (`Level#hasChunkAt(BlockPos)`).

[storing-data]: #storing-data-within-your-blockentity
[networking]: ../networking/index.md
[simple_impl]: ../networking/simpleimpl.md
