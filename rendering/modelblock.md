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
