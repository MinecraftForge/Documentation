Intro to Advanced Models
========================

While simple models and blockstates are all well and good, they aren't dynamic. For example, Forge's Universal Bucket can hold all kinds of fluid, which may be mod added. It has to dynamically piece the model together from the base bucket model and the liquid. How is that done? Enter `IModel`.

In order to understand how this works, let's go through the internals of the model system. Throughout this section, you will probably have to refer to this to grasp a clear understanding of what is happening. This is true in reverse as well. You will likely not understand everything happening here, but as you move through this section you should be able to grasp more and more of it until everything is clear.

!!! important
    If this is your first time reading through do not skip _anything_! It is _imperative_ that you read everything **in order** so as to build a comprehensive understanding! In the same vein, if this is your first time reading, do not follow links if they lead to pages further ahead in the section.

1. A set of `ModelResourceLocation`s are marked as models to be loaded through `ModelLoader`.

    * For items, their models must be manually marked for loading with `ModelLoader.registerItemVariants`. (`ModelLoader.setCustomModelResourceLocation` does this.)

    * For blocks, their statemappers produce a `Map<IBlockState, ModelResourceLocation>`. All blocks are iterated, and then the values of this map are marked to be loaded.

2. [`IModel`][IModel]s are loaded from each `ModelResourceLocation` and cached in a `Map<ModelResourceLocation, IModel>`.

    * An `IModel` is loaded from the only [`ICustomModelLoader`][ICustomModelLoader] that accepts it. (Multiple loaders attempting to load a model will cause a `LoaderException`.) If none is found and the `ResourceLocation` is actually a `ModelResourceLocation` (that is, this is not a normal model; it's actually a blockstate variant), it goes to the blockstate loader (`VariantLoader`). Otherwise the model is a normal vanilla JSON model and is loaded the vanilla way (`VanillaLoader`).

    * A vanilla JSON model (`models/item/*.json` or `models/block/*.json`), when loaded, is a `ModelBlock` (yes, even for items). This is a vanilla class that is not related to `IModel` in any way. To rectify this, it gets wrapped into a `VanillaModelWrapper`, which *does* implement `IModel`.

    * A vanilla/Forge blockstate variant, when loaded, first loads the entire blockstate JSON it comes from. The JSON is deserialized into a `ModelBlockDefinition` that is then cached to the path of the JSON. A list of variant definitions is then extracted from the `ModelBlockDefinition` and placed into a `WeightedRandomModel`.

    * When loading a vanilla JSON item model (`models/item/*.json`), the model is requested from a `ModelResourceLocation` with variant `inventory` (e.g. the dirt block item model is `minecraft:dirt#inventory`); thereby causing the model to be loaded by `VariantLoader` (as it is a `ModelResourceLocation`). When `VariantLoader` fails to load the model from the blockstate JSON, it falls back to `VanillaLoader`.
        * The most important side-effect of this is that if an error occurs in `VariantLoader`, it will try to also load the model via `VanillaLoader`. If this also fails, then the resulting exception produces *two* stacktraces. The first is the `VanillaLoader` stacktrace, and the second is from `VariantLoader`. When debugging model errors, it is important to ensure that the right stacktrace is being analyzed.

    * An `IModel` can be loaded from a `ResourceLocation` or retrieved from the cache by invoking `ModelLoaderRegistry.getModel` or one of the exception handling alternatives.

3. All texture dependencies of the loaded models are loaded and stitched into the atlas. The atlas is a giant texture that contains all the model textures pasted together. When a model refers to a texture, during rendering, an extra UV offset is applied to match the texture's position in the atlas.

4. Every model is baked by calling `model.bake(model.getDefaultState(), ...)`. The resulting [`IBakedModel`][IBakedModel]s are cached in a `Map<ModelResourceLocation, IBakedModel>`.

5. This map is then stored in the `ModelManager`. The `ModelManager` for an instance of the game is stored in `Minecraft::modelManager`, which is private with no getter.

    * The `ModelManager` may be acquired, without reflection or access tranformation, through `Minecraft.getMinecraft().getRenderItem().getItemModelMesher().getModelManager()` or `Minecraft.getMinecraft().getBlockRenderDispatcher().getBlockModelShapes().getModelManager()`. Contrary to their names, these are equivalent.

    * One may request an `IBakedModel` from the cache (without loading and/or baking models, only accessing the existing cache) in a `ModelManager` with `ModelManager::getModel`.

6. Eventually, an `IBakedModel` will be rendered. This is done by calling `IBakedModel::getQuads`. The result is a list of `BakedQuad`s (quadrilaterals: polygons with 4 vertices). These can then be passed to the GPU for rendering. Items and blocks diverge a bit here, but it's relatively simple to follow.

    * Items in vanilla have properties and overrides. To facilitate this, `IBakedModel` defines `getOverrides`, which returns an `ItemOverrideList`. `ItemOverrideList` defines `handleItemState`, which takes the original model, the entity, world, and stack, to find the final model. Overrides are applied before all other operations on the model, including `getQuads`. As `IBlockState` is not applicable to items, `IBakedModel::getQuads` receives `null` as its state parameter when being rendered as an item.

    * Blocks have blockstates, and when a block's `IBakedModel` is being rendered, the `IBlockState` is passed directly into the `getQuads` method. In the context of models only, blockstates can have an extra set of properties, known as [unlisted properties][extended states].

[IModel]: imodel.md
[IBakedModel]: ibakedmodel.md
[ICustomModelLoader]: icustommodelloader.md
[extended states]: extended-blockstates.md
