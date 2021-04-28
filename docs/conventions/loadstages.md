Loading Stages
==============

The Forge loading process has four main phases. All of these events shown are fired on the mod-specific eventbus, *not* the global Forge event bus `MinecraftForge#EVENT_BUS`.
Event handlers should be [registered][regevents]:

```java
@Mod("mymod")
public class MyMod {
  public MyMod() {
    FMLModLoadingContext.get().getModEventBus().registerListener(this::commonSetup);
  } 
  
  private void commonSetup(FMLCommonSetupEvent evt) { ... }
}
```

!!! warning
    All four of the below events are called for all mods in parallel, meaning they are all a subclass of `ParallelDispatchEvent`. That is, all mods will concurrently receive common setup, FML will wait for 
    them all to finish, then all mods will concurrently receive sided setup, and so forth.
    Mods *must* take care to be thread safe, especially when calling other mods' APIs and accessing Vanilla systems, which are not thread safe in general. This can be done by calling `#enqueueWork` on the event parameter.


## Setup

`FMLCommonSetupEvent` is the first to fire early in the Minecraft starting process.
[Registry events][registering] are fired before this event, so you can expect all registry objects to be valid by the time this runs.
Common actions to perform in common setup are:

  * Utilizing the common config data
  * Registering [Capabilities][capabilities]

## Sided Setup

`FMLClientSetupEvent` and `FMLDedicatedServerSetupEvent` are fired after common setup, and are where physical, side-specific initialization should occur.
Common actions to perform here are registering client-side only things such as key bindings.

## IMC Enqueue

Here, mods should send messages to all other mods they are interested in integrating with, using `InterModComms#sendTo`.

## IMC Process

Here, mods should process all the messages they have received from other mods and set up integrations appropriately. A mod may retrieve the messages that have been sent to it using `#getIMCStream` located within the event.

[regevents]: ../events/intro.md#creating-an-event-handler
[registering]: ../concepts/registries.md#registering-things
[capabilities]: ../datastorage/capabilities.md
