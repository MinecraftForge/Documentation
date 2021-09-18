World Saved Data
================

The World Saved Data (WSD) system is an alternative to world capabilities that can attach data per world.

Declaration
-----------

Each WSD implementation must subtype the `WorldSavedData` class. There are three important methods to be aware of:

* `save`: Allows the implementation to write NBT data to the world.
* `load`: Allows the implementation to read previously saved NBT data.
* `setDirty`: A method that must be called after changing the data, to notify the game that there are changes that need to be written. If not called, `#save` will not get called and the existing data will persist.

The constructor of the class also requires a `String`. This is the name of the `.dat` file stored within the `data` folder for the implemented world. For example, if a WSD was named "example" within the Nether, then a file would be created at `./<level_folder>/DIM-1/data/example.dat`.

Attaching to a World
----------------------

Any `WorldSavedData` is loaded and/or attached to a world dynamically. As such, if one is never created on a world, then it will not exist. 

`WorldSavedData`s are created and loaded from the `DimensionSavedDataManager`, which can be accessed by either `ServerChunkProvider#getDataStorage` or `ServerWorld#getChunkSource`. From there, you can get or create an instance of your WSD by calling `DimensionSavedDataManager#computeIfAbsent`. This will attempt to get the current instance of the WSD if present or create a new one and load all available data.

To persist a WSD across worlds, a WSD should be attached to the Overworld dimension, which can be obtained from `MinecraftServer#overworld`. The Overworld is the only dimension that is never fully unloaded and as such makes it perfect to store multi-world data on.
