Tile Entities Renderers
=======================

So, you've got a shiny new tile entity!
It's really great I'm sure: everybody will be super excited to err... wait.
It's not rendering yet is it?
One of the most powerful features of tile entities is the ability to associate them with `TileEntitySpecialRenderer`s (usually written TESRs when autocomplete is not available).
TESRs have several advantages over using the [block model](modelblock.md) system: they can be animated as their models are specified at runtime.
This also allows tile entities to generate their models in reaction to player input without attempting to load thousands of block models to handle every possible circumstance.
However, before you dive straight in to writing a new `TileEntitySpecialRenderer` for every tile entity in your mod, consider the number of graphical states the block will be in.
If your tile entity is only ever going to be displayed in a small handful of states (say, an on and off) it may be sufficient to leverage the [block model](modelblock.md) system.
Using block models is preferable to TESRs because they are much lighter weight in terms of CPU, memory, and GPU resources and allow resource pack creators more freedom in how they style your block.
Even if you can't use block models for your entire block, you can offload static components to the block model system and still get the full power of a TESR for the animated components.

Basic TESRs
-----------
Regardless of whether or not you are combining TESR and block model rendering, the first step is to register your renderer with the `ClientRegistry`
Registration is quite easy: you use the `ClientRegistry` to bind a `TileEntitySpecialRenderer` to your `TileEntity` class.
One thing to keep in mind is that the TESR registry will not walk the inheritance tree to find the renderer for a parent class if it fails to find a mapping.
This means that if you have some `TileEntityMyTEBase` class with some number of subclasses, you will need to register your TESR for each class individually: the registry won't automatically figure out that your specific subclasses could use the general renderer.
Since TESR registration goes through the `ClientRegistry`, you'll have to register it in your client proxy.
Fortunately the interface to bind new TESRs is quite easy to use, all you need to do is call

```java
ClientRegistry.bindTileEntitySpecialRenderer(MyTileEntity.class, new MyTileEntitySpecialRenderer());
```

Once registered, the game will use your custom TESR to render any tile entity of the class type you register.
To implement a TESR, all you need to do is extend `TileEntitySpecialRenderer` and implement `renderTileEntityAt`.
Its type signature is as follows:

```java
public abstract void renderTileEntityAt(TileEntity ent, double dx, double dz, double dy, float partialTicks, int breakState);
```

Here, `dx`, `dy`, and `dz` refer to the delta in position between your `TileEntity` and the player's position.
`partialTicks` will be in the range \[0, 1\) and represents how much of a game tick has occured since the last render frame.
The `partialTicks` input is usually used for animations that aren't really tied to the state of the object: the enchantment table uses it to create the bobbing book effect for example.
The final argument, `breakState`, is an integer in the range \[1, 10\] which correspond to the 10 break states a block progresses through when being broken.
Most of the time `TileEntity`s don't concern themselves with handling this properely: in vanilla, only chests, enderchests, signs and skulls declare support for rendering the breaking animation.
If you want to support breaking animations, see the section on [supporting breaking animations](#breaking-animation-support) below.

TODO: describe how to actually render something

Supporting Breaking Animations
------------------------------
#breaking-animation-support

TODO//tl;dr: 1-10 is the animation progress, 0 and -1 are used in different parts of the codebase when rendering unbroken stuff

Under The Hood
--------------

It turns out that `TileEntitySpecialRenderer`s aren't super interesting under the hood either.
When walking the list of blocks in a chunk to render, when it sees a tile entity it determines if that tile entity has a special renderer, and if it does adds it to the list of tile entities to render when that chunk needs to be drawn.
If there is no TESR registered, the block is drawn as usual with the [`ModelBlock`](modelblock.md) infrastructure.
