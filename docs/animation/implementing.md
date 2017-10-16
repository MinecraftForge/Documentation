Implementing the API
======================

Depending on what you want to animate with the API, code-side implementation is a bit different.
Documentation on the ASM api itself (for controlling the animation) is found on the [ASM][asm] page because it is independent of what
you are animation.

Blocks
--------

Animations for blocks are done with the AnimationTESR, which is a FastTESR. Because of this, having a TileEntity for your block
is necessary. Your TileEntity must provide the `ANIMATION_CAPABILITY`, which is recieved by calling its `.cast` method with your
asm. Your block must also render in the `ENTITYBLOCK_ANIMATED` render layer.

The `handleEvents()` callback is located _in_ the AnimationTESR, so you have to either subclass or overload it inline when you register the tileentity.

Here's an example of registering the TESR:

```java
ClientRegistry.bindTileEntitySpecialRenderer(Chest.class, new AnimationTESR<Chest>()
{
    @Override
    public void handleEvents(Chest chest, float time, Iterable<Event> pastEvents)
    {
        chest.handleEvents(time, pastEvents);
    }
}); 
```

In this example, we've overrided the `handleEvents()` callback when we registered the TESR because the implementation is simple, but you could easily subclass
AnimationTESR to achieve the same effect.

Items
-------

TODO

Entities
----------
TODO

[asm]: asm.md