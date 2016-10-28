`ICustomModelLoader`
====================

Recall that when a model is requested for an MRL, every `ICustomModelLoader` is queried to find the one that volunteers to load the model from the MRL. In order to actually use custom implementations of `IModel`, whether it be a full blown model format like OBJ models or a completely in-code model generator like `ModelDynBucket`, it must be done through an ICML. Even though it has "loader" in the name, there is no need for it to actually load anything; for in-code models like `ModelDynBucket`, the ICML will normally be a dummy that just instantiates the `IModel` without touching any files.

The comments on the class are fairly clear: `accepts` tests whether the ICML can load a model from the given MRL; `loadModel` actually does so. As ICML extends `IResourceManagerReloadListener`, whenever the resource pack is reloaded (including the first load), `onResourceManagerReload` is called. This method should clear any caches the have been set up. `IModel`s are reloaded too through `loadModel` after this method is called.

If multiple ICMLs attempt to load the same MRL, the game will crash with a `LoaderException`. Therefore, care must be taken to keep the domain of an ICML safe from being infringed upon. The Forge OBJ and B3D loaders do so by requiring that the domain of an MRL be registered to them beforehand, and they only match MRLs with the appropriate file extension.

In order for an ICML to actually be used, it must be registered with `ModelLoaderRegistry.registerLoader`.
