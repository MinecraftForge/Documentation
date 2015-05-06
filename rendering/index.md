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

Head over to the [overview](overview.md) page to get a top-down perspective on Minecraft's rendering pipeline.
