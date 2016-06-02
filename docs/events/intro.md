Events
======

Forge uses an event bus that allows mods to intercept events from various vanilla and mod behaviors.

Example: An event can be used to perform an action when a Vanilla stick is right clicked.

The main event bus used for most events is located at `MinecraftForge.EVENT_BUS`. There are also a few other buses used for specific types of events (like terrain generation) located in the same class.

An event handler is a class that contains one or more `public void` member methods that are marked with the `@SubscribeEvent` annotation.

## Creating an Event Handler

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

## Canceling & Results

If an event can be canceled, it will be marked with the `@Cancelable`. Events can be canceled by calling `setCanceled` on them with a boolean indicated if the event is canceled or not. If the event cannot be canceled, an `IllegalArgumentException` is thrown.

!!! important
    Different events may use results in different ways, refer to the event's JavaDoc before using the result.

Some events have an `Event.Result`, a result can be one of three things, `DENY` which stops the event, `DEFAULT` which uses the Vanilla behavior, and `ALLOW` which forces the action to take place, regardless if it would have originally. The result of an event can be set by calling `setResult` with an `Event.Result` on the event. Not all events have results, an event with a result will be annotated with `@HasResult`.

## Priority

Event handler methods (marked with `@SubscribeEvent`) have a priority. You can set the priority of an event handler method by setting the `priority` value of the annotation. The priority can be any value of the `EventPriority` enum (`HIGHEST`, `HIGH`, `NORMAL`, `LOW`, and `LOWEST`). Event handlers with priority `HIGHEST` are executed first and from there in descending order until `LOWEST` events which are executed last.

## Sub Events

Many events have different variations of themselves, these can be different but all based around one common factor (e.g. `PlayerEvent`) or can be an event that has multiple phases (e.g. `PotionBrewEvent`). Take note that if you listen to the parent event class, you will receive calls to your method for *all* subclasses.
