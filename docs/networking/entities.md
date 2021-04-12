Entities
========

In addition to regular network messages, there are various other systems provided to handle synchronizing entity data.

Spawn Data
----------

In general, the spawning of modded entities is handled separately, by Forge.

!!! note
    This means that simply extending a vanilla entity class may not inherit all its behavior here. You may need to implement certain vanilla behaviors yourself.

You can add extra data to the spawn packet Forge sends by implementing the following interface.

### IEntityAdditionalSpawnData

If your entity has data that is needed on the client, but doesn't change over time, then it can be added to the entity spawn packet using this interface. `writeSpawnData()` and `readSpawnData()` control how the data should be en/decoded to/from the network buffer.

Dynamic Data
------------

### Data Parameters

This is the main vanilla system for synchronizing entity data from the server to the client. As such, a number of vanilla examples are available to refer to.

Firstly you need a `DataParameter<T>` for the data you wish to keep synchronized. This should be stored as a static final field in your entity class, obtained by calling `EntityDataManager.createKey()` and passing the entity class and a serializer for that type of data. The available serializer implementations can be found as static constants within the `DataSerializers` class.

!!! warning
    You should __only__ create data parameters for your own entities, _within that entity's class_.
    Adding parameters to entities you do not control can cause the IDs used to send that data over the network to become desynchronized, causing difficult to debug crashes.

Then, override `registerData()` and call `this.dataManager.register()` for each of your data parameters, passing the parameter and an initial value to use. Remember to always call `super.registerData()` first!

You can then get and set these values via your entity's `dataManager` instance. Changes made will be synchronized to the client automatically.

