Loading Stages
==============

The Forge loading process has four main phases. All of these events shown are fired on the mod-specific eventbus, *not* the global Forge event bus `MinecraftForge.EVENT_BUS`
Handlers should be registered either using `@EventBusSubscriber(bus = Bus.MOD)` or in the mod object constructor as follows:

```Java
@Mod("mymod")
public class MyMod {
  public MyMod() {
    FMLModLoadingContext.get().getModEventBus().registerListener(this::commonSetup);
  } 
  
  private void commonSetup(FMLCommonSetupEvent evt) { ... }
}
```

!!! warning
    All four of the below events are called for all mods in parallel. That is, all mods will concurrently receive common setup, FML will wait for 
    them all to finish, then all mods will concurrently receive sided setup, and so forth.
    Mods *must* take care to be thread safe, especially when calling other mods' API's and accessing Vanilla systems, which are not thread safe in general. This can be done using the `DeferredWorkQueue` class.


## Setup

`FMLCommonSetupEvent` is the first to fire, and is fired early in the Minecraft starting process.
[Registry events][registering] are fired before this event, so you can expect all registry objects to be valid by the time this runs.
Common actions to perform in common setup are:

  * Creating and reading the config files
  * Registering [Capabilities][capabilities]

## Sided Setup

`FMLClientSetupEvent` and `FMLDedicatedServerSetupEvent` are fired after common setup, and are where physical side-specific initialization should occur.
Common actions to perform here are registering client-side only things such as key bindings.

## IMC Enqueue

Here, mods should send messages to all other mods they are interested in integrating with, using the `InterModComms.sendTo()` method.

## IMC Process

Here, mods should process all the messages they have received from other mods and set up integrations appropriately. A mod may retrieve the messages that have been sent to it using the `InterModComms.getMessages()` method.

##Other Important Events

  * FMLServerStartingEvent: Register Commands

[registering]: ../concepts/registries.md#registering-things
[capabilities]: ../datastorage/capabilities.md
