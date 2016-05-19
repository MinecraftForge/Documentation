Extended Entity Properties
==========================

Extended entity properties allow attaching data to entities.

!!!warning

    This system has been *deprecated* in favor of the [Capability](capabilities.md) system.

Declaration and Registration
----------------------------

The basis of the EEPs is the `IExtendedEntityProperties` interface. This interface provides the basic methods required for managing the extended data:

* `init`: Allows the implementation to have knowledge about the entity it's attached to, and the world this entity is loaded into.
* `saveNBTData`: Allows the implementation to store data in the save file, to be loaded when the entity gets loaded into the world.
* `loadNBTData`: Allows the implementation to read the previously saved data for this entity.

An implementation will have a class implementing this interface, and instances of this class will be attached to the entities, ready to store any required data.

The implementation will need to make use of events in order to attach the IEEP to entities, and optionally any other required features. To help with encapsulation, you may want to create an inner class for handling those events. In the example, I created a `register()` method to help with that.

A basic skeleton to get started:

```java
public class ExampleEntityProperty implements IExtendedEntityProperties {
  public static final String PROP_NAME = ExampleMod.MODID + "_ExampleEntityData";

  public static void register() {
    MinecraftForge.EVENT_BUS.register(new Handler());
  }

  // IExtendedEntityProperties methods go here

  public static class Handler {
    // Event handlers will go here
  }
}
```

Attaching the Implementation to Entities
----------------------------------------

In order to attach the extended property to an entity, it is done by handling the `EntityEvent.EntityConstructing` event, and if the entity is of interest, using the `Entity#registerExtendedProperties` method.

In order to uniquely identify your property and avoid duplication, the method takes a string parameter with an identifier for the property. A good practice is to include the modid in this string, so that it will not collide with other mods.

!!!warning

    If the same property identifier is added twice, Forge will append a number to it, and return this modified identifier from the `registerExtendedProperties` method. If you don't want that to happen, you can use `Entity#getExtendedProperties` to check if an IEEP with that name was already added.

In order to handle this event, you could do something like this:

```java
@SubscribeEvent
public void entityConstruct(EntityEvent.EntityConstructing e) {
  if (e.entity instanceof EntityPlayer) {
    if (e.entity.getExtendedProperties(PROP_NAME) == null) {
      e.entity.registerExtendedProperties(PROP_NAME, new ExampleEntityProperty());
    }
  }
}
```

Making Use of the Implementation
--------------------------------

To make use of the extended data, the instance of the IEEP implementation has to be obtained from the Entity, and because the entity could have been unloaded or may have changed dimensions, it is not safe to cache the references.

To obtain the IEEP reference, one would use `Entity#getExtendedProperties`, with the same property ID specified on registration. The return value, if not `null`, is the instance of `IExtendedEntityProperties` added during entity construction.

A good idea is to create a static `get` method in your IEEP implementation, that will automatically obtain the instance, and cast it to your implementation class. It can be as simple as:

```java
public static ExampleEntityProperty get(Entity p) {
  return (ExampleEntityProperty) p.getExtendedProperties(PROP_NAME);
}
```

Saving and Loading Data from NBT
--------------------------------

Forge allows all IEEPs attached to an entity to save and load themselves. However, keep in mind that the NBT tag provided in the `saveNBTData` and `loadNBTData` methods is a global tag for the entity, and may contain data for other IEEPs, along with all the data from the entity itself.

There are some cases where an IEEP may benefit from accessing this global data, but for the most common use cases, it is important to avoid colliding with existing data, preferably by storing the data in a nested tag, using an unique name for it (such as the name used to identify the IEEP).

Your code may look a bit like this:

```java
@Override
public void saveNBTData(NBTTagCompound compound) {
  NBTTagCompound propertyData = new NBTTagCompound();

  // Write data to propertyData

  compound.setTag(PROP_NAME, propertyData);
}

@Override
public void loadNBTData(NBTTagCompound compound) {
  if(compound.hasKey(PROP_NAME, Constants.NBT.TAG_COMPOUND)) {
    NBTTagCompound propertyData = compound.getCompoundTag(PROP_NAME);

    // Read data from propertyData
  }
}
```

Synchronizing Data with Clients
-------------------------------

By default, the entity data is not sent to clients. In order to change this, the mods have to manage their own synchronization code using packets.

There are three different situation in which you may want to send synchronization packets, all of them optional:

1. When the entity spawns in the world, you may want to share the initialization-assigned values with the clients.
2. When the stored data changes, you may want to notify some or all of the watching clients.
3. When a new client starts viewing the entity, you may want to notify it of the existing data.

Refer to the [Networking](../networking/index.md) page for more information on implementing the network packets.

For example:

```java
private void dataChanged() {
  if(!world.isRemote) {
    EntityTracker tracker = ((WorldServer)world).getEntityTracker();
    ExampleEntityPropertySync message = new ExampleEntityPropertySync(this);

    for (EntityPlayer entityPlayer : tracker.getTrackingPlayers(entity)) {
      ExampleMod.channel.sendTo(message, (EntityPlayerMP)entityPlayer);
    }
  }
}

private void entitySpawned() {
  dataChanged();
}

private void playerStartedTracking(EntityPlayer entityPlayer) {
  ExampleMod.channel.sendTo(new ExampleEntityPropertySync(this), (EntityPlayerMP)entityPlayer);
}
```

And the corresponding event handlers:

```java
@SubscribeEvent
public void entityJoinWorld(EntityJoinWorldEvent e) {
  ExampleEntityProperty data = ExampleEntityProperty.get(e.entity);
  if (data != null)
    data.entitySpawned();
}

@SubscribeEvent
public void playerStartedTracking(PlayerEvent.StartTracking e) {
  ExampleEntityProperty data = ExampleEntityProperty.get(e.target);
  if (data != null)
    data.playerStartedTracking(e.entityPlayer);
}
```

Persisting across Player Deaths
-------------------------------

By default, the entity data does not persist on death. In order to change this, the data has to be manually copied when the player entity is cloned during the respawn process.

This can be done by handling the `PlayerEvent.Clone` event. In this event, the `wasDead` field can be used to distinguish between respawning after death, and returning from the End. This is important because the data will already exist, so care has to be taken to not duplicate values when returning from the End dimension.

```java
@SubscribeEvent
public void onClonePlayer(PlayerEvent.Clone e) {
  if(e.wasDeath) {
    NBTTagCompound compound = new NBTTagCompound();
    ExampleEntityProperty.get(e.original).saveNBTData(compound);
    ExampleEntityProperty.get(e.entityPlayer).loadNBTData(compound);
  }
}
```
