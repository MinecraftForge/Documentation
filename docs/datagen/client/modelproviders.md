Model Providers
===============
The model providers are a specific type of data generators for defining models. All model providers are a subclass of `ModelProvider`.

`ModelProvider` provides methods to define models for blocks and items alike: cubes, single textures, doors, slabs, and even custom non-data-generated models as parent models.

Implementation
--------------
There are three main abstract implementations of `ModelProvider`: `ItemModelProvider`, `BlockModelProvider`, and `BlockStateProvider`.

For items, use `ItemModelProvider` to define their models: override `#registerModels` and use the helper methods.

For blocks, it is recommended to use `BlockStateProvider` to define the blockstates, models, and their item models in a single class. It contains an instance of both `BlockModelProvider` and `ItemModelProvider`, which can be accessed through `#models()` and `#itemModels()`.
`BlockModelProvider` is used to define only block models. 

Call `#getVariantBuilder(Block)` to get a `VariantBlockStateBuilder` for building a blockstate with different variants, or `#getMultipartBuilder(Block)` to get a `MultiPartBlockStateBuilder` for building a blockstate using multiparts.
