Block Interaction
=================

There are many different ways players (and other things) can interact with blocks, such as right clicking, left clicking, colliding, walking on, and of course mining.

This page will cover the basics of the most common types of interaction with blocks.

Player Right Click
------------------
Since left clicking, or "punching", a block does not generally result in any unique behavior, it is probably fair to say right clicking, or "activation", is *the* most common method of interaction. And thankfully, it is also one of the simplest to handle.

`use`
----------------

```java
public InteractionResult use(BlockState state, Level level, BlockPos pos, Player player, InteractionHand hand, BlockHitResult hit)
```

This is the method that controls right click behavior.

### Parameters
|         Type          |     Name     |                  Description                  |
|:---------------------:|:------------:|:----------------------------------------------|
|      `BlockState`     |   `state`    | The state of the block that was clicked       |
|        `Level`        |  `level`   | The level that the block was clicked in       |
|       `BlockPos`      |    `pos`     | The position of the block that was clicked    |
|     `Player`    |   `player`   | The player who did the clicking               |
|         `InteractionHand`        |   `hand`   | The hand with which the player clicked        |
| `BlockHitResult` |    `hit`     | Where on the block's bounds it was hit        |

#### Return Value

`InteractionResult` is the result right clicking, see example usages below. `InteractionResult#SUCCESS` means the right click action was successful. `InteractionResult#CONSUME` means that the right click action was consumed. `InteractionResult#CONSUME_PARTIAL` means that the right click action is being consumed. `InteractionResult#PASS` is the default behavior, for when the block has no right click behavior, and allows something else to handle the right click. `InteractionResult#FAIL` means that the action failed.

|     Enum Value     |                           Example Usage                          |
|:------------------:|:----------------------------------------------------------------:|
|  `SUCCESS`         | Eating a slice of cake.                                          |
|  `CONSUME`         | Tuning a noteblock.                                              |
|  `CONSUME_PARTIAL` | Eating a carrot.                                                 |
|   `PASS`           | When right-clicking dirt. Or any other basic block.              |
|   `FAIL`           | When attempting to place a minecart on a block other than rails. |

!!! important
    Returning `InteractionResult#CONSUME` from this method on the client will prevent it being called on the server. It is common practice to just check `level#isClientSide` and return `InteractionResult#SUCCESS`, and otherwise go on to normal activation logic. Vanilla has many examples of this, such as the chest.

### Usage examples

The uses for activation are literally endless. However, there are some common ones which deserve their own section.

#### `Screen`s

One of the most common things to do on block activation is opening a `Screen`. Many blocks in vanilla behave this way, such as chests, hoppers, furnaces, and many more.

#### Activation

Another common use for activation is, well, activation. This can be something like "turning on" a block, or triggering it to perform some action. For instance, a block could light up when activated. A vanilla example would be buttons or levers.

!!! important
    `use` is called on both the client and the server, so be sure to keep the [sidedness][] of your code in mind. Many things, like opening `AbstractContainerMenu`s and modifying the level, should only be done on the server-side.

Block Placement
--------------------

`setPlacedBy`
----------------

```java
public void setPlacedBy(Level level, BlockPos pos, BlockState state, @Nullable LivingEntity placer, ItemStack stack)
```

Called by `BlockItem`s after a block is set in the level, to allow post-place logic.


### Parameters:
|      Type       |     Name     |                  Description                  |
|:---------------:|:------------:|:----------------------------------------------|
|     `Level`     |  `level`   | The level that the block was placed in        |
|    `BlockPos`   |    `pos`     | The position where the block was placed       |
|   `BlockState`  |   `state`    | The state of the block that was placed        |
|  `LivingEntity` |   `placer`   | The entity who placed the block               |
|   `ItemStack`   |   `stack`    | The item block that was placed                |

Player Break/Destroy
--------------------

`attack`
----------------

```java
public void attack(BlockState state, Level level, BlockPos pos, Player player)
```

Called on a block when it is clicked by a player.

!!! Note
    
    This method is for when the player *left-clicks* on a block.
    Don't get this confused with `use`, which is called when the player *right-clicks*.

### Parameters:
|      Type       |     Name     |                  Description                  |
|:---------------:|:------------:|:----------------------------------------------|
|   `BlockState`  |   `state`    | The state of the block that was clicked       |
|     `Level`     |  `level`   | The level that the block was clicked in       |
|    `BlockPos`   |    `pos`     | The position of the block that was clicked    |
|  `Player` |   `player`   | The player who did the clicking               |

### Usage example
This method is perfect for adding custom events when a player clicks on a block.

By default, this method does nothing.  
`NoteBlock` overrides this method so when left-clicked, it plays a sound. `RedStoneOreBlock` on left-click emits a faint light and spawns particles around itself.

`playerWillDestroy`
----------------

```java
public void playerWillDestroy(Level level, BlockPos pos, BlockState state, Player player)
```

Called before the Block is set to air in the level. Called regardless of if the player's tool can actually collect this block.

### Parameters:
|      Type       |    Name     |                 Description                  |
|:---------------:|:-----------:|:---------------------------------------------|
|     `Level`     |  `level`  | The level that the block was destroyed       |
|   `BlockPos`    |    `pos`    | The position of the block that was destroyed |
|   `BlockState`  |   `state`   | The state of the block that was destroyed    |
|  `Player` |   `player`  | The player who harvested the block           |

### Usage example
This method is perfect for adding custom events as a result of a player destroying a block

This method has important behavior in the `Block` class so be sure to call the super method.
```java
super.playerWillDestroy(level, pos, state, player);
```

The `TntBlock` overrides this method to cause it's explosion when a player destroys it if its `unstable` property is `true`.  
This method is used by extended pistons; since an extended piston is made up of two blocks. (the extended head and the base)
The `PistonHeadBlock` makes use of this method to destroy the base block when the `PistonHeadBlock` is destroyed. 


Entity Collision
----------------

`entityInside`
----------------

```java
public void entityInside(BlockState state, Level level, BlockPos pos, Entity entity)
```

This method is called whenever an entity collides with the block.


### Parameters:
|      Type       |    Name     |                    Description                   |
|:---------------:|:-----------:|:-------------------------------------------------|
|   `BlockState`  |   `state`   | The state of the block that was collided with    |
|     `Level`     |  `level`  | The level where the collided block is located    |
|   `BlockPos`    |    `pos`    | The position of the block that was collided with |
|    `Entity`     |  `entity` | The entity who collided with the block           |

### Usage examples

An example use of this method is by the `CampfireBlock` which uses this method to light those on fire that collide with the campfire.


[sidedness]: ../concepts/sides.md
