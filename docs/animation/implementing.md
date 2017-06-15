Implementing the API
======================

Depending on what you want to animate with the API, code-side implementation is a bit different.

Blocks
--------

Animations for blocks are done with the AnimationTESR, which is a FastTESR. Because of this, having a TileEntity for your block
is necessary. Your TileEntity must provide the `ANIMATION_CAPABILITY`, which is recieved by calling its `.cast` method with your
asm. Your block must also render in the `ENTITYBLOCK_ANIMATED` render layer.

<TODO: Insert code samples>

Items
-------

TODO

Entities
----------
TODO