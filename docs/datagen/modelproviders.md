Model Providers
===============
The model providers are a specific type of data generators for defining models. All model providers are a subclass of `ModelProvider`.

`ModelProvider` provides methods to define models for blocks and items alike: cubes, single textures, doors, slabs, and even your own custom non-data-generated models as parent models.

Existing Files
--------------
All references to textures or other data files not generated for data generation must reference existing files on the system. This is to ensure that all referenced textures are in the correct places, so typos can be found and corrected. 

`ExistingFileHelper` is the class responsible for validating the existence of those data files. An instance can be retrieved from  `GatherDataEvent#getExistingFileHelper()`.

The `--existing <folderpath>` argument allows the specified folder and its subfolders to be used when validating the existence of files. By default, only the vanilla datapack and resources are available to the `ExistingFileHelper`.

Implementation
--------------
There are three main abstract implementations of `ModelProvider`: `ItemModelProvder`, `BlockModelProvider`, and `BlockStateProvider`.

`ItemModelProvider` is for defining models for items, `BlockModelProvider` is for defining models for blocks.
To use these, override `#generateModels()` and use the various helper methods to define your models. 

`BlockStateProvider` is for defining blockstates, block models, and their item models. It contains an instance of both `BlockModelProvider` and `ItemModelProvider`, which can be accessed through `#models()` and `#itemModels()`.

Call `#getVariantBuilder(Block)` to get a `VariantBlockStateBuilder` for building a blockstate with different variants. Call `#getMultipartBuilder(Block)` to get a `MultiPartBlockStateBuilder` for building a blockstate using multiparts.
