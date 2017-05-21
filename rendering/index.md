Graphics and Rendering
======================

Understanding how Minecraft renders blocks and models is critical if you wish to create interesting objects in the game that go beyond collections of static cubes.

Creating interesting objects got much easier in 1.8 with the new [`ModelBlock`](modelblock.md) machinery.
For most simple, static block models you no longer need to write any code: you can use the same machinery vanilla MC uses for solid blocks, stairs, fences, doors and the like.
However, if you want animated and interesting blocks (like the vanilla armor stands and enchantment table) you'll have to get your hands dirty and write some code.

MC 1.8 world rendering is quite different from how it was in pre-1.8 versions.
Historically, MC has used what's known as the _fixed function_ OpenGL pipeline to render, and a technology known as _display lists_ to accelerate it.
However, these techniques are now decades old, have been depreciated officially since 2008 (de-facto essentially since the late 90s), and far more efficient paths through the driver now exist.
MC 1.8 starts the long slog towards modernizing the rendering pipeline, hopefully a trend that will continue through 1.9.
Regardless of what 1.9 will bring, we're here to talk about how things currently stand in 1.8.

The entry point for the rendering system is at `EntityRenderer.updateCameraAndRender()`.
Despite its name, `EntityRenderer` is responsible for rendering the entire world, including tile entities and entities.
`EntityRenderer` is responsible for setting up the camera and then dispatching work out to a few subsystems which are covered in detail in other places:

  - [Culling](culling.md) works to minimize the amount of pointless work the later systems perform.
  - [Particles](particle.md) are rendered by the `EffectRenderer`.
  - [Static Blocks](modelblock.md) uses `ModelBlock`s to render anything that will only need to change when the whole render chunk is invalidated (i.e. not animated).
  - [Tile Entities](tileentity.md) are rendering using `TileEntitySpecialRenderers` (some people refer to these as TESRs).
  - [Entities](entity.md) are rendered using a `Render`, most of which just dispatch work to a `Model`.
