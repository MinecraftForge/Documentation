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

