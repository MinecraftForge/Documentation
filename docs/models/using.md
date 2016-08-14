Using Models
============

Now that you have some neat looking models and a few blocks/items you want to use them on, let's see how to do so. Note that basically everything on this page is client-side only, so only do this from your client proxy.

Using Block Models
------------------

Blocks are not directly linked to models, instead, block<em>states</em> are mapped to [blockstate JSONs], which themselves are linked to models. A blockstate is mapped to a `ModelResourceLocation` by an `IStateMapper`. The default statemapper works as follows:

1. Get the registry name of the blockstate's block.
2. Set said name as the `ResourceLocation` part of the MRL.
3. Get all properties and their values in the blockstate.
4. Get the name of each property with `IProperty#getName`.
5. Get the name of each value with `IProperty<T>#getName(T)`.
6. Produce a comma delimited string `a=b,c=d,e=f`
7. Set that as the variant part of the MRL.
8. If the variant string is empty, set it to `normal`.

By default, the properties will be ordered alphabetically, like so `foo=bar,qux=qux,spam=eggs`. Additionally, the variant string gets silently `toLowerCase`d, so if your statemapper returns `mod:model#VARIANT`, the game will query the JSON for the string "variant", not "VARIANT."

### Custom `IStateMapper`s

It's quite easy to use a custom `IStateMapper`. Once you have an instance of it, simply call `ModelLoader.setCustomStateMapper`. `IStateMapper`s are regisered per block, so you supply both the `IStateMapper` and the block it works on. There is also a builder `StateMap.Builder` for some common use cases.

#### `StateMap.Builder`

You can use the builder `StateMap.Builder` for some of the most common usecases of custom `IStateMappers`. Simply instantiate one, call its setters, then `build()` it.

##### `setName`

`setName` takes a property as argument and sets that as the "name" of the returned MRL. When the resulting `IStateMapper` is called on a blockstate, it takes the value of the property given, then finds the name for that value, and uses that to construct the resource path. It is clearer with an example:

```java
PropertyDirection PROP_FACING = PropertyDirection.create("facing"); // Start with a property
IStateMapper mapper = new StateMap.Builder().setName(PROP_FACING).build(); // Use the builder
```

Now if we ask `mapper` to find the MRL for the blockstate `examplemod:block1[facing=east]`, it will map to `examplemod:east#normal`. If we ask it to map `examplemod:block2[facing=north,color=red]`, it will map to `examplemod:north#color=red`. If we ask it to map `examplemod:block3[color=white]`, it will NPE.

#### `setSuffix`

This is fairly simple. The suffix is a plain string that gets tacked on to the end of the resource path. So if the suffix is set to `_suff`, the `IStateMapper` will map the blockstate `examplemod:block[facing=east]` to the MRL `examplemod:block_suff#facing=east`.

#### `ignore`

This is also fairly self-explanatory. The `IStateMapper` will simply ignore the given properties when mapping a blockstate. Note that calling `ignore` twice will simply combine the two lists, and that a blockstate without one of the ignored properties will not cause an error in the mapper.

Using Item Models
-----------------

Unlike blocks, which automatically have a default `IStateMapper` that works without any extra registration, items must be registered to their models manually. Thankfully, this is very easy. Simply call `ModelLoader.setCustomModelResourceLocation`. This method takes the item and metadata we're registering a model for, and an MRL that points to a model. The way the game searches for the corresponding file is as follows:

1. For an MRL `<domain>:<path>#<varstr>`
2. Check blockstate JSON at `assets/<domain>/blockstates/<path>.json` for the variant `<varstr>`, and use that if available.
3. If that fails, check that `varstr.equals("inventory")` (Vanilla specialcasing)
4. If that succeeds, find the item model at `assets/<domain>/models/item/<path>`.

When using a JSON item model from `models/item`, you can also leverage [overrides].

!!! note
    When you call `ModelLoader.setCustomMRL`, it also calls `ModelBakery.registerItemVariants` with the item and MRL given. This sets up the model for baking later.

### `ItemMeshDefinition`

An `ItemMeshDefinition` is a function that takes `ItemStack`s and maps them to `ModelResourceLocations`. They are registered per item, and you can do so with `ModelLoader.setCustomMeshDefinition`, which takes an item and the `ItemMeshDefinition` to use for its `ItemStack`s.

!!! important
    When you call `ModelLoader.setCustomMeshDefinition`, it **does not** call `ModelBakery.registerItemVariants`. For each and every MRL your `ItemMeshDefinition` can return, you must call this method in order for it to work.

[overrides]: overrides.md
[blockstate JSONs]: blockstates/introduction.md
