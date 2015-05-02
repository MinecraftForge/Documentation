ModelBlocks
===========

The `ModelBlock` rendering system is new in Minecraft 1.8, and it greatly reduces the number of special cases in the code, and provides a nice architecture within which people can create interesting shapes without having to write a single line of (Java) code.
The vanilla wiki has a comprehensive overview of how to use this system from the user perspective over [here](http://minecraft.gamepedia.com/Models), and if all you need is a static block with one state, everything you need to know is on that page.
However, if you want to create an object that changes its state depending on how its placed or the world around it, it's time to roll up your sleeves and get ready to write some code.

When creating blocks that use this type of rendering, you will be writing very little actual graphics code.
In fact, you can create some quite powerful effects with only one or two lines of code.
Here, we're going to show how the `snowy` property on grass blocks works, as it should give a pretty good overview about how you would go about creating your own environment-reactive properties.

The process of turning JSON in to a renderable object consists of several stages, which will we go through in varying levels of detail.
  - *Parsing of the actual JSON* - This part isn't particularly interesting (unless you want to add custom shapes to the JSON parse, but that is beyond the scope of this document).
    If you're really interested, the parsing happens in `net.minecraft.client.resources.model` as part of resource pack loading.
  - *Enumeration of model states* - When MC is ready to start drawing worlds, it walks the list of all known blocks and gathers up a list of all the states those blocks can be in.
    During this step, MC caches all the `BlockModel`s it will ever possibly need.
    This means that your block must have some reasonable number of states, and you must be wary of [combinatorial explosion](http://en.wikipedia.org/wiki/Combinatorial_explosion).
    It is possible to generate models and textures at runtime (see [DenseOres](https://github.com/rwtema/DenseOres/tree/c0931073131fdae7a015ddaddd56949bc33453f2) for a nicely commented mod that does this) but unless you have a compelling reason to, this should probaly be avoided as it could break in strange ways.
    Forge does not currently support lazily loading models, so if you need more complex behavior you'll probably need to make your block a [tile entity](tileentity.md).

    There is some automatic magic around the `facing` property, as if your block has one the default `Block.rotateBlock` method will keep it in sync.
    Other than that though, you're more or less on your own.
  - *Render models* - When it comes time to actually render your blocks, the rendering system will use the `StateMapper` associated with your block type (or a default one) to turn the state of your block in to a resources location.
    That resource location is turned in to a `ModelBlock` which is then responsible for spitting the right verticies at the `WorldRenderer`, at which point your block is now in the vertex buffer for the chunk and will be displayed.
    As with JSON parsing, most of this infrastructure should Just Work (TM) and you won't have to worry about it unless you want to do something special and funky, in which case you likely want to check out the `net.minecraft.client.renderer.block` package.

The Default `StateMapper`
-------------------------

`StateMapper`s are at the core of the magic of the new static block rendering.
It allows the MC runtime to choose the correct variant of a block based on the current `BlockState` for that block, removing a lot of the special-case code that existed in previous versions of the game.
Most of the time, you won't actually have to write your own `StateMapper`: if you use the built-in property system, (from `net.minecraft.block.properties`) you can just assume the game will figure everything out.
Of course, you do need to provide some information.
So, to start our custom grass block implementation, we'll have to set up our Block class:

```java
// snip imports and package declaration
class BlockCustomGrass extends Block {
    // snip a whole bunch of important stuff for brevity's sake, I'll assume you already have a basic block working.
    public static final PropertyBool SNOWY = PropertyBool.create("snowy");

    public BlockCustomGrass() {
        this.setDefaultState(this.blockState.getBaseState().withProperty(SNOWY, Boolean.valueOf(false)));
    }
}
```

This isn't sufficient to get the nice `snowy=true` and `snowy=false` to work in the JSON however, we're going to have to write a bit of code to tell the game what properties our block has.
Additionally, we need to tell the game how to convert our properties in to the 4-bit metadata value.
Since we can compute whether or not the block is snowy at runtime, we're just going to tell the game that the metadata is always 0.

```java
    @Override
    protected BlockState createBlockState() {
        return new BlockState(this, new IProperty[] { SNOWY });
    }

    @Override
    public int getMetaFromState(IBlockState state) {
        return 0;
    }
```

We also need to be able to return the right state depending on the state of the world when rendering takes place.
In this case, we want to know when the block above us is snow.

```java
    @Override
    public IBlockState getActualState(IBlockState state, IBlockAccess world, BlockPos pos) {
        Block b = world.getBlockState(pos.up()).getBlock();
        return state.withProperty(SNOWY, Boolean.valueOf(b == Blocks.snow || b == Blocks.snow_layer));
    }
```

And we're done!
Everything else is handled automatically, and as long as your JSON is set up right, everything will Just Work(TM).
Of course, sometimes we need a bit more control over what properties change the visuals of our block, and for that we turn to the default `StateMapper`'s more powerful cousin, housed at `net.minecraft.client.renderer.block.statemap.StateMap`.

General StateMaps
-----------------

The most common use for the `StateMap` class is when you have a block with some `Property` that you need for other reasons but want to ignore when rendering, as it doesn't affect the visuals of the block.
Redstone powered state is a common candidate for this sort of thing.
For example, lets say our `BlockCustomGrass` needed to know if it was powered.

```java
class BlockCustomGrass extends Block {
    // snip a whole bunch of important stuff for brevity's sake, I'll assume you already have a basic block working.
    public static final PropertyBool SNOWY = PropertyBool.create("snowy");
    public static final PropertyBool POWERED = PropertyBool.create("powered");

    public BlockCustomGrass() {
        this.setDefaultState(
            this.blockState.getBaseState().withProperty(SNOWY, boolean.valueOf(false))
                                          .withProperty(POWERED, boolean.valueOf(False))
        );
    }

    @Override
    protected BLockState createBlockState() {
        return new BlockState(this, new IProperty[] { SNOWY, POWERED });
    }
    // Snip rest of the implementation, left as an excercise for the reader
    // You'll need to implement getActualState at least to get everything
    // working. If you're curious about how vanilla handles this sort of
    // thing, check out BlockDoor upon which much of this section is based.
}
```

Now of course, we can't rely on the vanilla machinery figuring out right way to map our properties to JSON strings so we'll have to give it a hand.
In order to describe our mapping, we'll need a client proxy
```java
import net.minecraftforge.client.model.ModelLoader;
public class ClientProxy extends CommonProxy {
    @Override
    public void preInit () {
        ModelLoader.setCustomStateMappeR(BlockCustomGrass.class,
            (new StateMap.Builder()).addPropertiesToIgnore(new IProperty[] {BlockCustomGrass.POWERED}).build())
        );
    }
}
```

Of course, sometimes you need *even more* power, for which we can go one more level up the inheritance tree...
