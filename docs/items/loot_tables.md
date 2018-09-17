Loot Tables
===========

Loot tables are an easy way to generate random loot given random distributions of items. They are used in vanilla to generate random chest loot as well as for mob drops.

The vanilla [wiki][] describes the loot table JSON format in great detail, so this article instead will focus on code that you might have to write to use and manipulate loot tables in your mod. To get the most out of this article, read the aforementioned [wiki][] page in its entirety before reading this article.

Registering a Modded Loot Table
-------------------------------

In order to make Minecraft load and be aware of your loot table, simply call `LootTableList.register(new ResourceLocation("modid", "loot_table_name"))`, which will resolve and load `/assets/modid/loot_tables/loot_table_name.json`. This call can be made during any of preinit, init, or postinit. You may organize your tables into folders freely.

!!! Note 
    Loot pools in mod loot tables must include an additional `name` tag that uniquely identifies that pool within the table. A common strategy is to name the pool with the kinds of items that its entries contain.
    If you specify multiple loot entries with the same `name` tag (e.g. the same item but with different functions each time), then you must give each of those entries an `entryName` tag that uniquely identifies that entry within the pool. For `name` tags that do not clash, then `entryName` is automatically set to the value of `name`.
    These additional requirements are imposed by Forge to facilitate modification of tables at load time using `LootTableLoadEvent` (see below).

Registering Custom Objects
--------------------------

In addition to vanilla's, you can also register your own loot conditions, loot functions, and entity properties.

Entity properties are solely for use of the `minecraft:entity_properties` loot condition, and are used to test if entities involved in the looting (the looted entity or the killer) have certain properties. The only property in vanilla is `minecraft:on_fire`.

All three are registered similarly, by calling `LootConditionManager.registerCondition`, `LootFunctionManager.registerFunction()`, or `EntityPropertyManager.registerProperty()`, respectively.

The methods take a `Serializer` instance, which takes the ID of the object as a `ResourceLocation`, and the `Class` implementing the behavior in code - `LootCondition`, `LootFunction`, and `EntityProperty`, respectively.

Since you register the JSON serializer and deserializer, you can require additional fields when using your condition, function, or property. See the vanilla implementations in `net.minecraft.world.storage.loot.{conditions, functions, properties}` for examples.

Then, in order to use your conditions, functions, or properties, simply specify the registry name you passed to the `Serializer` constructor. An example loot entry:
```javascript
{
    "type": "item",
    "name": "mymod:myitem",
    "conditions": [
        {
            "condition": "mymod:mycondition",
            "foo": 1, // can require custom parameters in deserializer
        },
        {
            "condition": "minecraft:entity_properties",
            "entity": "this",
            "properties": {
                "mymod:my_property": { // structure of the right side is completely up to deserializer
                    "bar": 2
                }
            }
        }
    ],
    "functions": [
        {
            "function": "mymod:myfunction",
            "foobar": 3 // can require custom parameters in deserializer
        }
    ]
}
```

Modifying Vanilla Loot
----------------------

### Overview

Not only can you specify your own loot tables, conditions, functions, and entity properties, you can also modify others as they load.

!!! Note
    Users are allowed by vanilla to place their own loot tables in the world save directory to override the game's (and mods') own tables. These are considered config files and thus cannot be modified by the methods described below, **by design**.

The entry point to modifying tables at runtime is `LootTableLoadEvent`, which is fired once for each table loaded. From here, you may query and remove pools by name, or add instances of `LootPool`. This is why modded loot pools are required to have names.

You might be wondering how we modify vanilla tables, then, since they do not have names. Forge resolves this by generating names for all pools in vanilla tables. The first pool is named `main`, since many tables only have one pool. Subsequent pools are named by position: `pool1` for the second pool, `pool2` for the third, and so on. Removing a pool does not shift the names of the other pools.

Within each `LootPool`, you may also modify the roll and bonus roll attributes of the pool (how many times the table will call this pool) as well as query and remove entries by name, or add instances of `LootEntry`.

Similar to the case for pools, entries need unique names for retrieval and removal. Forge resolves this by adding a hidden `entryName` field to all loot entries. If the entry's `name` field is unique within the pool, then `entryName` is automatically set to `name`. Otherwise, a name must be specified in modded entries, and is automatically generated for vanilla entries. For each repeat, a number is incremented. For example, if there are three entries in a vanilla pool each with `name: "minecraft:stick"`, then the three `entryName` tags generated would be `minecraft:stick`, `minecraft:stick#0`, and `minecraft:stick#1`. Likewise, removing an entry does not shift the names of the other entries.

!!! Note
    You must perform all of your desired changes to the table during that table's `LootTableLoadEvent`, any changes afterward are disallowed by safety checks or will cause undefined behavior if the safety checks are bypassed.

### Adding Dungeon Loot

Next, an example of one of the most common use cases for modifying vanilla loot: adding dungeon item spawns.

First, listen for the event for the table we want to modify:
```Java
@SubscribeEvent
public void lootLoad(LootTableLoadEvent evt) {
    if (evt.getName().toString().equals("minecraft:chests/simple_dungeon")) {
        // do stuff with evt.getTable()
    }
}
```

In this case, we are adding to the potential spawns, but don't want to interfere with the entry weights of the preexisting pools. The most flexible and simple solution is to add another pool with a single loot entry referencing your own loot table JSON, because loot entries are able to recursively draw from a completely different table.

For example, your mod might include `/assets/mymod/loot_tables/inject/simple_dungeon.json`:
```javascript
{
    "pools": [
        {
            "name": "main",
            "rolls": 1,
            "entries": [
                {
                    "type": "item",
                    "name": "minecraft:nether_star",
                    "weight": 40
                },
                {
                    "type": "empty",
                    "weight": 60
                }
            ]
        }
    ]
}
```

!!! Note
    You still need to register this table with `LootTableList.register()`!

Then the loot entry and pool are created and added, resulting in a new loot pool for dungeon chests that has a 60% chance of nothing and 40% of a nether star.
```Java
LootEntry entry = new LootEntryTable(new ResourceLocation("mymod:inject/simple_dungeon"), <weight>, <quality>, <conditions>, <entryName>); // weight doesn't matter since it's the only entry in the pool. Other params set as you wish.

LootPool pool = new LootPool(new LootEntry[] {entry}, <conditions>, <rolls>, <bonusRolls>, <name>); // Other params set as you wish.

evt.getTable().addPool(pool);
```

Of course, if the loot you want to add cannot be determined ahead of time, you can freely construct and add `LootPool`s and implementations of `LootEntry` in your event handler similar to the calls shown above.

A real-world example of this approach in action can be seen in Botania. The event handler is located [here](https://github.com/Vazkii/Botania/blob/e38556d265fcf43273c99ea1299a35400bf0c405/src/main/java/vazkii/botania/common/core/loot/LootHandler.java), and the injected tables are located [here](https://github.com/Vazkii/Botania/tree/e38556d265fcf43273c99ea1299a35400bf0c405/src/main/resources/assets/botania/loot_tables/inject).

Changing Mob Drops
------------------

Subclasses of `EntityLiving` automatically support drawing from a loot table upon death. This is done by overriding the `getLootTable` method to return a `ResourceLocation` to the desired table. This serves as the mob's default table; the tables of both your and other mods' mobs can be overridden for a single entity by setting the `deathLootTable` field of the entity. 

Generating Loot In-Code
-----------------------

Occasionally, you may want to generate `ItemStack`s from a loot table from your own code.

First, obtain the loot table itself (you need access to a `World`):
```Java
LootTable table = this.world.getLootTableManager().getLootTableFromLocation(new ResourceLocation("mymod:my_table")); // resolves to /assets/mymod/loot_tables/my_table.json
```

Next, create a `LootContext` using the provided `LootContextBuilder`, which holds information about the context of the looting, such as the killer, luck of the looter, and finishing blow.
```Java
LootContext ctx = new LootContext.Builder(world)
    .withLuck(...) // adjust luck, commonly EntityPlayer.getLuck()
    .withLootedEntity(...) // set looted entity
    .withPlayer(...) // set player as killer
    .withDamageSource(...) // pass killing blow and non-player killer
    .build();
```

Finally, to get a collection of `ItemStack`s:
```Java
List<ItemStack> stacks = table.generateLootForPools(world.rand, ctx);
```

Or to fill an inventory:
```Java
table.fillInventory(iinventory, world.rand, ctx);
```

!!! Note
    This only works with `IInventory` for now.

[wiki]: https://minecraft.gamepedia.com/Loot_table
