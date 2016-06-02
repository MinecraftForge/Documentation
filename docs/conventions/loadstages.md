Loading Stages
==============

Forge loads your mod in 3 main stages: Pre-Initialization, Initialization, and Post-Initialization, commonly referred to as preInit, init, and postInit.
There are some other events that are important too, depending on what your mod does.
Each of these stages occurs at a different point in the loading stage and thus what can be safely done in each stage varies.

!!! note
    Loading stage events can only be used in your `@Mod` class, in methods marked with the `@EventHandler` annotation.

## Pre-Initialization

Pre Init is the place to let the game know about all the blocks, items, etc that your mod provides.
This stage's event is the `FMLPreInitializationEvent`.
Common actions to preform in preInit are:

  * Registering blocks and items to the GameRegistry
  * Registering tile entities
  * Registering entities
  * Assigning ore dictionary names

## Initialization

Init is where to accomplish any game related tasks that rely upon the items and blocks set up in preInit.
This stage's event is the `FMLInitializationEvent`.
Common actions to preform in init are:

  * Registering world generators
  * Registering recipes
  * Registering event handlers
  * Sending IMC messages

## Post-Initialization

Post Init is where your mod usually does things which rely upon or are relied upon by other mods.
This stage's event is the `FMLPostInitializationEvent`.
Common actions to preform in postInit are:

  * Mod compatibility, or anything which depends on other mods' init phases being finished.

##Other Important Events

  * IMCEvent: Process received IMC Messages
  * FMLServerStartingEvent: Register Commands