Model Data
==========

Model data is the successor of "extended blockstates" allowing modders to pass in extra data to be used in [`IBakedModel::getQuads`][getquads] when rendering blocks. This is particularly useful in complex models such as for camouflage blocks which use other block's models as an example. This is not to be confused with a [`TileEntityRenderer`][ter] which is used for dynamic rendering such as for animated blocks like a chest or any blocks which cannot be defined by a list of `BakedQuad`s.

IBakedModels vs TERs
------------------

An [`IBakedModel`][bakedmodel] simply provides a list of `BakedQuad`s to the `BlockModelRenderer` which are then drawn to the screen. There are other properties available which define aspects which effect rendering such as whether the model supports ambient occlusion (a rendering effect). Most [`IBakedModel`][bakedmodel]s come from when a model file is loaded and then "baked" so that the model does not need to be loaded again.

A [`TileEntityRenderer`][ter] or [`TER`][ter] (previously [`TileEntitySpecialRenderer`][ter] or [`TESR`][ter]) is used to render blocks in a way that cannot be represented with a static baked model (JSON, OBJ, B3D, others).

A [`TER`][ter] has direct access to the `TileEntity` that the renderer is used for whereas an [`IBakedModel`][bakedmodel] only has access to the `BlockState` the model represents, the `Direction` which represents the side which is being rendered (or null), an instance of `Random` for randomised textures and the `IModelData` parameter. The [`IBakedModel::getQuads`][getquads] is unaware of where the block is in the world hence where the `IModelData` parameter steps in to provide extra information from the `TileEntity` using `TileEntity::getModelData`, and from the world using `IBakedModel::getModelData`.

Unlike a [`TER`][ter] which renders every frame, an [`IBakedModel`][bakedmodel] only provides the quads for drawing upon request (which occurs when `World::markBlockRangeForRenderUpdate` is called).

Model Data flow
------------------------

Model data is first created in the `TileEntity::getModelData` method which by default returns an `EmptyModelData` instance meaning that there is no data provided. This is then passed to the [`IBakedModel::getModelData`][getmodeldata] method as the `tileData` parameter. By default, the [`IBakedModel::getModelData`][getmodeldata] returns the `tileData` parameter. The result of [`IBakedModel::getModelData`][getmodeldata] is then the value of the `modelData` parameter in the [`IBakedModel::getQuads`][getquads] function.

Therefore, in either stage (in the `TileEntity::getModelData` or in the [`IBakedModel::getModelData`][getmodeldata]) we can add or set data.

Constructing Model Data
-----------------------

Similar to the [blockstate](https://mcforge.readthedocs.io/en/1.14.x/blocks/states/) system, a model data instance consists of multiple `ModelProperty`'s which are created using a builder. In your baked model class, create static final `ModelProperty` instances using the type parameter as the data type you wish to store (e.g. `ModelProperty<String>()` for a string value). The `ModelProperty` constructor also provides an additional predicate parameter which can be used to check the validity of a potential value; however this is set to accept all values by default. Then, to create an `IModelData` instance, we use a `ModelDataMap` builder (`ModelDataMap.Builder`) instance which can setup values that will be present using the `withProperty(<PROPERTY>)` and `withInitial(<PROPERTY>, <VALUE>)` methods which initialise a property with an empty value or with a provided value respectively. Finally, once all properties have been defined, the `build` function should be called to return the `IModelData` instance.

For example to create an `IModelData` instance with property `PROPERTY` and value `"value"`:
```Java
ModelDataMap.Builder().withInitial(PROPERTY, "value").build()
```

Using Model Data
----------------

In the [`IBakedModel::getQuads`][getquads] method, the `IModelData` parameter will be that as passed through using the model data flow, and so should contain all the data you provided in the `TileEntity::getModelData` and [`IBakedModel::getModelData`][getmodeldata]. Here is a basic example of how data should be retrieved from the `modelData` parameter in the [`IBakedModel::getQuads`][getquads].

```Java
@Nonnull
@Override
public List<BakedQuad> getQuads(@Nullable BlockState state, @Nullable Direction side, @Nonnull Random rand, @Nonnull IModelData extraData) {
    // If we have the `PROPERTY` in our data (even if the value is null)
    if (extraData.hasProperty(PROPERTY)) {
        // Get the data
        String value = extraData.getData(PROPERTY);
        // TODO do something with this value
    }

    // Return the missing texture model
    return Minecraft.getInstance().getBlockRendererDispatcher().getBlockModelShapes().getModelManager().getMissingModel();
}
```

!!! note
    The data returned from `IModelData::getData` can be null if the property is defined but not initialised / set even if `IModelData::hasProperty` returns `true`.

[bakedmodel]: ibakedmodel.md
[getquads]: ibakedmodel.md#getquads
[getmodeldata]: ibakedmodel.md#getmodeldata
[ter]: ../../tileentities/tesr.md
