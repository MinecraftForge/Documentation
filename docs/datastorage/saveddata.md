Saved Data
==========

The Saved Data (SD) system is an alternative to level capabilities that can attach data per level.

Declaration
-----------

Each SD implementation must subtype the `SavedData` class. There are two important methods to be aware of:

* `save`: Allows the implementation to write NBT data to the level.
* `setDirty`: A method that must be called after changing the data, to notify the game that there are changes that need to be written. If not called, `#save` will not get called and the existing data will persist.

Attaching to a Level
----------------------

Any `SavedData` is loaded and/or attached to a level dynamically. As such, if one is never created on a level, then it will not exist.

`SavedData`s are created and loaded from the `DimensionDataStorage`, which can be accessed by either `ServerChunkCache#getDataStorage` or `ServerLevel#getDataStorage`. From there, you can get or create an instance of your SD by calling `DimensionDataStorage#computeIfAbsent`. This will attempt to get the current instance of the SD if present or create a new one and load all available data.

`DimensionDataStorage#computeIfAbsent` takes in three arguments: a function to load NBT data into a SD and return it, a supplier to construct a new instance of the SD, and the name of the `.dat` file stored within the `data` folder for the implemented level.

For example, if a SD was named "example" within the Nether, then a file would be created at `./<level_folder>/DIM-1/data/example.dat` and would be implemented like so:

```java
// In some class
public ExampleSavedData create() {
  return new ExampleSavedData();
}

public ExampleSavedData load(CompoundTag tag) {
  ExampleSavedData data = this.create();
  // Load saved data
  return data;
}

// In some method within the class
netherDataStorage.computeIfAbsent(this::load, this::create, "example");
```

To persist a SD across levels, a SD should be attached to the Overworld, which can be obtained from `MinecraftServer#overworld`. The Overworld is the only dimension that is never fully unloaded and as such makes it perfect to store multi-level data on.
