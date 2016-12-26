`ICustomModelLoader`
====================

Recall that when a model is requested for a `ModelResourceLocation`, every `ICustomModelLoader` is queried to find the one that volunteers to load the model from the MRL. In order to actually use a custom implementation of [`IModel`][IModel], whether it be a full blown model format like OBJ models or a completely in-code model generator like `ModelDynBucket`, it must be done through an ICML. Even though it has "loader" in the name, there is no need for it to actually load anything; for in-code models like `ModelDynBucket`, the ICML will normally be a dummy that just instantiates the `IModel` without touching any files.

If multiple ICMLs attempt to load the same MRL, the game will crash with a `LoaderException`. Therefore, care must be taken to keep the domain of an ICML safe from being infringed upon. The Forge OBJ and B3D loaders do so by requiring that the domain of an MRL be registered to them beforehand, and they only match MRLs with the appropriate file extension.

In order for an ICML to actually be used, it must be registered with `ModelLoaderRegistry.registerLoader`.

### `accepts`

Tests whether this ICML is willing to load the given RL. Preferably, this should be based on the RL alone and not on the file contents. If two ICMLs accept the same RL, a `LoaderException` is thrown. Therefore, care should be taken to make sure that the domain of the ICML is unique enough to avoid collisions.

### `loadModel`

Get the model for the given RL. Note that it doesn't need to "load" anything. For example, completely in-code models will simply instantiate the `IModel` class and totally ignore the file.

### `onResourceManagerReload`

Called whenever the resource packs are (re)loaded. In this method, any caches the ICML keeps should be dumped. Following this, `loadModel` will be called again to reload all the `IModel`s, so if the *`IModel`s* kept some caches in themselves, they do not need to be cleared.

[IModel]: imodel.md
