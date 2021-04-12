Mod Lifecycle
==============

During the mod loading process, the various lifecycle events are fired on the mod-specific event bus. Many actions are performed during these events, such as [registering objects][registering], preparing for [data generation][datagen], or [communicating with other mods][imc].

Event listeners should be registered either using `@EventBusSubscriber(bus = Bus.MOD)` or in the mod constructor:

```Java
@Mod.EventBusSubscriber(modid = "mymod", bus = Mod.EventBusSubscriber.Bus.MOD)
public class MyModEventSubscriber {
    @SubscribeEvent
    static void onCommonSetup(FMLCommonSetupEvent event) { ... }
}

@Mod("mymod")
public class MyMod {
    public MyMod() {
        FMLModLoadingContext.get().getModEventBus().addListener(this::commonSetup);
    } 
  
    private void onCommonSetup(FMLCommonSetupEvent event) { ... }
}
```

!!! warning
    The lifecycle events are fired in parallel: All mods will concurrently receive the same event.
    
    Mods *must* take care to be thread-safe, like when calling other mods' APIs or accessing vanilla systems. Defer code for later execution using the `DeferredWorkQueue` class.

Registry Events
---------------

The `RegistryEvent`s are always the first to fire during mod loading, after the mod instance construction. There are two: the `NewRegistry` event and the `Register` event.

The `RegistryEvent.NewRegistry` event allows modders to register their own custom registries, using the `RegistryBuilder` class.

The `RegistryEvent.Register<?>` event is for [registering objects][registering] into the registries. A `Register` event is fired for each registry. 

Data Generation
---------------

If the game is setup to run the [data generators][datagen], then the `GatherDataEvent` will be the last event to fire. This event is for registering mods' data providers to the data generators.

Common Setup
------------

`FMLCommonSetupEvent` is for actions that are common to both physical client and server, such as registering [capabilities][capabilities].

Sided Setup
-----------

The sided-setup events are fired on their respective [physical sides][sides]: `FMLClientSetupEvent` on the physical client, and `FMLDedicatedServerSetupEvent` for the dedicated server. This is where physical side-specific initialization should occur, such as registering client-side key bindings.

InterModComms
-------------

This is where messages can be sent to mods for cross-mod compatibility. There are two events: the `InterModEnqueueEvent` and `InterModProcessEvent`.

`InterModComms` is the class responsible for holding messages for mods. This class is safe to call during the lifecycle events, as it is backed by a `ConcurrentMap`.

During the `InterModEnqueueEvent`, use `InterModComms.sendTo` to send messages to different mods, then during the `InterModProcessEvent`, call `InterModComms.getMessages` to get a stream of all received messages.

!!! note
    There is one last lifecycle event: the `FMLLoadCompleteEvent`, fired after the InterModComms events, for when the mod loading process is complete.

[registering]: registries.md#methods-for-registering
[capabilities]: ../datastorage/capabilities.md
[datagen]: ../datagen/intro.md
[imc]: lifecycle.md#intermodcomms
[sides]: sides.md
