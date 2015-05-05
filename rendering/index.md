Graphics and Rendering
======================

Understanding how Minecraft renders blocks and models is critical if you wish to create interesting objects in the game that go beyond collections of static cubes.

Creating interesting objects got much easier in 1.8 with the new [`ModelBlock`](modelblock.md) machinery.
For most simple, static block models you no longer need to write any code: you can use the same machinery vanilla MC uses for stairs, fences, doors and the like.
However, if you want animated and interesting blocks (like the vanilla armor stands and enchantment table) you'll have to get your hands dirty and write some code.

MC 1.8 world rendering is quite different from how it was rendered in pre-1.8 version.
Historically, MC has used what's known as the _fixed function_ OpenGL pipeline to render, and a technology known as _display lists_ to accelerate it.
However, these techniques are now decades old, have been depreciated officially since 2008 (de-facto essentially since the late 90s), and far more efficient paths through the driver now exist.
MC 1.8 starts the long slog towards transitioning to that technology.
A large segment of the code ([tile entities](tileentity.md) and [entities](entity.md) in particular) are still using display lists, though TheMogMiner has been making noises to the effect that this won't be the case in 1.9.
Regardless of what 1.9 will bring, we're here to talk about how things currently stand in 1.8.

You can use one of the links above to read a discussion about that specific part of the rendering infrastructure, or head over to the [overview](overview.md) page to get a top-down perspective on Minecraft's rendering pipeline.