Data Generators
===============

Data generators are a way to programmatically generate the assets and data of mods. It allows the definition of the contents of these files in the code and their automatic generation, without worrying about the specifics.

The data generator system is loaded by the main class `net.minecraft.data.Main`. Different command-line arguments can be passed to customize which mods' data are gathered, what existing files are considered, etc. The class responsible for data generation is `net.minecraft.data.DataGenerator`.

The default configurations in the MDK `build.gradle` adds the `runData` task for running the data generators.

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

Data providers are the classes that actually define what data will be generated and provided. All data providers implement `DataProvider`.
Minecraft has abstract implementations for most assets and data, so modders need only to extend and override the specified method.

The `GatherDataEvent` is fired on the mod event bus when the data generator is being created, and the `DataGenerator` can be obtained from the event. Create and register data providers using `DataGenerator#addProvider`.

### Client Assets
  * `net.minecraftforge.common.data.LanguageProvider` - for language strings; override `#addTranslations`
  * `ModelProvider<?>` - base class for all model providers
    * _These classes are under the `net.minecraftforge.client.model.generators` package_
    * `ItemModelProvider` - for item models; override `#registerModels`
    * `BlockStateProvider` - for blockstates and their block and item models; override `#registerStatesAndModels`
    * `BlockModelProvider` - for block models; override `#registerModels`
  * `net.minecraftforge.common.data.SoundDefinitionsProvider` - for the `sounds.json`

### Server Data
  * `net.minecraftforge.common.data.GlobalLootModifierProvider` - for [global loot modifiers][glm]; override `#start`
  * _These classes are under the `net.minecraft.data` package_
  * `LootTableProvider` - for loot tables; override `#getTables`
  * `RecipeProvider` - for recipes and their unlocking advancements; override `#buildCraftingRecipes`
  * `TagsProvider` - for tags; override `#addTags`
  * `AdvancementProvider` - for advancements; override `#registerAdvancements`

[glm]: ../items/globallootmodifiers.md
