Loading Stages
==============

Forge loads your mod in 3 main stages: Pre-Initialization, Initialization, and Post-Initialization, commonly referred to as preInit, init, and postInit.
There are some other events that are important too, depending on what your mod does.
Each of these stages occurs at a different point in the loading stage and thus what can be safely done in each stage varies.

!!! note

    Loading stage events can only be used in your `@Mod` class, in methods marked with the `@EventHandler` annotation.

!!! warning

    Many objects (e.g. Blocks, Items, Recipes, etc.) that were previously registered in Pre-Initialization, or other stage event handlers, should now be registered via [registry events][registering].
    This is to pave the way to being able to reload mods dynamically at runtime, which can't be done using loading stages (as they are fired once upon application startup).
    RegistryEvents are fired after Pre-Initialization.

## Pre-Initialization

Pre Init is the place set anything up that is required by your own or other mods.
This stage's event is the `FMLPreInitializationEvent`.
Common actions to preform in preInit are:

  * Creating and reading the config file
  * Registering [Capabilities][capabilities]

## Initialization

Init is where to accomplish any game related tasks that rely upon the items and blocks set up in preInit.
This stage's event is the `FMLInitializationEvent`.
Common actions to preform in init are:

  * Registering world generators
  * Registering event handlers
  * Sending IMC messages

## Post-Initialization

Post Init is where your mod usually does things which rely upon other mods.
This stage's event is the `FMLPostInitializationEvent`.
Common actions to preform in postInit are:

  * Mod compatibility, or anything which depends on other mods' init phases being finished.

##Other Important Events

  * IMCEvent: Process received IMC Messages
  * FMLServerStartingEvent: Register Commands

[registering]: ../concepts/registries.md#registering-things
[capabilities]: ../datastorage/capabilities.md
