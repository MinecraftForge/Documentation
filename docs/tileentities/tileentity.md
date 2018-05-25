# TileEntities

This is often used by vanilla Minecraft to handle inventories on chests, smelting logic on furances, or area effects for beacons. 
More advanced versions exist in mods such as quaries, sorting machines, pipes, and displays
!!! note
	`TileEntities` aren't a solution for everything, their loading distance is limited, and they can cause lag when used in large amounts.
	When possible, try to avoid them.

## Creating a `TileEntity`
In order to create a `TileEntity` you need to extend the `TileEntity` class.
It is important that your `TileEntity` has a default constructor, so that Minecraft can properly load it.
After you've created your class, you need to register the `TileEntity`. For this you need to call 
```JAVA
	GamerRegistry#registerTileEntity(Class<? extends TileEntity> tileEntityClass, ResourceLocation key)
```
Where the first parameter is simply your TileEntity class and the second the registry name of your TileEntity.

!!! note
	The method to register a `TileEntity` is using a `String` instead of a `ResourceLocation` before Forge version `14.23.3.2694`
	You should still use the `ResourceLocation` format `modid:tileentity` though.
	Not using this format will result in your entitiy being called `minecraft:tileentity`

## Attaching a `TileEntity` to a `Block`
To attach your new `TileEntity` to a `Block` you need to override 2 (two) methods within the Block class.
```JAVA
	Block#hasTileEntity(IBlockstate state)

	Block#createTileEntity(World world, IBlockState state)
```
Using the parameters you can choose if the block should have a `TileEntity` or not.
But usually you will return `true` in the first method and a new instance of your `TileEntity` in the second method.

At this point the `TileEntity`can be used for Rendering.

## Storing Data within your `TileEntity`
In order to save data, create the following two methods
```JAVA
	TileEntity#writeToNBT(NBTTagCompound nbt):NBTTagCompound

	TileEntity#readFromNBT(NBTTagCompound nbt)
```
This methods are called whenever the `TileEntity` gets (un-)loaded, you don't use them to access your data.
All your data should be fields within you class, and be (de-)serialized through this methods.

Whenever your data changes you need to call ```TileEntity#markDirty()```, otherwise your `TileEntity` might be skipped while saving.

!!! note
	It is important that you call the super methods!
	Due to this following tag names are already occupied `id`,`x`,`y`,`z`,`ForgeData`,`ForgeCaps`.

## Keeping a `TileEntity` through changing `BlockStates`
There might be situations in which you need to change your `BlockState`, an example for this is the vanilla furnace,
which changes its state from `lit=false` to `lit=true` when fuel and something smetlable is inside.
Achieving this is rather simple, by overriding following method
```JAVA
	TileEntity#shouldRefresh(World world, BlockPos pos, IBlockState oldState, IBlockState newSate)#boolean
```
!!! note
	You should actually check the `BlockStates` and not just return `false` in order to prevent unwanted behavior and bugs.
    
## Ticking `TileEntities`
If you need a ticking `TileEntity` for example to keep track of the progress during a smelting process.
You need to add the `ITickable` interface to your `TileEntity`.
Now you can implement all your calculations within
```JAVA
	ITickable#update()
```
!!! note
	This method is called each tick (usually 20 (twenty) times a second) you should avoid having complicated calculations in here.
	And if possible, you should make more complex calculations just every X ticks.
	(The amount of ticks in a second may be lower then 20 (twenty) but won't be higher)
    
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