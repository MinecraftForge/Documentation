Some Events Added by Vanilla Minecraft
======================================

There is exactly not all events by vanilla. All of event methods are public.

Registry Events
---------------

|                            Event                             | Description                                                  |
| :----------------------------------------------------------: | :----------------------------------------------------------- |
| `void onRegisterItems(final RegistryEvent.Register<Item> event)` | On `Item` register. Use `IForgeRegistry<Item> registry = event.getRegistry();` and register your items using `registry.register(Item item);` |
| `void onBlocksRegistry(final RegistryEvent.Register<Block> event)` | On `Block` register. Use `IForgeRegistry<Block> registry = event.getRegistry();` and register your blocks using `registry.register(Block block);` |

Block Interaction Events
------------------------

| Event                                                  | Calls when...   |
| ------------------------------------------------------ | --------------- |
| `void onBlockHarvested(BlockEvent.BreakEvent event)`   | ...block broken |
| `void onBlockPlace(BlockEvent.EntityPlaceEvent event)` | ...block placed |

Entity Events
-----------------

| Event                                                        | Calls when...          |
| ------------------------------------------------------------ | ---------------------- |
| `void onPlayerFall(PlayerEntity player, float distance, float multiplier)` | ...player falls        |
| `void pickupItem(EntityItemPickupEvent event)`               | ...entity pickups item |
| `void arrowNocked(ArrowNockEvent event)`                     | ...arrow nocks         |

