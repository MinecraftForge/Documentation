Overview
========

The event system in forge/fml provides a way for a mod to change something that happens in the game without breaking down compatibility.

An event is void function that gets fired when "an event" happens in the game and gives mods the opportunity to change the outcome by subscribing to the event.

When you subscribe to an event, the event information gets passed to you and you can change certain things or even cancel the event.

Events
------

Events are fired at various different times and there is an event for most things that you may want to change that actually happen. 
This can be when a player dies, when a minecart hits an entity, when a bucket gets filled or even when a tooltip is being displayed or a block is clicked in the world.
