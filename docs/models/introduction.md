Intro to Models
===============

Old Models
----------

In the olden days of 1.7.10 and below, if you wanted a block/item shape that wasn't the standard 6-face cube/3D texture, you'd have to write custom rendering code to display that shape. You'd hardcode your shape into a class that implements `ISimpleBlockRenderingHandler` or `IItemRenderer`, and register that class. Blocks using ISBRHs would also have to declare the ID of the renderer. Items would be registered directly to their IIR. This worked, but it had several issues:

- They are slow and singlethreaded (because they need direct OpenGL access).
- Codewise, they're just ugly, as you have tons of rendering code.
- No one can change your block's shape, as it is hardcoded into your classes.

New Models
----------

In 1.8, Mojang introduced the model system. Block and item shapes are now part of the resource pack, and are defined as [JSON] text (you can use other file types too). Now, it is possible to override block shapes from within resource packs. Because they are loaded and baked once at resource pack load, they are also *far* faster.

[JSON]: http://www.json.org/
