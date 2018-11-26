Connecting Blocks and Items to Models
=====================================

Block Models
------------

Blocks are not directly linked to models, instead, block*states* are mapped to `ModelResourceLocation`s, which point to models ("models" includes blockstate JSONs). An `IBlockState` is mapped to a `ModelResourceLocation` by an `IStateMapper`. The default statemapper, which works by default for all blocks, works as follows:

1. Get the registry name of the blockstate's block.
2. Set said name as the `ResourceLocation` part of the `ModelResourceLocation`.
3. Get all properties and their values in the blockstate.
4. Get the name of each property with `IProperty#getName`.
5. Get the name of each value with `IProperty<T>#getName(T)`.
6. Sort the pairs alphabetically by the name of the *property only*.
7. Produce a comma delimited string of key-value pairs (e.g. `a=b,c=d,e=f`).
8. Set that as the variant part of the `ModelResourceLocation`.
9. If the variant string is empty (i.e. no properties defined), default the variant to `normal`.

The variant string is silently `toLowerCase`d, so if a statemapper returns `mod:model#VARIANT`, the game will query the JSON for the string "variant", not "VARIANT."

### Custom `IStateMapper`s

It's simple to use a custom `IStateMapper`. Once an instance is acquired, it may be registered with a call to `ModelLoader.setCustomStateMapper`. `IStateMapper`s are registered per block, so this method receives both the `IStateMapper` and the block it works on. There is also a builder `StateMap.Builder` for some common use cases.

#### `StateMap.Builder`

The builder `StateMap.Builder` can create `IStateMapper`s for some of the most common use cases. Once one is instantiated, methods can be called to set its parameters, and a call to `build` will generate an `IStateMapper` using those parameters.

##### `withName`

`withName` takes a property as argument and sets that as the "name" (actually the path) of the returned `ModelResourceLocation`. When the resulting `IStateMapper` is applied to a blockstate, it takes the value of the property given, then finds the name for that value, and uses that as the resource path. It is clearer with an example:

```java
PropertyDirection PROP_FACING = PropertyDirection.create("facing"); // Start with a property
IStateMapper mapper = new StateMap.Builder().withName(PROP_FACING).build(); // Use the builder
```

Now, if `mapper` is asked to find the `ModelResourceLocation` for the blockstate `examplemod:block1[facing=east]`, it will map it to `examplemod:east#normal`. Given `examplemod:block2[color=red,facing=north]`, it will map it to `examplemod:north#color=red`.

##### `withSuffix`

The suffix is a plain string that gets tacked on to the end of the resource path. For example, if the suffix is set to `_suff`, the resulting `IStateMapper` will map the blockstate `examplemod:block[facing=east]` to the `ModelResourceLocation` `examplemod:block_suff#facing=east`.

##### `ignore`

This causes the `IStateMapper` to simply ignore the given properties when mapping a blockstate. When called twice, the two lists are merged. An example:

```java
PropertyDirection PROP_OUT = PropertyDirection.create("out");
PropertyDirection PROP_IN = PropertyDirection.create("in");
// These two are equivalent
IStateMapper together = new StateMap.Builder().ignore(PROP_OUT, PROP_IN).build();
IStateMapper merged = new StateMap.Builder().ignore(PROP_OUT).ignore(PROP_IN).build();
```

When either `together` or `merged` are asked to map the blockstate `examplemod:block1[in=north,out=south]`, they'll give the `ModelResourceLocation` `examplemod:block1#normal`. Given `examplemod:block2[in=north,out=south,color=blue]`, they'll produce `examplemod:block2#color=blue`. Finally, given `examplemod:block3[color=white,out=east]` (no `in`), they'll produce `examplemod:block3#color=white`.

Item Models
-----------

Unlike blocks, which automatically have a default `IStateMapper` that works without any extra registration, items must be registered to their models manually. This is done through `ModelLoader.setCustomModelResourceLocation`. This method takes the item, a metadata value, and a `ModelResourceLocation`, and registers a mapping so that all `ItemStack`s with the item and metadata given use the given `ModelResourceLocation` for their model. The way the game searches for the model is as follows:

1. For a `ModelResourceLocation` `<namespace>:<path>#<varstr>`
2. Attempt to find a custom model loader that volunteers to load this model.
   1. If that succeeds, load the model with the found loader and break out of these instructions.
3. If that fails, attempt to load it from the blockstate JSON loader.
4. If that fails, attempt to load it from the vanilla JSON loader (which loads the model `assets/<namespace>/models/item/<path>.json`).

JSON item models from `models/item` can also leverage [overrides][].

!!! note
    `ModelLoader.setCustomModelResourceLocation` also calls `ModelLoader.registerItemVariants` with the item and `ModelResourceLocation` given. This sets up the model for baking later.

### `ItemMeshDefinition`

An `ItemMeshDefinition` is a function that takes `ItemStack`s and maps them to `ModelResourceLocation`s. They are registered per item, and this can be done with `ModelLoader.setCustomMeshDefinition`, which takes an item and the `ItemMeshDefinition` to use for its `ItemStack`s.

!!! important
    `ModelLoader.setCustomMeshDefinition` **does not** call `ModelLoader.registerItemVariants`. Therefore, `ModelLoader.registerItemVariants` method must be passed every `ModelResourceLocation` the `ItemMeshDefinition` can return in order for it to work.

### Blockstate JSONs for Items

Note that *items* can use *block*state JSONs. This is possible by simply passing a `ModelResourceLocation` pointing to a blockstate JSON into `ModelLoader.setCustomModelResourceLocation` or returning it from an `ItemMeshDefinition`. Doing so allows the model to take advantage of things like submodels and combining variants. The two main use cases are items that share their models with blocks (especially `ItemBlock`s) and the default item layer model (The `textures` block inside combining variant definitions can be used to build up the layers of the model, with one property setting `layer0`, another setting `layer1`, etc.).

!!! note
    1.9 multipart blockstates will not work as item models out of the box, as they require an `IBlockState` to select a model.

!!! important

    There is one major caveat. Blockstate JSONs can only resolve paths to models under `models/block`; they cannot see models under `models/item` (even using `../item` causes an error). This means that the `minecraft:item/generated` model (which sets the default transforms for items) cannot be used in a blockstate JSON. As a workaround, the `minecraft:builtin/generated` model can be used instead and the transforms set with the `transform` tag in the blockstate JSON. (Block models that inherit from `minecraft:block/block` already set transforms, so this isn't necessary for them.) Here's an example:

    ```json
    "defaults": {
      "model": "builtin/generated",
      "__comment": "Get Forge to inject the default rotations and scales for an item in a player's hand, on the ground, etc.",
      "transform": "forge:default-item"
    }
    ```

[blockstate JSONs]: blockstates/introduction.md
[overrides]: overrides.md
