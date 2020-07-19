Block Interaction
=================

There are many different ways players (and other things) can interact with blocks, such as right clicking, left clicking, colliding, walking on, and of course mining.

This page will cover the basics of the most common types of interaction with blocks.

Player Right Click
------------------
Since left clicking, or "punching", a block does not generally result in any unique behavior, it is probably fair to say right clicking, or "activation", is *the* most common method of interaction. And thankfully, it is also one of the simplest to handle.

`onBlockActivated`
----------------

```java
public boolean onBlockActivated(BlockState state, World worldIn, BlockPos pos, PlayerEntity player, Hand handIn, BlockRayTraceResult hit)
```

This is the method that controls right click behavior.

### Parameters
|         Type          |     Name     |                  Description                  |
|:---------------------:|:------------:|:----------------------------------------------|
|      `BlockState`     |   `state`    | The state of the block that was clicked       |
|        `World`        |  `worldIn`   | The world that the block was clicked in       |
|       `BlockPos`      |    `pos`     | The position of the block that was clicked    |
|     `PlayerEntity`    |   `player`   | The player who did the clicking               |
|         `Hand`        |   `handIn`   | The hand with which the player clicked        |
| `BlockRayTraceResult` |    `hit`     | Where on the block's bounds it was hit        |

#### Return Value

What is this magic boolean which must be returned? Simply put this, is whether or not the method "did" something. Return true if some action was performed, this will prevent further things from happening, such as item activation.


!!! important
    Returning `false` from this method on the client will prevent it being called on the server. It is common practice to just check `worldIn.isRemote` and return `true`, and otherwise go on to normal activation logic. Vanilla has many examples of this, such as the chest.

### Usage examples

The uses for activation are literally endless. However, there are some common ones which deserve their own section.

#### GUIs

One of the most common things to do on block activation is opening a GUI. Many blocks in vanilla behave this way, such as chests, hoppers, furnaces, and many more. More about GUIs can be found on [their page](GUIs).

#### Activation

Another common use for activation is, well, activation. This can be something like "turning on" a block, or triggering it to perform some action. For instance, a block could light up when activated. A vanilla example would be buttons or levers.

!!! important
    `onBlockActivated` is called on both the client and the server, so be sure to keep the [sidedness] of your code in mind. Many things, like opening GUIs and modifying the world, should only be done on the server-side.

Block Placement
--------------------

`onBlockPlacedBy`
----------------

```java
public void onBlockPlacedBy(World worldIn, BlockPos pos, BlockState state, @Nullable LivingEntity placer, ItemStack stack)
```

Called by ItemBlocks after a block is set in the world, to allow post-place logic.


### Parameters:
|      Type       |     Name     |                  Description                  |
|:---------------:|:------------:|:----------------------------------------------|
|     `World`     |  `worldIn`   | The world that the block was placed in        |
|    `BlockPos`   |    `pos`     | The position where the block was placed       |
|   `BlockState`  |   `state`    | The state of the block that was placed        |
|  `LivingEntity` |   `placer`   | The entity who placed the block               |
|   `ItemStack`   |   `stack`    | The item block that was placed                |

Player Break/Destroy
--------------------

`onBlockClicked`
----------------

```java
public void onBlockClicked(BlockState state, World worldIn, BlockPos pos, PlayerEntity player)
```

Called on a block when it is clicked by a player.

!!! Note
    
    This method is for when the player *left-clicks* on a block.
    Don't get this confused with `onBlockActivated`, which is called when the player *right-clicks*.

### Parameters:
|      Type       |     Name     |                  Description                  |
|:---------------:|:------------:|:----------------------------------------------|
|   `BlockState`  |   `state`    | The state of the block that was clicked       |
|     `World`     |  `worldIn`   | The world that the block was clicked in       |
|    `BlockPos`   |    `pos`     | The position of the block that was clicked    |
|  `PlayerEntity` |   `player`   | The player who did the clicking               |

### Usage example
This method is perfect for adding custom events when a player clicks on a block.

By default this method does nothing.  
Two blocks that override this method are the **Note Block** and the **RedstoneOre Block**.

The Note block overrides this method so that when left-clicked, it plays a sound.  
The RedstoneOre block overrides method so that when left-clicked, it gives off emits faint light for a few seconds.

`onBlockHarvested`
----------------

```java
public void onBlockHarvested(World worldIn, BlockPos pos, BlockState state, PlayerEntity player)
```

Called before the Block is set to air in the world. Called regardless of if the player's tool can actually collect this block.

### Parameters:
|      Type       |    Name     |                 Description                  |
|:---------------:|:-----------:|:---------------------------------------------|
|     `World`     |  `worldIn`  | The world that the block was destroyed       |
|   `BlockPos`    |    `pos`    | The position of the block that was destroyed |
|   `BlockState`  |   `state`   | The state of the block that was destroyed    |
|  `PlayerEntity` |   `player`  | The player who harvested the block           |

### Usage example
This method is perfect for adding custom events as a result of a player destroying a block

This method has important behavior in the `Block` class so be sure to call the super method.
```java
super.onBlockHarvested(worldIn, pos, state, player);
```

The **TNT Block** overrides this method to cause it's explosion when a player destroys it.  
This method is used by extended pistons; since an extended piston is made up of two blocks. (the extended head and the base)
The **PistonMoving Block** makes use of this method to destroy the base block when the PistonMoving block is destroyed. 


Entity Collision
----------------

`onEntityCollision`
----------------

```java
public void onEntityCollision(BlockState state, World worldIn, BlockPos pos, Entity entityIn)
```

This method is called whenever an entity collides with the block.


### Parameters:
|      Type       |    Name     |                    Description                   |
|:---------------:|:-----------:|:-------------------------------------------------|
|   `BlockState`  |   `state`   | The state of the block that was collided with    |
|     `World`     |  `worldIn`  | The world where the collided block is located    |
|   `BlockPos`    |    `pos`    | The position of the block that was collided with |
|    `Entity`     |  `entityIn` | The entity who collided with the block           |

### Usage examples

An example use of this method is by the `CampfireBlock` which uses this method to light those on fire that collide with the campfire.


[sidedness]: ../concepts/sides.md
