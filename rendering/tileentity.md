Tile Entities Renderers
=======================

So, you've got a shiny new tile entity!
It's really great I'm sure: everybody will be super excited to err... wait.
It's not rendering yet is it?

One of the most powerful features of tile entities is the ability to associate them with `TileEntitySpecialRenderer`s (usually written TESRs when autocomplete is not available).
TESRs have several advantages over using the [block model](modelblock.md) system.
The most commonly leveraged capability of TESRs is the fact that they can be animated.
Additionally, tile entities can to generate their models at runtime, meaning they aren't constrained to some pre-defined of models as pure block models are.
However, before you dive straight in to writing a new `TileEntitySpecialRenderer` for every tile entity in your mod, consider the number of graphical states the block will be in.
If your tile entity is only ever going to be displayed in a small handful of states (say active, inactive, and unable to activate) it may be sufficient to leverage the [block model](modelblock.md) system.
Using block models is preferable to TESRs because they are much lighter weight in terms of CPU, memory, and GPU resources and allow resource pack creators more freedom in how they style your block.
Even if you can't use block models for your entire block, you can offload static components to the block model system and still get the full power of a TESR for the animated components.

Basic TESRs
-----------
Regardless of whether or not you are combining TESR and block model rendering, the first step is to register your renderer with the `ClientRegistry`.
One thing to keep in mind is that the TESR registry will not walk the inheritance tree to find the renderer for a parent class if it fails to find a mapping.
This means that if you have some `TileEntityMyTEBase` class with some number of subclasses, you will need to register your TESR for each class individually: the registry won't automatically figure out that your specific subclasses could use the general renderer.
Since TESR registration goes through the `ClientRegistry`, you'll have to register it in your client proxy during the `init` phase.
Fortunately the interface to bind new TESRs is quite easy to use, all you need to do is call

```java
ClientRegistry.bindTileEntitySpecialRenderer(MyTileEntity.class, new MyTileEntitySpecialRenderer());
```

Once registered thusly, the game will use `MyTileEntitySpecialRenderer` to render any tile entity of the class type `MyTileEntity`.
If your tile entity has special requirements (i.e. `getBlock` returns null, or the tile entity needs to render in the translucent pass), you may want to take a look at the [`TileEntity` Plumbing](#tileentity-plumbing) section.

Implementing TESRs
------------------
To actually implement a TESR, all you need to do is extend `TileEntitySpecialRenderer` and implement `renderTileEntityAt`.
Its type signature is as follows:

```java
public abstract void renderTileEntityAt(TileEntity ent, double dx, double dz, double dy, float partialTicks, int breakState);
```

Here,  is `ent` is the tile entity instance we'll be rendering.
`dx`, `dy`, and `dz` refer to the delta in position between your `TileEntity` and the player's position.
`partialTicks` will be in the range \[0, 1\) and represents how much of a game tick has occurred since the last render frame.
The `partialTicks` input is usually used for animations that aren't really tied to the state of the object: the enchantment table uses it to create the bobbing book effect for example.
The final argument, `breakState`, is an integer in the range \[1, 10\] which correspond to the 10 break states a block progresses through when being broken.
Most of the time `TileEntity`s don't concern themselves with handling this properly: in vanilla, only chests, enderchests, signs and skulls declare support for rendering the breaking animation.
If you want to support breaking animations, see the section on [supporting breaking animations](#supporting-breaking-animations) below.

Like most dynamic elements in the game, most vanilla `TileEntitySpecialRenderer`s use the [model](model.md) system to draw their components.
This means you can use a tool like iChunn's [Tabula](http://ichun.us/mods/tabula-minecraft-modeler/) to create a model and drop it right in.
Here we won't be covering custom models (that's over on the [model](model.md)) page, but we will try to recreate the book bobbing effect used by the enchantment table.
We also won't be rendering the base or performing the page flipping animation.
Rendering of the base is a static task best handled by the [block model](modelblock.md) system, and the page flipping animation can be created with a bit of creativity using the tools you learn here.

In order to position our model we'll be using the `GlStateManager` to shift things around and rotate them.
Because we don't want to draw the rest of the world askew (or try and get floating point matrix multiplications to line back up) we're going to start by pushing the matrix stack.

```java
GlStateManager.pushMatrix();
```

We'll need to keep track of the current absolute accumulated time in order to make our animation smooth, so make sure to stash that somewhere on your tile entity.

```java
ent.renderElapsed += partialTicks;
```

Since we're trying to create a bobbing effect here, we want to have the vertical component vary with time.
I'm going to introduce an arbitrary floating point constant here, `BOB_RATE`, to represent the "wavelength" of bobs i.e. how many ticks will elapse before the book completes one full cycle
Setting this constant to about 63 will approximate the vanilla bob rate.
We could do something linear with `ent.renderElapsed % BOB_RATE`, but sharp changes in direction tend to be visually jarring and unappealing so we'll use `sin(ent.renderElapsed * 2 * Math.PI / BOB_RATE)` to create a much smoother effect.

```java
float y = 0.85f + (float)(MathHelper.sin(ent.renderElapsed * 2 * Math.PI * BOB_RATE) * 0.01f;
```

The offset/scaling constants make sure the book is in a "reasonable" place.
In the context of TESRs, an offset of `1.f` is equal to offsetting by exactly one block, so here we're making sure the book's origin is near the top of the block.
To actually render the book at the right height we'll use the `translate` function from `GlStateManager`.

```java
GlStateManager.translate(0.5f, y, 0.5f);
```

The `0.5f`s above are to center the book in the block.
Once we've positioned the model, all that's left to do before we clean up is to render the book model and then clean up the matrix stack.
Don't mind the parameters here: they just specify the rotation and parent entity of the book, which we aren't dealing with here.
See [the model page](model.md) if you want to learn all about this call.

```java
this.bookModel.render(null, 0, 0, 0, 0, 0, 0);
```

Once we've drawn the model, we'll just clean up after ourselves by popping the matrix stack, and we're done!

```java
GlStateManager.pushMatrix();
```

`TileEntity` Plumbing
---------------------
If you are planning on writing a TESR that either draws translucent geometry or returns null from `getBlock` you'll have to make one of two tweaks to your `TileEntity` class.

In order to get drawn in the translucent pass, you'll have to override the default implementation of `shouldRenderInPass`.
`shouldRenderInPass` takes only one argument: the render pass which is about to be generated.
This number will be one of two values: `0` for the solid geometry and `1` during the translucent pass.
The default implementation returns true only for the solid pass.
You are free to declare that you wish to render in both passes, but be aware that the same TESR and the same `renderTileEntityAt` method is called for both passes.
If you want to render both solid and translucent geometry, you'll likely want to test the value of `MinecraftForgeClient.getRenderPass()`.

The culling bounding box situation is slightly trickier.
You can override the culling bounding box computation explicitly by providing your own implementation of `getRenderBoundingBox`.
However, sometimes this is unnecessary as the default behavior of `getRenderBoundingBox` is to return the bounding box returned by
```java
this.getBlock().getCollisionBoundingBox(this.world, this.getPos()
                                       ,this.worldObj.getBlockState(this.getPos()));
```
which may be acceptable in your situation.
Should `this.getBlock()` return null, the default implementation will return a bounding box of infinite extent.
While leaving such behavior in place and always rendering your block will technically allow your block to work, it is preferable that you always return a tight-ish bounding box around your rendered object in keeping with being a good citizen of the modding community.
The performance cost of rendering one or two of your blocks may be insignificant, but there is little reason for you to unnecessarily cause additional load (read: lag) on your user's computers.
Your bounding box doesn't need to be perfect of course: vanilla uses a (-1, 0, -1) to (2, 1, 2) bounding box around chests for example.
You do however need to ensure the box is properly positioned in world space.
For example, the chest bounding box could be created as follows:
```java
new AxisAlignedBB(getPos().add(-1, 0, -1), getPos().add(2, 2, 2));
```

Supporting Breaking Animations
------------------------------

TODO//tl;dr: 1-10 is the animation progress, 0 and -1 are used in different parts of the codebase when rendering unbroken stuff

Under The Hood
--------------

It turns out that `TileEntitySpecialRenderer`s aren't super interesting under the hood either.
When walking the list of blocks in a chunk to render, when it sees a tile entity it determines if that tile entity has a special renderer, and if it does adds it to the list of tile entities to render when that chunk needs to be drawn.
If there is no TESR registered, the block is drawn as usual with the [`ModelBlock`](modelblock.md) infrastructure.
