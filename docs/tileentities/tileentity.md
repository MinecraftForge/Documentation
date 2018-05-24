# TileEntities

A `TileEntity` is usually a way to store additional data within a Block.
One example for this would be the Chest or the Furnace they booth store Items, and the furnace event a little bit more Data.

## Creating a `TileEntity`
In order to create a `TileEntity` you need to extend the `TileEntity` class.
After you've created your class, you need to register the `TileEntity`. For this you need to call 
```JAVA
	GamerRegistry#registerTileEntity(Class<? extends TileEntity> tileEntityClass, ResourceLocation key)
```
Where the first parameter is simply your TileEntity class and the second the registry name of your TileEntity.

!!! note
	The method to register a `TileEntity` is using a `String` instead of a `ResourceLocation` before Forge version `14.23.3.2694`
	You should still use the `ResourceLocation` format `modid:tileentity` though.

## Attaching a `TileEntity` to a `Block`
To attach your new `TileEntity` to a `Block` you need to override 2 (two) methods within the Block class.
```JAVA
	Block#hasTileEntity(IBlockstate state)

	Block#createTileEntity(World world, IBlockState state)
```
Using the parameters you can choose if the block should have a `TileEntity` or not.
But usually you will return `true` in the first method and a new instance of your `TileEntity` in the second method.

## Storing Data within your `TileEntity`
After the steps above are done, you might want to actually use your `TileEntity`, usually by storing some data within it.

In case that the Data is not supposed to be stored all you need to do is to create a field within your `TileEntity` class.
But in case you want to keep the data across world loads, you need to implement 2 (two) methods within your class.
```JAVA
	TileEntity#writeToNBT(NBTTagCompound nbt):NBTTagCompound

	TileEntity#readFromNBT(NBTTagCompound nbt)
```
Their names explain them pretty good. Though there is one more thing that you need to do, so the data is actually saved.
Whenever your data changes you need to call ```TileEntity#markDirty()```, otherwise your `TileEntity` might be skipped while saving.

!!! note
	It is important that you call the super methods!
	Due to this following tag names are already occupied `id`,`x`,`y`,`z`,`ForgeData`,`ForgeCaps`.

## Keeping a `TileEntity` trough changing `BlockStates`
There might be situations in which you need to change your `BlockState`, an example for this is the vanilla furnace.
Achieving this is rather simple, by overriding following method
```JAVA
	TileEntity#shouldRefresh(World world, BlockPos pos, IBlockState oldState, IBlockState newSate)#boolean
```
!!! note
	You should actually check the `BlockStates` and not just return `false` in order to prevent unwanted behavior and bugs.
    
## Syncing the Data to the Client
There are 2 (two) ways of syncing data to the client.
* Syncing on World Load
* Syncing on changes

For the first one you need to override
```JAVA
	TileEntity#getUpdateTag():NBTTagCompound

	TileEntity#handleUpdateTag(NBTTagCompound nbt)
```
Again this is pretty simple, the first method collects the data that should be send to the client.
And the second one processes that data. If your `TileEntity` doesn't contain much data you might be able to use the methods out of the `Storing Data within your TileEntity` section.
!!! note
	Inventories don't need to be synced here!
	In most cases you shouldn't sync more then you really need.

The second method is a bit more Complicated. But again you just need to override 2 methods.
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
The Constructor of `SPacketUpdateTileEntity` takes the position of your `TileEntity`, an ID and a `NBTTagCompound`.
The ID isn't really used besides by Vanilla, therefore you can just put a 1 in there.
Additionally to this you now need to cause a "BlockUpdate" on the Client.
```JAVA
	World#notifyBlockUpdate(BlockPos pos, IBlockState oldState, IBlockState newState, int flags)
```
The `pos`should again be your `TileEntities` position, for `oldState` and `newState` you can pass the current `BlockState` at that position and finally for the flag you should enter 2 (syncing the changes to the client)