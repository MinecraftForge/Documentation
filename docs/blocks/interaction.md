Block Interaction
=================

There are many different ways players (and other things) can interact with blocks, such as right clicking, left clicking, colliding, walking on, and of course mining.

This page will cover the basics of the most common types of interaction with blocks.

Player Right Click
------------------
Since left clicking, or "punching", a block does not generally result in any unique behavior, it is probably fair to say right clicking, or "activation", is *the* most common method of interaction. And thankfully, it is also one of the simplest to handle.

### `onBlockActivated`

This is the method that controls right click behavior, and it is a rather complicated one. Here is its full signature:

```java
public boolean onBlockActivated(World worldIn,
                                BlockPos pos,
                                IBlockState state,
                                EntityPlayer playerIn,
                                EnumHand hand,
                                @Nullable ItemStack heldItem,
                                EnumFacing side,
                                float hitX,
                                float hitY,
                                float hitZ)
```

There's quite a bit to discuss here.

#### Parameters

The first few parameters are obvious, they are the current world, position, and state of the block. Next is the player that is activating the block, and the hand with which they are activating.

The next parameter, `heldItem`, is the `ItemStack` which the player activated the block with. Note that this parameter is `@Nullable` meaning it can be passed as null (i.e. no item was in the hand).

!!! important
    The ItemStack passed to this method is the one you should use for checking what was in the player's hand. Grabbing the currently held stack from the player is unreliable as it may have changed since activation.

The last four parameters are all related. `side` is obviously the side which was activated, however `hitX`, `hitY`, and `hitZ` are a bit less obvious. These are the coordinates of the activation on the block's bounds. They are on the range 0 to 1, and represent where exactly "on" the block the player clicked.

#### Return Value

What is this magic boolean which must be returned? Simply put this, is whether or not the method "did" something. Return true if some action was performed, this will prevent further things from happening, such as item activation.


!!! important
    Returning `false` from this method on the client will prevent it being called on the server. It is common practice to just check `worldIn.isRemote` and return `true`, and otherwise go on to normal activation logic. Vanilla has many examples of this, such as the chest.

### Uses

The uses for activation are literally endless. However, there are some common ones which deserve their own section.

#### GUIs

One of the most common things to do on block activation is opening a GUI. Many blocks in vanilla behave this way, such as chests, hoppers, furnaces, and many more. More about GUIs can be found on [their page](GUIs).

#### Activation

Another common use for activation is, well, activation. This can be something like "turning on" a block, or triggering it to perform some action. For instance, a block could light up when activated. A vanilla example would be buttons or levers.

!!! important
    `onBlockActivated` is called on both the client and the server, so be sure to keep the [sidedness] of your code in mind. Many things, like opening GUIs and modifying the world, should only be done on the server-side.

Player Break/Destroy
--------------------
*Coming Soon*

Player Highlighting
-------------------
*Coming Soon*

Entity Collision
----------------
*Coming Soon*

[sidedness]: ../concepts/sides.md
