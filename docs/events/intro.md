Events
======

Forge uses an event bus that allows mods to intercept events from various vanilla and mod behaviors.

Example: An event can be used to perform an action when a Vanilla stick is right clicked.

The main event bus used for most events is located at `MinecraftForge.EVENT_BUS`. There are also a few other buses used for specific types of events (like terrain generation) located in the same class.

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

To register this event handler, use `MinecraftForge.EVENT_BUS.register()` and pass it an instance of your event handler class.

!!! note
    In older forge versions, there were two separate event buses. One for forge, one for FML. This has long since been deprecated, so there is no need to use the FML event bus any longer.

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
