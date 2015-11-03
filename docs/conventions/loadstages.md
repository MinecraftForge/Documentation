#Loading Stages
Forge loads your mod in 3 main stages: Pre-Initialization, Initialization, and Post-Initialization, commonly referred to as preInit, init, and postInit.
Another important stage is Server Starting.
Each of these stages occurs at a different point in the loading stage and thus what can be safely done in each stage varies.

##Pre Initialization
Pre Init is the place to let the game know about all the blocks, items, etc that your mod provides.
This stage's event is the `FMLPreInitializationEvent`.
Common actions to preform in preInit are:
  * Registering blocks and items to the GameRegistry
  * Register Tile Entities
  * Register Packets and Network Stuff
  * Register Entities
  * Assigning Ore Dictionary entries to mod items
  * Registering textures for your blocks and items

##Initialization
Init is where to accomplish any game related tasks that rely upon the items and blocks set up in preInit.
This stage's event is the `FMLInitializationEvent`.
Common actions to preform in init are:
  * Registering World Generators
  * Starting remote version checks
  * Setting up recipes
  * Event Handlers
  * Send IMC Requests

##Post Initialization
Post Init is where your mod usually does things which rely upon or are relied upon by other mods.
This stage's event is the `FMLPostInitializationEvent`.
Common actions to preform in postInit are:
  * Process received IMC Requests
  * API-related stuff
  * Overwriting other people's stuff

##Server Starting
Server Starting is where the server is starting up.
This stage's event is the `FMLServerStartingEvent`.
Common actions to preform in serverStarting are:
  * Register Commands