The DataFixer System
====================

The DataFixer system is provided by vanilla, and allows for fine-grained migrations and adjustments to the world format. Forge expands this system to allow mods to register and use their own fixers.

What would I use the DataFixer for?
-----------------------------------
Here are some things vanilla uses datafixers for:

* Renaming the old `HealF` health tag to `Health` (1.9)
* Replacing all integer ID's in ItemStacks with registry names (~ 1.9)
* Renaming the ID's of all entities and tile entities from UpperCamel names like `Blaze` to proper registry names like `minecraft:blaze` (1.11)
* Splitting entities that were variants of each other to separate ID's, e.g. `Elder` tag on `minecraft:guardian` -> `minecraft:elder_guardian` (1.11)
* Flattening all meta-variants of an Item into separate ID's, e.g. `minecraft:wool` meta 0 -> `minecraft:white_wool` (1.13)

As you can see, this can be used in a very powerful manner to implement any NBT save format fixes you would like to make, without resorting to hacks such as checking for the old tag every tick and replacing it with a new tag.

Terminology and Interfaces
--------------------------

### IFixType
This interface represents keys to identify unique situations where NBT tags should be fixed. Its primary implementation is the enum `FixTypes`.
Example values: `ITEM_INSTANCE` (an individual ItemStack's NBT tag), `CHUNK` (the entire NBT tag of a Chunk), `BLOCK_ENTITY` (the entire NBT tag of a Tile Entity)

### DataFixer
This is the main entry point for invoking the fixer system, and it also manages registration of fixes and walkers.

### IFixableData
This interface represents a single "fix" you would like to make, such as one of the examples listed above.
Fixes are registered to and only run for one `IFixType`.

The interface contains two methods:
	* `int getVersion()`: This method returns the current save format version of your mod. When the system sees data that has an older version than the result of this method, it will run the fixer.
	* `NBTTagCompound fixTagCompound(NBTTagCompound compound)`: Accepts the full NBT tag of the requested `IFixType` (i.e. the entire ItemStack, Chunk, or TileEntity), returns the fixed version

### IDataWalker
This interface is registered to and only run for one `IFixType`, and essentially represents the ability to discover other `IFixType`'s within the tag.
For example, a `TileEntityChest` is of fix type `BLOCK_ENTITY`, but has 27 stacks of contents which are of fix type `ITEM_INSTANCE`. Therefore, an `IDataWalker` is needed to find those stacks and fix them as well.

It has one method:
	* `NBTTagCompound process(IDataFixer fixer, NBTTagCompound compound, int version)`: Accepts the full NBT tag of the requested `IFixType`, looks for nested `IFixType`'s, and fixes them recursively using `fixer.process()`. 
For the example above, the walker would look through `compound` for each ItemStack, and then call `fixer.process(FixTypes.ITEM_INSTANCE, stackNBT)` on it, which will recursively invoke all ITEM_INSTANCE fixers and walkers.

Registering Your Own Fixes
--------------------------

### Registering a fix
1. Obtain the `DataFixer` using `FMLCommonHandler.instance().getDataFixer()`.
2. Call `fixer.init("modid", modDataVersion)`, and save the `ModFixs` return value.
3. Call `ModFixs.registerFix(IFixType type, IFixableData fixer)` to register your fix.

### Registering a walker
1. Obtain the `DataFixer` using `FMLCommonHandler.instance().getDataFixer()`
2. Call `fixer.registerWalker(FixTypes type, IDataWalker walker)` to register your walker.

Fixer Case Study: Flattening
----------------------------

An example use case of a fixer is to implement the [flattening][], where different items formerly expressed as metadata variants of a single ID are being split out into their own ID's, e.g. `minecraft:dye` meta 0 -> `minecraft:black_dye`. This case is not easily covered by FML's `MissingMappingsEvent`, since that only supports wholesale remapping of *all* metadata variants of the old item to the same meta of the new item.
This issue would be resolved in the following manner:

```Java
IFixableData flattener = new IFixableData() {
	private String getNewID(String oldID, int meta) { /* omitted */ }

	@Override
	public int getFixVersion() {
		return 5; // run this fixer on all discovered ItemStacks with lower version than 5
	}

	@Override
	public NBTTagCompound fixTagCompound(NBTTagCompound compound) {
		// Convert to new ID
		compound.setString(getNewID(compound.getString("id"), compound.getInteger("Damage")));
	}
};

// Register to ITEM_INSTANCE so the walker is called for all encountered ItemStacks
ModFixs modfixes = FMLCommonHandler.instance().getDataFixer().init("mymod", 5);
modfixes.registerFix(FixTypes.ITEM_INSTANCE, flattener);
```

Walker Case Study: Dolly
------------------------

Mods must take care to call the Fixer system whenever they hold onto NBT data of vanilla or other mods.
For example, consider a dolly item that allows one to store any Tile Entity into itself, under the tag "StoredTE".
If the owner of that Tile Entity registers a `FixTypes.BLOCK_ENTITY` fixer to run on that Tile Entity, the DataFixer system is not aware that your dolly item has a Tile Entity tag stored inside of itself and thus the dolly is left with an invalid tag inside of it.
This issue would be resolved in the following manner:

```Java
IDataWalker dollyWalker = new IDataWalker() {
	@Override
	public NBTTagCompound process(IDataFixer fixer, NBTTagCompound compound, int versionIn) {
		// hasKey checks omitted here, get the stored TE
		NBTTagCompound storedTE = compound.getCompoundTag("tag").getCompoundTag("StoredTE");
		
		// walk and fix the stored tile entity
		fixer.process(FixTypes.BLOCK_ENTITY, storedTE);
	}
};

// Register to ITEM_INSTANCE so the walker is called for all encountered ItemStacks
FMLCommonHandler.instance().getDataFixer().registerWalker(FixTypes.ITEM_INSTANCE, dollyWalker);
```

[flattening]: https://minecraft.gamepedia.com/1.13/Flattening
