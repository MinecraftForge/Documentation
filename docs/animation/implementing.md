Using the API
======================

Depending on what you want to animate with the API, code-side implementation is a bit different.
Documentation on the ASM API itself (for controlling the animation) is found on the [ASM][asm] page because it is independent of what
you are animating.

Blocks
--------

Animations for blocks are done with the `AnimationTESR`, which is a `FastTESR`. Because of this, having a `TileEntity` for your block
is necessary. Your `TileEntity` must provide the `ANIMATION_CAPABILITY`, which is received by calling its `.cast` method with your
ASM. Your block must also render in the `ENTITYBLOCK_ANIMATED` render layer if you do not provide a `StaticProperty` in the block's blockstate.

The `StaticProperty` is a property you can add to your block's blockstate by adding `Properties.StaticProperty` to the list of your block's properties inside
of `createBlockState()`. When rendering the block, the `AnimationTESR` checks if the property's value is true; if so, block rendering continues as normal. Otherwise
the `AnimationTESR` animates the block model assigned to the `static=false` variant in the blockstate json. All parts of the model that can be static should probably
be rendered in the static state, as that is its purpose.

The `handleEvents()` callback is located _in_ the `AnimationTESR`, so you have to either subclass or overload it inline when you register the tileentity.

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

In this example, we've overridden the `handleEvents()` callback when we registered the TESR because the implementation is simple, but you could easily subclass
AnimationTESR to achieve the same effect. The `handleEvents()` callback for blocks takes two arguments: the tile entity being rendered, and an iterable of the events.
The call to `chest.handleEvents()` calls a method located in the fictional `Chest` TileEntity, as the ASM is not accessible inside of the `handleEvents()` method.

Items
-------

Animations for items are done entirely using the capability system. Your item must provide the `ANIMATION_CAPABILITY` through an `ICapabilityProvider`. You can create
an instance of this capability using its `.cast` method with your ASM, which is usually stored on the `ICapabilityProvider` object itself. An example of this is below:

```java
private static class ItemAnimationHolder implements ICapabilityProvider
{
    private final VariableValue cycleLength = new VariableValue(4);

    private final IAnimationStateMachine asm = proxy.load(new ResourceLocation(MODID.toLowerCase(), "asms/block/engine.json"), ImmutableMap.<String, ITimeValue>of(
        "cycle_length", cycleLength
    ));

    @Override
    public boolean hasCapability(@Nonnull Capability<?> capability, @Nullable EnumFacing facing)
    {
        return capability == CapabilityAnimation.ANIMATION_CAPABILITY;
    }

    @Override
    @Nullable
    public <T> T getCapability(@Nonnull Capability<T> capability, @Nullable EnumFacing facing)
    {
        if(capability == CapabilityAnimation.ANIMATION_CAPABILITY)
        {
            return CapabilityAnimation.ANIMATION_CAPABILITY.cast(asm);
        }
        return null;
    }
}
```

There is no way to receive events on an item in the current implementation.

Entities
----------

In order to animate an entity with the animation API, your entity's renderer must take an `AnimationModelBase` as its model. This model's constructor
takes two parameters, the location of the actual model to animate (as in the path to the JSON or B3D file, not a blockstate reference) and a `VertexLighter`.
The `VertexLighter` object can be created with `new VertexLighterSmoothAo(Minecraft.getMinecraft().getBlockColors())`.
The entity must also provide the `ANIMATION_CAPABILITY`, which can be created with its `.cast` method by passing the ASM.

The `handleEvents()` callback is located inside the `AnimationModelBase` class, if you want to use the events you must subclass `AnimationModelBase`. The callback
takes three parameters: the entity being rendered, the current time in partial ticks, and an iterable of the events that have occurred. 

An example of creating the renderer is shown below:

```java
ResourceLocation location = new ModelResourceLocation(new ResourceLocation(MODID, blockName), "entity");
return new RenderLiving<EntityChest>(manager, new net.minecraftforge.client.model.animation.AnimationModelBase<EntityChest>(location, new VertexLighterSmoothAo(Minecraft.getMinecraft().getBlockColors()))
{
    @Override
    public void handleEvents(EntityChest chest, float time, Iterable<Event> pastEvents)
    {
        chest.handleEvents(time, pastEvents);
    }
}, 0.5f) {

// ... getEntityTexture() ...

};
```

[asm]: asm.md
