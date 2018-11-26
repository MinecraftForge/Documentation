`ICustomModelLoader`
====================

Recall that when a model is requested for a `ModelResourceLocation`, every `ICustomModelLoader` is queried to find the one that volunteers to load the model from the `ModelResourceLocation`. In order to actually use a custom implementation of [`IModel`][IModel], whether it be a full blown model format like OBJ models or a completely in-code model generator like `ModelDynBucket`, it must be done through an `ICustomModelLoader`. Even though it has "loader" in the name, there is no need for it to actually load anything; for in-code models like `ModelDynBucket`, the `ICustomModelLoader` will normally be a dummy that just instantiates the `IModel` without touching any files.

If multiple `ICustomModelLoader`s attempt to load the same `ResourceLocation`, the game will crash with a `LoaderException`. Therefore, care must be taken to keep the namespace of an `ICustomModelLoader` safe from being infringed upon. The Forge OBJ and B3D loaders do so by requiring that the namespace of a `ResourceLocation` be registered to them beforehand, and they only match `ResourceLocation`s with the appropriate file extension.

In order for an `ICustomModelLoader` to actually be used, it must be registered with `ModelLoaderRegistry.registerLoader`.

### `accepts`

Tests whether this `ICustomModelLoader` is willing to load the given `ResourceLocation`. Preferably, this should be based on the `ResourceLocation` alone and not on the file contents. If two `ICustomModelLoader`s accept the same `ResourceLocation`, a `LoaderException` is thrown. Therefore, care should be taken to make sure that the namespace of the `ICustomModelLoader` is unique enough to avoid collisions.

### `loadModel`

Get the model for the given `ResourceLocation`. Note that it doesn't need to "load" anything. For example, completely in-code models will simply instantiate the `IModel` class and totally ignore the file.

### `onResourceManagerReload`

Called whenever the resource packs are (re)loaded. In this method, any caches the `ICustomModelLoader` keeps should be dumped. Following this, `loadModel` will be called again to reload all the `IModel`s, so if the *`IModel`s* kept some caches in themselves, they do not need to be cleared.

[IModel]: imodel.md
