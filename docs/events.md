Events
======

Forge and FML use a system of events to allow mods to intercept events from objects that the mod doesn't control.

e.g. An event can be used to perform an action when a Vanilla stick is right click.

**Note:** This tutorial requires you have a basic mod set up.

There are two main event busses that will be used, the Forge event bus and the FML event bus. There are also a couple smaller busses used for specific types of events (e.g. terrain generation).

An event handler is a class that contains one or more `public void` methods that are marked with the `@SubscribeEvent` annotation.

## Forge event handler
```java
public class MyForgeEventHandler {
	@SubscribeEvent
	public void pickupItem(EntityItemPickupEvent event) {
		System.out.println("Item picked up!");
	}
}
```
This event handler listens for the `EntityItemPickupEvent`, which is, as the name states, posted to the event bus whenever an `Entity` picks up an item.

`EntityPickupItemEvent` is called on the Forge event bus, so we need to register our event handler on the Forge event bus, we're going to do this from the mod's pre-initialization method.

```java
@Mod.EventHandler
public void preInit(FMLPreInitializationEvent event) {
	MinecraftForge.EVENT_BUS.register(new MyForgeEventHandler());
}
```

## FML Event Handler
FML events handlers are created the same way as Forge event handlers, just using different events. FML event handlers are registered to the FML event bus like so:

```java
public class MyFMLEventHandler {
	@SubscribeEvent
	public void configChanged(ConfigChangedEvent event) {
		// reload my config
	}
}
```

```java
@Mod.EventHandler
public void preInit(FMLPreInitializationEvent event) {
	FMLCommonHandler.instance().bus().register(new MyFMLEventHandler());
}
```

**Note:** You can easily differentiate between FML and Forge events. by checking the package. Forge events are in the `net.minecraftforge.event` package whereas FML events are in the `net.minecraftforge.fml` package (this is the `cpw.mods.fml` package on 1.7.10 or earlier).

## Canceling & Results
If an event can be canceled, it will be marked with the `@Cancelable` annotation and noted in the appropriate reference and the event's JavaDoc. Events can be canceled by calling `setCancel` on them with a boolean indicated if the event is cancelled or not. If the event cannot be canceled, an `IllegalArgumentException` is thrown

Some events have a `Event.Result`, a result can be one of three things, `DENY` which stops the event, `DEFAULT` which uses the Vanilla behavior, and `ALLOW` which allows the action to take place. The result of an event can be set by calling `setResult` with an `Event.Result` on the event. Not all events have results, if they do it will be noted in the appropriate reference and the event's JavaDoc and the event class will have the `@HasResult` annotation.

## Priority
Event handler methods (marked with `@SubscribeEvent`) have a priority. You can set the priority of an event handler method by setting the `priority` value of the annotation. The priority can be any value of the `EventPriority` enum (`HIGHEST`, `HIGH`, `NORMAL`, `LOW`, and `LOWEST`). Event handlers with priority `HIGHEST` are executed first and from there in descending order until `LOWEST` events which are executed last.

## Sub Events
Many events have different varitations of themselves, these can be different but all based around one common factor (e.g. `PlayerEvent`) or can be an event that has multiple phases (e.g. `PotionBrewEvent`).

Each sub event extends from the parent event, so any fields/methods the parent has, the sub events will also have. **Parent fields/methods will not be listed for sub events.**