Tags
====

Tags are generalized sets of objects in the game used for grouping related things together and providing fast membership checks.

Declaring Your Own Groupings
----------------------------
Tags are declared in your mod's [datapack][datapack]. For example, `/data/<modid>/tags/blocks/foo/tagname.json` will declare a `Tag$Named<Block>` with ID `modid:foo/tagname`.
Similarly, you may append to or override tags declared in other domains, such as Vanilla, by declaring your own JSONs.
For example, to add your own mod's saplings to the Vanilla sapling tag, you would specify it in `/data/minecraft/tags/blocks/saplings.json`, and Vanilla will merge everything into one tag at reload, if the `replace` option is false.
If `replace` is true, then all entries before the json specifying `replace` will be removed.
Values listed that are not present will cause the tag to error unless the value is listed using an `id` string and `required` boolean set to false, as in the following example:

```json
{
  "replace": false,
  "values": [
    "minecraft:gold_ingot",
    "mymod:my_ingot",
    {
      "id": "othermod:ingot_other",
      "required": false
    }
  ]
}
```

See the [Vanilla wiki][tags] for a description of the base syntax.

There is also a Forge extension on the Vanilla syntax.
You may declare a `remove` array of the same format as the `values` array. Any values listed here will be removed from the tag. This acts as a finer grained version of the Vanilla `replace` option.


Using Tags In Code
------------------
Block, Item, Fluid, and EntityType tags are automatically sent from the server to any remote clients on login and reload. In addition, Forge adds BlockEntityType, Potion, and Enchantment tags. Function tags are not synced.

`BlockTags#getAllTags` and `ItemTags#getAllTags` will retrieve the current `TagCollection`, from which you can retrieve a `Tag` object by its ID.
With a `Tag` object in hand, membership can be tested with `tag.contains(thing)`, or all the objects in the tag queried with `tag.getValues()`.

As an example:
```java
public static final Tag.Named<Item> myTag = ItemTags.bind("mymod:myitemgroup");

// In some method
Item unknownItem = stack.getItem();
boolean isInGroup = unknownItem.is(myTag);
```

!!! note:
    The `TagCollection` returned by `#getAllTags` (and the `Tag`s within it) may expire if a reload happens.
    The static `Tag$Named` fields in `BlockTags` and `ItemTags` avoid this by introducing a wrapper that handles this expiring.


Conventions
-----------

There are several conventions that will help facilitate compatibility in the ecosystem:

* If there is a Vanilla tag that fits your block or item, add it to that tag. See the [list of Vanilla tags][taglist].
* If there is a Forge tag that fits your block or item, add it to that tag. The list of tags declared by Forge can be seen on [GitHub][forgetags].
* If there is a group of something you feel should be shared by the community, use the `forge` namespace instead of your mod id.
* Tag naming conventions should follow Vanilla conventions. In particular, item and block groupings are plural instead of singular (e.g. `minecraft:logs`, `minecraft:saplings`).
* Item tags should be sorted into subdirectories according to their type (e.g. `forge:ingots/iron`, `forge:nuggets/brass`, etc.).


Migration from OreDictionary
----------------------------

* For recipes, tags can be used directly in the vanilla recipe format (see below).
* For matching items in code, see the section above.
* If you are declaring a new type of item grouping, follow a couple naming conventions:
  * Use `domain:type/material`. When the name is a common one that all modders should adopt, use the `forge` domain.
  * For example, brass ingots should be registered under the `forge:ingots/brass` tag and cobalt nuggets under the `forge:nuggets/cobalt` tag.


Using Tags in Recipes and Advancements
--------------------------------------

Tags are directly supported by Vanilla. See the respective Vanilla wiki pages for [recipes][] and [advancements][] for usage details.

[datapack]: ../concepts/data.md
[tags]: https://minecraft.gamepedia.com/Tag#JSON_format
[taglist]: https://minecraft.gamepedia.com/Tag#List_of_tags
[forgetags]: https://github.com/MinecraftForge/MinecraftForge/tree/1.18.x/src/generated/resources/data/forge/tags
[recipes]: https://minecraft.gamepedia.com/Recipe#JSON_format
[advancements]: https://minecraft.gamepedia.com/Advancements
