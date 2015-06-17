UsingEvents
===========

The use of an event is all based around when the event is actually fired.
An event's documentation will tell you when the event is fired (the nature and locations), whether the event can be canceled, if it has a result and what can be modified. Use this information to determine whether or not a specific event will allow you to do what you need.

Registering
-----------

If you want to subscribe to an event you need to register a class (or multiple at different times) to handle the functions.
This is done with the following:
`MinecraftForge.EVENT_BUS.register(new YourEventClass());` for forge events
and
`FMLCommonHandler.instance().bus().register(new YourEventClass());` for fml events
You can use one class for all events that you wish to subscribe to, or spread them out over multiple.

Your Event Use
--------------

The basics for subscribing to an event are as follows:

```java
public class WhateverYouChoseForClassName
{
	@SubscribeEvent(priority = EventPriority.LOWEST)
	public void WhateverYouChoseForFunctioName(NameOfEvent event)
	{
		//your code
	}
}
```

The event priority that is **optional** to set determines what order the subscribers get acces to the event
If you have the lowest priority you get access last, but you get the last chance to set what happens in the event.

Example
-------

If the event you are subscribed to is the BreakSpeed event in the PlayerEvent class your subscription could look like this:

```java
public class BreakSpeedHandler
{
	@SubscribeEvent(priority = EventPriority.LOWEST)
	public void setBreakSpeed(PlayerEvent.BreakSpeed event)
	{
		if(event.entityPlayer.experienceLevel > 0)
		{
			event.newSpeed = event.originalSpeed + 1.0F;
		}
	}
}
```

The newSpeed float is the only variable that can actually be set set, as all the others are final. Here we simply add one float to the original speed if the player has greater than 0 levels .
The event can be canceled.

Notes
-----

- There are many different events that can be used in different ways, but beware that other people may be subscribed to the same event, and expect different outcomes from expected.
- Keep an eye on if an event is *cancelable* or not, it can be an effective and simple use of an event.
- Check warnings for variables that may be null in the comments, there are many edge cases and you should plan on using many null checks.
- Make sure you only change what happens in an event when you are sure you want to, they can get fired when you may not expect.
