ModelBlocks
===========

The `ModelBlock` rendering system is new in Minecraft 1.8, and it greatly reduces the number of special cases in the code, and provides a nice architecture within which people can create interesting shapes without having to write a single line of (Java) code.
The vanilla wiki has a comprehensive overview of how to use this system from the user perspective over [here](http://minecraft.gamepedia.com/Models), and if all you need is a static block with one state, everything you need to know is on that page.
However, if you want to create an object that changes it's state depending on how it's placed or the world around it, it's time to roll up your sleeves and get ready to write some code.

When creating blocks that use this type of rendering, you will be writing very little actual graphics code.
In fact, most of the work you're going to be doing here is stuff you'll need to do for any block that stores it's state in metadata, regardless of how it's rendered.
Here, we're going to show how the `snowy` property on grass blocks works, as it should give a pretty good overview about how you would go about creating your own environment reactive (and metadata/stateful) properties.

The process of turning JSON in to a renderable object consists of several stages, which will we go through in varying levels of detail.
  - *Parsing of the actual JSON* - This part isn't particularly interesting (unless you want to add custom shapes to the JSON parse, but that is beyond the scope of this document).
    If you're really interested, the parsing happens in `net.minecraft.client.resources.model` as part of resource pack loading.
    As with most things resolved against resource packs, model block assets will be resolved relative to `assets/modname`.
  - *Enumeration of model states* - When MC is ready to start drawing worlds, it walks the list of all known blocks and gathers up a list of all the states those blocks can be in.
    During this step, MC caches all the `BlockModel`s it will ever possibly need.
    This means that your block must have some reasonable number of (graphical) states, and you must be wary of [combinatorial explosion](http://en.wikipedia.org/wiki/Combinatorial_explosion).
    It is possible to generate models and textures at runtime (see [DenseOres](https://github.com/rwtema/DenseOres/tree/c0931073131fdae7a015ddaddd56949bc33453f2) for a nicely commented mod that does this) but unless you have a compelling reason to, this should probaly be avoided as it could break in strange ways.
    Forge does not currently support lazily loading models, so if you need complex behavior you'll probably need to make your block a [tile entity](tileentity.md).

    There is some automatic magic around the `facing` property, as if your block has one the default `Block.rotateBlock` method will keep it in sync.
    Other than that though, you're more or less on your own.
  - *Render models* - When it comes time to actually render your blocks, the rendering system will use the `StateMapper` associated with your block type (or a default one) to turn the state of your block in to a resources location.
    That resource location is turned in to a `ModelBlock` which is then responsible for spitting the right verticies at the `WorldRenderer`, at which point your block is now in the vertex buffer for the chunk and will be displayed.
    As with JSON parsing, most of this infrastructure should Just Work (TM) and you won't have to worry about it unless you want to do something special and funky, in which case you likely want to check out the `net.minecraft.client.renderer.block` package.

The Default `StateMapper`
-------------------------

`StateMapper`s are at the core of the magic of the new static block rendering.
It allows the MC runtime to choose the correct variant of a block based on the current `BlockState` for that block, removing a lot of the special-case code that existed in previous versions of the game.
The default `StateMapper` will use the block state JSON file located at `assets/modname/blockstates/block_name.json`, where `modname` is your `modid` and `block_name` is the mod-unique name you used when registering the block with the `GameRegistry`.
Most of the time, you won't actually have to write your own `StateMapper`: if you use the built-in property system, (from `net.minecraft.block.properties`) you can just assume the game will figure everything out.
Of course, you do need to provide some information.
So, to start our custom grass block implementation, we're going to need a property that we want to keep track of. Snowyness is a good example, as it's pretty self contained:

```java
// somewhere, probably in your block class
public static final PropertyBool SNOWY = PropertyBool.create("snowy");
```

We'll need to initialize the default state of our property by calling `setDefaultState` on our block.
`setDefaultState` takes an `IBlockState` which we can create from our property by requesting a default state from the block. Usually this is all done in the block constructor, so something like

```java
this.blockState.getBaseState()
```

will give us a clean state object. To add our `SNOWY` property to it, all we'll need to do is invoke `withProperty` which expects an `IProperty` and a value of the type the property tracks. In this case,

```java
withProperty(SNOWY, false);
```
should do just fine.
Putting things in context, it'll look something like this:

```java
this.setDefaultState(this.blockState.getBaseState().withProperty(SNOWY, false));
```

This isn't sufficient to get the nice `snowy=true` and `snowy=false` to work in the JSON however, we're going to have to write a bit of code to tell the game what properties our block has.
To do this, we need to override the `createBlockState` method.
`createBlockState` returns a `BlockState`, essentially a container for the list of properties our block will have.
Fortunately the `BlockState` constructor is varardic, so we can just list out the properties.

```java
    @Override
    protected BlockState createBlockState() {
        return new BlockState(this, SNOWY);
    }
```

Additionally, we need to tell the game how to convert our properties in to the 4-bit metadata value.
Since we can compute whether or not the block is snowy at runtime, we're just going to tell the game that the metadata is always 0.
```java
    @Override
    public int getMetaFromState(IBlockState state) {
        return 0;
    }
```

We also need to be able to return the right state depending on the state of the world when rendering takes place.
In order to do this, we'll override the `getActualState` to check if the block above us is snow, and report that in the `BlockState`.
Similar to how we set the `SNOWY` property in the default `BlockState`, we'll just use `withProperty` to set `SNOWY` to true.
In this case, we want to know when the block above us is snow.

```java
    @Override
    public IBlockState getActualState(IBlockState state, IBlockAccess world, BlockPos pos) {
        Block b = world.getBlockState(pos.up()).getBlock();
        return state.withProperty(SNOWY, b == Blocks.snow || b == Blocks.snow_layer);
    }
```

To make this actually do something interesting, we'll have to set up our blockstate JSON file correctly.
For a syntax reference, see the vanilla wiki page [here](http://minecraft.gamepedia.com/Models) which is a fantastic reference when working on creating your own blocks and block state json files.
Here, we only have one state variable and we won't be doing any interesting variants so the file will be pretty simple: just a root node, with a `variants` property.
```json
{
    "variants" : {}
}
```

To specify the variants, we'll just add tags for each of the states:

```json
{
    "variants" : {
        "snowy=true" : {},
        "snowy=false" : {}
    }
}
```

Each of those tags will specify what model we want to use (along with some other optional information, see the vanilla wiki page [here](http://minecraft.gamepedia.com/Models) for a full explanation), which will go something like this:

```json
"snowy=true": { "model" : "modname:snowy_grass" }
```

Notice the usage of the usual `modname:` syntax for namespaced resources: block models don't try to inherit their resource namespace from the blockstate JSON that references them, so you'll have to explicit here.
This will tell the block model system to look up a model JSON file in `assets/modname/models/block`.
The syntax for the block model files themselves can be quite intricate, but fortunately there are plenty of examples both [online](http://minecraft.gamepedia.com/Models) and in the `recompSrc/assets` directory in your `decomp` workspace.
If you want your block to render properly in the inventory, there's a bit more work involved, but all that is covered over on the [inventory rendering](inventory.md) page.
Everything else is handled automatically, and as long as your JSON is set up right, everything will Just Work(TM).
Of course, sometimes we need a bit more control over what properties change the visuals of our block, and for that we turn to the default `StateMapper`'s more powerful cousin, housed at `net.minecraft.client.renderer.block.statemap.StateMap`.

General StateMaps
-----------------

The most common use for the `StateMap` class is when you have a block with some `Property` that you need for other reasons but want to ignore when rendering, as it doesn't affect the visuals of the block.
Redstone powered state is a common candidate for this sort of thing.
For example, lets say our `BlockCustomGrass` needed to know if it was powered.
We'll add a powered property:

```java
public static final PropertyBool POWERED = PropertyBool.create("powered");
```

We'll need to add this property to our default block state.
Fortunately `withProperty` returns the new `BlockState` so we can chain calls to it, similar to how `setHardness` and friends work when configuring your block.

```java
this.setDefaultState(
    this.blockState.getBaseState().withProperty(SNOWY, false)
                                  .withProperty(POWERED, false)
);
```

We'll also need to modify the implementation of `createBlockState`, as the state we need to create is now a bit more complex.
This is where the varardic nature of the BlockState constructor comes in handy: all we need to do is add `POWERED` to the list of Properties.

```java
return new BlockState(this, SNOWY, POWERED);
```

Similarly, in your mod you'll need to modify `getActualState` to properly get the powered state of your block, but that will be left as an exercise for the reader.
Consider it practice!

We can no longer rely on the vanilla machinery figuring out right way to map our properties to JSON strings, so we'll have to give it a hand.
In our client proxy, we'll create a custom `StateMap`, using `StateMap.Builder` that ignores our `POWERED` state and tells the game to use that `StateMapper` when looking up the model for our block.
Fortunately for us, this is a common case in vanilla as well so there is a handy set of utilities available to us in the form of `StateMap` and `StateMap.Builder`.
`StateMap.Builder`s are used to build new `StateMap`s (well, you could manually construct one but really, why would you?).
Creating one is dead simple: the constructor takes no arguments, so all we need to do is

```java
StateMap.Builder smb = new StateMap.Builder();
```

In our case, we want to ignore our `POWERED` state, so we'll call `addPropertiesToIgnore`.
`addPropertiesToIgnore` takes a list of properties to, well, ignore!
You can call this as many times as you like, or just list out all the properties at once: `addPropertiesToIgnore` is varardic, so it'll take as many properties as you can throw at it.
Here we only have one: the `POWERED` state.

```java
smb.addPropertiesToIgnore(BlockCustomGrass.POWERED);
```

Note that we're referring to a `BlockCustomGrass` here: that's just some namespacing to emphasize the fact that this takes place in your client proxy as part of the pre-initialization phase, not in the block class.
Once we've described what properties we want to track, all we need to do is build the `StateMap`, using `build`.

```java
StateMap sm = smb.build();
```

Once we've got a `StateMap`, it's a simple matter to register it with the `ModelLoader`.
`ModelLoader` has a lot of interesting functionality, but all we're interested in right now is the capability to register custom state mappers with `setCustomStateMapper`.
`setCustomStateMapper` takes two arguments: the class type of the block the mapper is for, and the mapper itself.
Continuing our example, we'll register the `StateMapper` for our `BlockCustomGrass`:

```java
ModelLoader.setCustomStateMapper(BlockCustomGrass.class, sm);
```

Putting it all together, it would probably look something like this:

```java
ModelLoader.setCustomStateMapper(
    BlockCustomGrass.class,
    (new StateMap.Builder())
        .addPropertiesToIgnore(BlockCustomGrass.POWERED).build());
```

The `StateMap.Builder` has two more methods which we will touch on briefly here.
First up is `setProperty`.
`setProperty` is useful when you want to break up your blockstate JSON files a little bit.
Vanilla Minecraft leverages this capability for things like slabs and stairs that are internally represented by one `Block` class, but effectively have multiple conceptual materials.
The effect of `setProperty` is essentially to "lift" the selection of the variant from the in-file "variants" section to choosing different blockstate JSON resource locations for different values of the property.
As an example, we can take a look at the vanilla `stone` block.
`stone` has a `StateMap` constructed as follows:

```java
(new StateMap.Builder()).setProperty(BlockStone.VARIANT).build()
```

The `BlockStone.VARIANT` property is a `PropertyEnum` which serializes to one of `stone`, `granite`, `smooth_granite`, `diorite`, `smooth_diorite`, `andesite`, or `smooth_andesite`.
This is why if you open up the `blockstates/stone.json` file you won't find specifications for granite, diorite, or andesite.
The `StateMapper` in play here has actually mapped those different stone types to different resource locations: in this case `minecraft:blockstates/granite.json`, `minecraft:blockstates/smooth_granite`, etc...

The final method of `StateMap.Builder` we have yet to look at is `setBuilderSuffix`.
For a specific example, we'll look at the vanilla `stone_slab2` statemapper (we're looking at `stone_slab2` over `stone_slab` because it's slightly simpler).
This is the builder that vanilla maps to `stone_slab2`:

```java
(new StateMap.Builder()).setProperty(BlockStoneSlabNew.VARIANT).setBuilderSuffix("_slab")
```

`BlockStoneSlabNew.VARIANT` will only ever serialize to `red_sandstone` (at least in 1.8), so we would naturally expect this `StateMapper` to always return `minecraft:blockstates/red_sandstone.json` for the blockstate.
However, this would create a name conflict with the actual `red_sandstone` block.
This is why we need the `setBuilderSuffix("_slab")` call: it causes the `StateMap` to always append `"_slab"` to the end of the resource location, effectively resolving our potential name conflict with the full `red_sandstone` block.

Of course, sometimes you need *even more* power, for which we can go one more level up the inheritance tree...

The `IStateMapper` Interface
----------------------------

This is the great granddaddy of the `StateMap` class we've been looking at so far.
In a lot of ways this is the least interesting utility wise, as most of the time `StateMap` is sufficient to handle anything you can throw at it.
However, for those times when you need the absolute maximum amount of control over how `IBlockStates` are transformed in to `ModelResourceLocation`s, `IStateMapper` is how you go about it.
So without further ado, `IStateMapper`!

```java
@SideOnly(Side.CLIENT)
public interface IStateMapper {
    Map putStateModelLocations(Block b);
}
```

Perhaps some type signatures can clear things up

```java
@SideOnly(Side.CLIENT)
public interface IStateMapper {
    Map<IBlockState, ModelResourceLocation> putStateModelLocations(Block b);
}
```

Essentially, this sums up everything we've been trying to accomplish so far.
In a way, this interface is responsible for both steps 2 and 3 mentioned way back at the start: for every `IStateMapper` that MC knows about at resource pack load time, the game will ask that it enumerate every possible state for a block and map those states to `ModelResourceLocation`s.
Those mappings are then used at draw time to figure out what block should get rendered.
If you want to use this interface, it's possible that your usecase could be better served by extending `StateMapperBase` which provides a few utilities, chief among them `getPropertyString` which allows you to turn a `Map<IProperty, Comparable>` into a pretty property string of the form `prop1=val1,prop2=val2`.
