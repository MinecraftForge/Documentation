Connecting Blocks and Items to Models
=====================================

Block Models
------------

Blocks are not directly linked to models, instead, block*states* are mapped to `ModelResourceLocation`s, which point to [blockstate JSONs][], which themselves define models. An `IBlockState` is mapped to a `ModelResourceLocation` by an `IStateMapper`. The default statemapper works as follows:

1. Get the registry name of the blockstate's block.
2. Set said name as the `ResourceLocation` part of the MRL.
3. Get all properties and their values in the blockstate.
4. Get the name of each property with `IProperty#getName`.
5. Get the name of each value with `IProperty<T>#getName(T)`.
6. Sort the pairs alphabetically by the name of the *property only*.
7. Produce a comma delimited string of key-value pairs (e.g. `a=b,c=d,e=f`).
8. Set that as the variant part of the MRL.
9. If the variant string is empty, set it to `normal`.

The variant string gets silently `toLowerCase`d, so if your statemapper returns `mod:model#VARIANT`, the game will query the JSON for the string "variant", not "VARIANT."

### Custom `IStateMapper`s

It's quite easy to use a custom `IStateMapper`. Once you have an instance of it, simply call `ModelLoader.setCustomStateMapper`. `IStateMapper`s are registered per block, so you supply both the `IStateMapper` and the block it works on. There is also a builder `StateMap.Builder` for some common use cases.

#### `StateMap.Builder`

You can use the builder `StateMap.Builder` for some of the most common use cases of custom `IStateMapper`s. Simply instantiate one, call its setters, then `build()` it.

##### `withName`

`withName` takes a property as argument and sets that as the "name" (actually the path) of the returned MRL. When the resulting `IStateMapper` is called on a blockstate, it takes the value of the property given, then finds the name for that value, and uses that to construct the resource path. It is clearer with an example:

```java
PropertyDirection PROP_FACING = PropertyDirection.create("facing"); // Start with a property
IStateMapper mapper = new StateMap.Builder().withName(PROP_FACING).build(); // Use the builder
```

Now if we ask `mapper` to find the MRL for the blockstate `examplemod:block1[facing=east]`, it will map to `examplemod:east#normal`. If we ask it to map `examplemod:block2[color=red,facing=north]`, it will map to `examplemod:north#color=red`.

##### `withSuffix`

The suffix is a plain string that gets tacked on to the end of the resource path. So if the suffix is set to `_suff`, the `IStateMapper` will map the blockstate `examplemod:block[facing=east]` to the MRL `examplemod:block_suff#facing=east`.

##### `ignore`

This is also fairly self-explanatory. The `IStateMapper` will simply ignore the given properties when mapping a blockstate. When called twice, the two lists are merged. An example:

```java
PropertyDirection PROP_OUT = PropertyDirection.create("out");
PropertyDirection PROP_IN = PropertyDirection.create("in");
// These two are equivalent
IStateMapper together = new StateMap.Builder().ignore(PROP_OUT, PROP_IN).build();
IStateMapper merged = new StateMap.Builder().ignore(PROP_OUT).ignore(PROP_IN).build();
```

If we ask either `together` or `merged` to map the blockstate `examplemod:block1[in=north,out=south]`, they'll give the MRL `examplemod:block1#normal`. Given `examplemod:block2[in=north,out=south,color=blue]`, they'll produce `examplemod:block2#color=blue`. Finally, given `examplemod:block3[color=white,out=east]` (no `in`), they'll produce `examplemod:block3#color=white`.

Item Models
-----------

Unlike blocks, which automatically have a default `IStateMapper` that works without any extra registration, items must be registered to their models manually. Thankfully, this is very easy. Simply call `ModelLoader.setCustomModelResourceLocation`. This method takes the item and metadata we're registering a model for, and an MRL that points to a model. The way the game searches for the corresponding file is as follows:

1. For an MRL `<domain>:<path>#<varstr>`
2. Check blockstate JSON at `assets/<domain>/blockstates/<path>.json` for the variant `<varstr>`, and use that if available.
3. If that fails, check that `varstr.equals("inventory")`. (Vanilla specialcasing)
4. If that succeeds, find the item model at `assets/<domain>/models/item/<path>`.

When using a JSON item model from `models/item`, you can also leverage [overrides][].

!!! note
    When you call `ModelLoader.setCustomModelResourceLocation`, it also calls `ModelBakery.registerItemVariants` with the item and MRL given. This sets up the model for baking later.

### `ItemMeshDefinition`

An `ItemMeshDefinition` is a function that takes `ItemStack`s and maps them to `ModelResourceLocation`s. They are registered per item, and you can do so with `ModelLoader.setCustomMeshDefinition`, which takes an item and the `ItemMeshDefinition` to use for its `ItemStack`s.

!!! important
    When you call `ModelLoader.setCustomMeshDefinition`, it **does not** call `ModelBakery.registerItemVariants`. For each and every MRL your `ItemMeshDefinition` can return, you must call this method in order for it to work.

### Blockstate JSONs for Items

Note that *items* can use *block*state JSONs. This is possible by simply passing an MRL pointing to a blockstate JSON into `ModelLoader.setCustomModelResourceLocation` or returning it from an `ItemMeshDefinition`. Doing so allows you to take advantage of things like submodels and combining variants for item models. The two main use cases are items that share their models with blocks (especially `ItemBlock`s) and the default item layer model as you can use the `textures` block inside combining variant definitions to build up the layers of the model (one property setting `layer0`, another setting `layer1`, etc.).

!!! note
    1.9 multipart blockstates will not work with this.

!!! important
    
    There is one major caveat. Blockstate JSONs can only resolve paths to models under `models/block`; they cannot see models under `models/item` (even using `../item` causes an error). This means that you cannot directly use the `minecraft:item/generated` model (which sets the defualt transforms for items) in a blockstate JSON. As a workaround, use the `builtin/generated` model and set the transforms with the `transform` tag in the blockstate JSON. (Block models that inherit from `minecraft:block/block` already set transforms and therefore this isn't necessary for them.) Here's an example showing how to do so:
    
    ```json
    "defaults": {
      "model": "builtin/generated",
      "__comment": "Get Forge to inject the default rotations and scales for an item in your hand, on the ground, etc.",
      "transform": "forge:default-item"
    }
    ```

[blockstate JSONs]: blockstates/introduction.md
[overrides]: overrides.md
