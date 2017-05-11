Loot Tables
===========

Loot tables are an easy way to generate random loot given random distributions of items. They are used in vanilla to generate random chest loot as well as for mob drops.

The vanilla [wiki][] describes the loot table JSON format in great detail, so this article instead will focus on code that you might have to write to use and manipulate loot tables in your mod. To get the most out of this article, read the aforementioned [wiki][] page in its entirety before reading this article.

Registering a modded loot table
-------------------------------

In order to make Minecraft load and be aware of your loot table, simply call `LootTableList.register(new ResourceLocation("modid", "loot_table_name"))`, which will resolve and load `/assets/modid/loot_tables/loot_table_name.json`. You may organize your tables into folders freely.

!!! Note 
    Loot pools in mod loot tables must include an additional `name` tag that uniquely identifies that pool within the table.
    If you specify multiple loot entries with the same `name` tag (e.g. the same item but with different functions each time), then you must give each of those entries a `entryName` tag that uniquely identifies that entry within the pool. For `name` tags that do not clash, then `entryName` is automatically set to the value of `name`.
    These additional requirements are imposed by Forge to facilitate modification of tables at load time using `LootTableEvent` (see below).

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

Modifying Vanilla Loot - Overview
---------------------------------

Not only can you specify your own loot tables, conditions, functions, and entity properties, you can also modify others as they load.

!!! Note
    Users are allowed by vanilla to place their own loot tables in the world save directory to override the game's (and mods') own tables. These are considered config files and thus cannot be modified by the methods described below, **by design**.

The entry point to modifying tables at runtime is `LootTableLoadEvent`, which is fired once for each table loaded. From here, you may query and remove pools by name, or add instances of `LootPool`. This is why modded loot pools are required to have names.

You might be wondering how we modify vanilla tables, then, since they do not have names. Forge resolves this by generating names for all pools in vanilla tables. The first pool is named `main`, since many tables only have one pool. Subsequent pools are named by position: `pool1` for the second pool, `pool2` for the third, and so on. Removing a pool does not shift the names of the other pools.

Within each `LootPool`, you may also modify the roll and bonus roll attributes of the pool (how many times the table will call this pool) as well as query and remove entries by name, or add instances of `LootEntry`.

Similar to the case for pools, entries need unique names for retrieval and removal. Forge resolves this by adding a hidden `entryName` field to all loot entries. If the entry's `name` field is unique within the pool, then `entryName` is automatically set to `name`. Otherwise, a name must be specified in modded entries, and is automatically generated for vanilla entries. For each repeat, a number is incremented. For example, if there are three entries in a vanilla pool each with `name: "minecraft:stick"`, then the three `entryName` tags generated would be `minecraft:stick`, `minecraft:stick#0`, and `minecraft:stick#1`. Likewise, removing an entry does not shift the names of the other entries.

!!! Note
    You must perform all of your desired changes to the table during that table's `LootTableLoadEvent`, any changes afterward are disallowed by safety checks or will cause undefined behavior if the safety checks are bypassed.

Modifying Vanilla Loot Example - Adding Dungeon Loot
----------------------------------------------------

TODO

Changing mob drops
------------------

Subclasses of `EntityLiving` automatically support drawing from a loot table upon death. This is done by overriding the `getLootTable` method to return a `ResourceLocation` to the desired table. This serves as the mob's default table; the tables of both your and other mods' mobs can be overridden for a single entity by setting the `deathLootTable` field of the entity. 

Generating loot in-code
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
.withPlayer(...) // set player as the killer
.withDamageSource(...) // pass info about killing blow
.build();
```

Finally, to get a collection of `ItemStack`s:
```Java
List<ItemStack> stacks = table.generateLootForPools(world.rand, ctx);
```

Or to fill an inventory (only works for `IInventory` for now :/):
```Java
table.fillInventory(iinventory, world.rand, ctx);
```

[wiki]: http://minecraft.gamepedia.com/Loot_table