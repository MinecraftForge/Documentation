Data Generators
===============

Data generators are a way to programmatically generate the assets and data of mods. It allows the definition of the contents of these files in the code and their automatic generation, without worrying about the specifics.

The data generator system is loaded by the main class `net.minecraft.data.Main`. Different command-line arguments can be passed to customize which mods' data are gathered, what existing files are considered, etc. The class responsible for data generation is `net.minecraft.data.DataGenerator`.

The default configurations in the MDK `build.gradle` adds the `runData` task for running the data generators.

Existing Files
--------------
All references to textures or other data files not generated for data generation must reference existing files on the system. This is to ensure that all referenced textures are in the correct places, so typos can be found and corrected. 

`ExistingFileHelper` is the class responsible for validating the existence of those data files. An instance can be retrieved from  `GatherDataEvent#getExistingFileHelper`.

The `--existing <folderpath>` argument allows the specified folder and its subfolders to be used when validating the existence of files. Additionally, the `--existing-mod <modid>` argument allows the resources of a loaded mod to be used for validation. By default, only the vanilla datapack and resources are available to the `ExistingFileHelper`.

Generator Modes
---------------

The data generator can be configured to run 4 different data generations, which are configured from the command-line parameters, and can be checked from `GatherDataEvent#include***` methods.

* __Client Assets__
  * Generates client-only files in `assets`: block/item models, blockstate JSONs, language files, etc.
  * __`--client`__, `#includeClient`
* __Server Data__
  * Generates server-only files in `data`: recipes, advancements, tags, etc.
  * __`--server`__, `#includeServer`
* __Development Tools__
  * Runs some development tools: converting SNBT to NBT and vice-versa, etc.
  * __`--dev`__, `#includeDev`
* __Reports__
  * Dumps all registered blocks, items, commands, etc.
  * __`--reports`__, `#includeReports`

All of the generators can be included using `--all`.

Data Providers
--------------

Data providers are the classes that actually define what data will be generated and provided. All data providers implement `DataProvider`. Minecraft has abstract implementations for most assets and data, so modders need only to extend and override the specified method.

The `GatherDataEvent` is fired on the mod event bus when the data generator is being created, and the `DataGenerator` can be obtained from the event. Create and register data providers using `DataGenerator#addProvider`.

### Client Assets
* [`net.minecraftforge.common.data.LanguageProvider`][langgen] - for [language strings][lang]; implement `#addTranslations`
* [`net.minecraftforge.common.data.SoundDefinitionsProvider`][soundgen] - for [`sounds.json`][sounds]; implement `#registerSounds`
* [`net.minecraftforge.client.model.generators.ModelProvider<?>`][modelgen] - for [models]; implement `#registerModels`
    * [`ItemModelProvider`][itemmodelgen] - for item models
    * [`BlockModelProvider`][blockmodelgen] - for block models
* [`net.minecraftforge.client.model.generators.BlockStateProvider`][blockstategen] - for blockstate JSONs and their block and item models; implement `#registerStatesAndModels`

### Server Data

**These classes are under the `net.minecraftforge.common.data` package**:

* [`GlobalLootModifierProvider`][glmgen] - for [global loot modifiers][glm]; implement `#start`
* [`DatapackBuiltinEntriesProvider`][datapackregistriesgen] for datapack registry objects; pass in `RegistrySetBuilder` to the constructor

**These classes are under the `net.minecraft.data` package**:

* [`loot.LootTableProvider`][loottablegen] - for [loot tables][loottable]; pass in `LootTableProvider$SubProviderEntry`s to the constructor
* [`recipes.RecipeProvider`][recipegen] - for [recipes] and their unlocking advancements; implement `#buildRecipes`
* [`tags.TagsProvider`][taggen] - for [tags]; implement `#addTags`
* [`advancements.AdvancementProvider`][advgen] - for [advancements]; pass in `AdvancementSubProvider`s to the constructor

[langgen]: ./client/localization.md
[lang]: https://minecraft.fandom.com/wiki/Language
[soundgen]: ./client/sounds.md
[sounds]: https://minecraft.fandom.com/wiki/Sounds.json
[modelgen]: ./client/modelproviders.md
[models]: ../resources/client/models/index.md
[itemmodelgen]: ./client/modelproviders.md#itemmodelprovider
[blockmodelgen]: ./client/modelproviders.md#blockmodelprovider
[blockstategen]: ./client/modelproviders.md#block-state-provider
[glmgen]: ./server/glm.md
[glm]: ../resources/server/glm.md
[datapackregistriesgen]: ./server/datapackregistries.md
[loottablegen]: ./server/loottables.md
[loottable]: ../resources/server/loottables.md
[recipegen]: ./server/recipes.md
[recipes]: ../resources/server/recipes/index.md
[taggen]: ./server/tags.md
[tags]: ../resources/server/tags.md
[advgen]: ./server/advancements.md
[advancements]: ../resources/server/advancements.md
