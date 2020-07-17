Data Generators
===============

Data generators are a way to programmatically generate the assets and data of your mods. It allows the definition of the contents of these files in your code and the automatic generation of these files, without worrying about the specification of the files.

The data generator system is loaded by the main class `net.minecraft.data.Main`. Different arguments can be passed to it, to customize which mods' data are gathered, what existing files are considered, etc. The class responsible for data generation is `net.minecraft.data.DataGenerator`.

ForgeGradle provides the `runData` task to run the data generators. The IDE-specific runs generation tasks (`gen***Tasks`) also create run configurations for running the data generator.

Generator Modes
---------------

The data generator can be configured to run 4 different data generations, which are configured from the command-line parameters, and can be checked from `GatherDataEvent#include***` methods.

  * __Client Assets__
  	 * Generates client-only files in `assets`: block/item models, blockstate JSONs, language files, etc.
     * __`--client`__, `includeClient()`
  * __Server Data__
  	 * Generates server-only files in `data`: recipes, advancements, tags, etc.
     * __`--server`__, `includeServer()`
  * __Development Tools__
  	 * Runs some development tools: converting SNBT to NBT and vice-versa, etc.
     * __`--dev`__, `includeDev()`
  * __Reports__
  	 * Dumps all registered blocks, items, commands, etc.
     * __`--reports`__, `includeReports()`

Data Providers
--------------

Data providers are the classes that actually define what data will be generated and provided. All data providers implement `IDataProvider`.
Minecraft has abstract implementations for most assets and data, so modders need only to extend and override the abstract method.

### Client Assets
  * `LanguageProvider` - for language strings
  * `ModelProvider` - base class for all model providers
    * `BlockModelProvider` - for block models
    * `ItemModelProvider` - for item models
    * `BlockStateProvider` - for block states and their block and item models

### Server Data
  * `LootTableProvider` - for loot tables
  * `RecipeProvider` - for recipes and their unlocking advancements
  * `TagsProvider` - for tags

!!! notes
	An `AdvancementProvider` class does exists, however it is hardcoded for only the vanilla advancements.
	
	`LootTableProvider` does not provide an abstract method to override, you must override `act()`. 

The `GatherDataEvent` is fired on the mod event bus when the data generator is being created, and the `DataGenerator` can be obtained from the event. Create and register your providers to the `DataGenerator` using `addProvider()`.
