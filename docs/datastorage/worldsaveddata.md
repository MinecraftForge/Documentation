World Saved Data
================

The World Saved Data system allows attaching data to worlds, either per dimension, or global.

Declaration
-----------

The basis of the system is the `WorldSavedData` class. This class provides the basic methods used to manage the data:

* `writeToNBT`: Allows the implementation to write data to the world.
* `readFromNBT`: Allows the implementation to load previously saved data.
* `markDirty`: This method is not overridden by the implementation. Instead, it must be called after changing the data, to notify Minecraft that there are changes that need to be written. If not called, the existing data will be kept instead, and `writeToNBT` will not get called.

An implementation will override this class, and instances of this implementation will be attached to the `World` objects, ready to store any required data.

A basic skeleton may look like this:

```Java
public class ExampleWorldSavedData extends WorldSavedData {
  private static final String DATA_NAME = MODID + "_ExampleData";

  // Required constructors
  public ExampleWorldSavedData() {
    super(DATA_NAME);
  }
  public ExampleWorldSavedData(String s) {
    super(s);
  }

  // WorldSavedData methods
}
```

Registration and Usage
----------------------

The WorldSavedData is loaded and/or attached to the world on demand. A good practice is to create a static get method that will load the data, and if not present, attach a new instance.

There are two ways to attach the data: per dimension, or globally. Global data will be attached to a shared map, that will be obtainable from any instance of the World class, while per-world data will not be shared across dimensions. Keep in mind the separation between client and server, as they get separate instances of global data, so if data is needed on both sides, manual synchronization will be required.

In code, these storage locations are represented by two instances of `MapStorage` present in the World object. The global data is obtained from `World#getMapStorage()`, while the per-world map is obtained from `World#getPerWorldStorage()`.

The existing data can be obtained using `MapStorage#getOrLoadData`, and new data can be attached using `MapStorage#setData`.

```Java
public static ExampleWorldSavedData get(World world) {
  // The IS_GLOBAL constant is there for clarity, and should be simplified into the right branch.
  MapStorage storage = IS_GLOBAL ? world.getMapStorage() : world.getPerWorldStorage();
  ExampleWorldSavedData instance = (ExampleWorldSavedData) storage.getOrLoadData(ExampleWorldSavedData.class, DATA_NAME);

  if (instance == null) {
    instance = new ExampleWorldSavedData();
    storage.setData(DATA_NAME, instance);
  }
  return instance;
}
```
