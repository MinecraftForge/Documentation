Events
======

Forge uses an event bus that allows mods to intercept events from various vanilla and mod behaviors.

Example: An event can be used to perform an action when a Vanilla stick is right clicked.

The main event bus used for most events is located at `MinecraftForge.EVENT_BUS`. There is another event bus for mod specific events located at `FMLJavaModLoadingContext.get().getModEventBus()` that you should only use in specific cases, more information about this bus can be found below.

Every event is fired on one of these busses, most events are fired on the main event bus but some are fired on the mod specfic events bus.

An event handler is a class that contains one or more `public void` member methods that are marked with the `@SubscribeEvent` annotation.

Creating an Event Handler
-------------------------

```java
public class MyForgeEventHandler {
	@SubscribeEvent
	public void pickupItem(EntityItemPickupEvent event) {
		System.out.println("Item picked up!");
	}
}
```
This event handler listens for the `EntityItemPickupEvent`, which is, as the name states, posted to the event bus whenever an `Entity` picks up an item.

To register this event handler, use `MinecraftForge.EVENT_BUS.register()` and pass it an instance of your event handler class. If you want to register this handler to the mod specific event bus you should use `FMLJavaModLoadingContext.get().getModEventBus().register()` instead.

### Static Event Handlers

An event handler may also be static. The handling method is still annotated with `@SubscribeEvent` and the only difference from an instance handler is that it is also marked `static`. In order to register a static event handler, an instance of the class won't do, the `Class` itself has to be passed in. An example:

```java
public class MyStaticForgeEventHandler {
	@SubscribeEvent
	public static void arrowNocked(ArrowNockEvent event) {
		System.out.println("Arrow nocked!");
	}
}
```

which must be registered like this: `MinecraftForge.EVENT_BUS.register(MyStaticForgeEventHandler.class)`.

### Automatically Registering Static Event Handlers

A class may be annotated with the `@Mod.EventBusSubscriber` annotation. Such a class is automatically registered to `MinecraftForge.EVENT_BUS` when the `@Mod` class itself is constructed. This is essentially equivalent to adding `MinecraftForge.EVENT_BUS.register(AnnotatedClass.class);` at the end of the `@Mod` class's constructor.

You can pass the bus you want to listen to to the `@Mod.EventBusSubscriber` annotation. You can also specify the `Dist`s to load this event subscriber on. This can be used to not load Client specific event subscribers on the dedicated server.

An example for a static event listener listening to `RenderWorldLastEvent` which will only be called on the Client:
```java
@Mod.EventBusSubscriber(Dist.CLIENT)
public class MyStaticClientOnlyEventHandler {
	@SubscribeEvent
	public static void drawLast(RenderWorldLastEvent event) {
		System.out.println("Drawing!");
	}
}
```

!!! note
    This does not register an instance of the class; it registers the class itself (i.e. the event handling methods must be static).

Canceling
---------

If an event can be canceled, it will be marked with the `@Cancelable` annotation, and the method `Event#isCancelable()` will return `true`. The cancel state of a cancelable event may be modified by calling `Event#setCanceled(boolean canceled)`, wherin passing the boolean value `true` is interpreted as canceling the event, and passing the boolean value `false` is interpreted as "un-canceling" the event. However, if the event cannot be canceled (as defined by `Event#isCancelable()`), an `UnsupportedOperationException` will be thrown regardless of the passed boolean value, since the cancel state of a non-cancelable event event is considered immutable.

!!! important
    Not all events can be canceled! Attempting to cancel an event that is not cancelable will result in an unchecked `UnsupportedOperationException` being thrown, which is expected to result in the game crashing! Always check that an event can be canceled using `Event#isCancelable()` before attempting to cancel it!

Results
-------

Some events have an `Event.Result`, a result can be one of three things, `DENY` which stops the event, `DEFAULT` which uses the Vanilla behavior, and `ALLOW` which forces the action to take place, regardless if it would have originally. The result of an event can be set by calling `setResult` with an `Event.Result` on the event. Not all events have results, an event with a result will be annotated with `@HasResult`.

!!! important
    Different events may use results in different ways, refer to the event's JavaDoc before using the result.

Priority
--------

Event handler methods (marked with `@SubscribeEvent`) have a priority. You can set the priority of an event handler method by setting the `priority` value of the annotation. The priority can be any value of the `EventPriority` enum (`HIGHEST`, `HIGH`, `NORMAL`, `LOW`, and `LOWEST`). Event handlers with priority `HIGHEST` are executed first and from there in descending order until `LOWEST` events which are executed last.

Sub Events
----------

Many events have different variations of themselves, these can be different but all based around one common factor (e.g. `PlayerEvent`) or can be an event that has multiple phases (e.g. `PotionBrewEvent`). Take note that if you listen to the parent event class, you will receive calls to your method for *all* subclasses.

Mod Event Bus
-------------

The mod event bus is primarily meant for listening to lifecycle events in which mods should initialize. Many of these events are also ran in parallel so mods can be initialized at the same time. This does mean you can't directly execute code from other mods in these events, use the `InterModEnqueueEvent` and `InterModProcessEvent` events for that.

These are the four most commonly used events that are called during mod initialization on the mod event bus:
* FMLCommonSetupEvent
* FMLClientSetupEvent & FMLDedicatedServerSetupEvent
* InterModEnqueueEvent
* InterModProcessEvent

!!! note
    The `FMLClientSetupEvent` and `FMLDedicatedServerSetupEvent` are only called on their respective distribution.
