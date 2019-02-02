# TileEntities

Tile Entities are like simplified Entities, that are bound to a Block.
They are used to store dynamic data, execute tick based tasks and for dynamic rendering.
Some examples from vanilla Minecraft would be: handling of inventories (chests), smelting logic on furnaces, or area effects for beacons.
More advanced examples exist in mods, such as quarries, sorting machines, pipes, and displays.

!!! note
    `TileEntities` aren't a solution for everything and they can cause lag when used wrongly.
    When possible, try to avoid them.

## Creating a `TileEntity`

In order to create a `TileEntity` you need to extend the `TileEntity` class.
To register it, listen for the appropriate registry event and create a `TileEntityType`:
```Java
@SubscribeEvent
public static void registerTE(RegistryEvent.Register<TileEntityType> evt) {
  TileEntityType type = TileEntityType.Builder.create(<factory>).build(null)
  type.setRegistryName("mymod", "myte");
  evt.getRegistry().register(type);
}
```

## Attaching a `TileEntity` to a `Block`

To attach your new `TileEntity` to a `Block` you need to override 2 (two) methods within the Block class.
```JAVA
IForgeBlock#hasTileEntity(IBlockstate state)

IForgeBlock#createTileEntity(World world, IBlockState state)
```
Using the parameters you can choose if the block should have a `TileEntity` or not.
Usually you will return `true` in the first method and a new instance of your `TileEntity` in the second method.

## Storing Data within your `TileEntity`

In order to save data, override the following two methods
```JAVA
TileEntity#write(NBTTagCompound nbt)

TileEntity#read(NBTTagCompound nbt)
```
These methods are called whenever the `Chunk` containing the `TileEntity` gets loaded from/saved to NBT.
Use them to read and write to the fields in your tile entity class.

!!! note

		Whenever your data changes you need to call `TileEntity#markDirty()`, otherwise the `Chunk` containing your `TileEntity` might be skipped while the world is saved.

!!! important

		It is important that you call the super methods!
    The tag names `id`, `x`, `y`, `z`, `ForgeData` and `ForgeCaps` are reserved by the super methods.

## Ticking `TileEntities`

If you need a ticking `TileEntity`, for example to keep track of the progress during a smelting process, you need to add the `net.minecraft.util.ITickable` interface to your `TileEntity`.
Now you can implement all your calculations within
```JAVA
ITickable#update()
```

!!! note
    This method is called each tick, therefore you should avoid having complicated calculations in here.
    If possible, you should make more complex calculations just every X ticks.
    (The amount of ticks in a second may be lower then 20 (twenty) but won't be higher)

## Synchronizing the Data to the Client

There are 3 (three) ways of syncing data to the client.
Synchronizing on chunk load, synchronizing on block updates and synchronizing with a custom network message.

### Synchronizing on chunk load

For this you need to override
```JAVA
TileEntity#getUpdateTag()

IForgeTileEntity#handleUpdateTag(NBTTagCompound nbt)
```
Again, this is pretty simple, the first method collects the data that should be send to the client,
while the second one processes that data. If your `TileEntity` doesn't contain much data you might be able to use the methods out of the `Storing Data within your TileEntity` section.

!!! important

    Synchronizing excessive/useless data for TileEntities can lead to network congestion. You should optimize your network usage by sending only the information the client needs when the client needs it. For instance, it is more often that not unnecessary to send the inventory of a tile entity in the update tag, as this can be synchronized via its GUI.

### Synchronizing on block update

This method is a bit more complicated, but again you just need to override 2 methods.
Here is a tiny example implementation of it
```JAVA
@Override
public SPacketUpdateTileEntity getUpdatePacket(){
    NBTTagCompound nbtTag = new NBTTagCompound();
    //Write your data into the nbtTag
    return new SPacketUpdateTileEntity(getPos(), 1, nbtTag);
}

@Override
public void onDataPacket(NetworkManager net, SPacketUpdateTileEntity pkt){
    NBTTagCompound tag = pkt.getNbtCompound();
    //Handle your Data
}
```
The Constructor of `SPacketUpdateTileEntity` takes:

* The position of your `TileEntity`.
* An ID, though it isn't really used besides by Vanilla, therefore you can just put a 1 in there.
* An `NBTTagCompound` which should contain your data.

Additionally to this you now need to cause a "BlockUpdate" on the Client.
```JAVA
World#notifyBlockUpdate(BlockPos pos, IBlockState oldState, IBlockState newState, int flags)
```
The `pos` should be your TileEntitiy's position. For `oldState` and `newState` you can pass the current BlockState at that position.
The `flags`are a bitmask and should contain 2, which will sync the changes to the client.

### Synchronizing using a custom network message

This way of synchronizing is probably the most complicated one, but is usually also the most optimized one,
as you can make sure that only the data you need to be synchronized is actually synchronized.
You should first check out the [`Networking`][networking] section and especially [`SimpleImpl`][simple_impl] before attempting this.
Once you've created your custom network message, you can send it to all users that have the `TileEntity` loaded with:
```JAVA
SimpleNetworkWrapper#sendToAllTracking(IMessage, NetworkRegistry.TargetPoint)
```

!!! warning

    It is important that you do safety checks, the TileEntity might already be destroyed/replaced when the message arrives at the player!
    You should also check if the chunk is loaded (`World#isBlockLoaded(BlockPos)`)

[networking]: ../networking/index.md
[simple_impl]: ../networking/simpleimpl.md
