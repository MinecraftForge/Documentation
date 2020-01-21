Tags
====

Tags are generalized sets of objects in the game, used for grouping related things together and providing fast membership checks.

Declaring Your Own Groupings
----------------------------
Tags are declared in your mod's datapack. For example, `/data/modid/tags/blocks/foo/tagname.json` will declare a `Tag<Block>` with ID `modid:foo/tagname`.
Similarly, you may append to or override tags declared in other domains, such as Vanilla, by declaring your own JSONs.
For example, to add your own mod's saplings to the Vanilla sapling tag, you would specify it in `/data/minecraft/tags/blocks/saplings.json`, and Vanilla will merge everything into one tag at reload, if the `replace` option is false.
If `replace` is true, then all entries before the json specifying `replace` will be removed.
See the [Vanilla wiki][tags] for a description of the base syntax.

Forge provides two extensions on the Vanilla syntax:
* You may declare an `optional` array of the same format as the `values` array, but any values listed here that are not present will not cause the tag loading to error.
This is useful to provide integration for mods that may or may not be present at runtime.
* You may declare a `remove` array of the same format as the `values` array. Any values listed here will be removed from the tag. This acts as a finer grained version of the Vanilla `replace` option.


Using Tags In Code
------------------
Block, Item, and Fluid tags are automatically sent from the server to any remote clients on login and reload. Function tags are not synced.

`BlockTags.getCollection()` and `ItemTags.getCollection()` will retrieve the current `TagCollection`, from which you can retrieve a `Tag` object by its ID.
With a `Tag` object in hand, membership can be tested with `tag.contains(thing)`, or all the objects in the tag queried with `tag.getAllElements()`.

As an example:
```Java
ResourceLocation myTagId = new ResourceLocation("mymod", "myitemgroup");
Item unknownItem = stack.getItem();
boolean isInGroup = ItemTags.getCollection().getOrCreateTag(myTagId).contains(unknownItem);
// alternatively, can use getTag and perform a null check
```

!!! note:
    The `TagCollection` returned by `getCollection()` (and the `Tag`s within it) may expire if a reload happens, so you should always query the collection anew every time you need it.
    The static `Tag` fields in `BlockTags` and `ItemTags` avoid this by introducing a wrapper that handles this expiring.
    Alternatively, a resource reload listener can be used to refresh any cached tags.


Conventions
-----------

There are several conventions that will help facilitate compatibility in the ecosystem:
* If there is a Vanilla tag that fits your block or item, add it to that tag. See the [list of Vanilla tags](https://minecraft.gamepedia.com/Tag#List_of_tags).
* If there is a Forge tag that fits your block or item, add it to that tag. The list of tags declared by Forge can be seen on [GitHub](https://github.com/MinecraftForge/MinecraftForge/tree/1.14.x/src/generated/resources/data/forge/tags).
* If there is a group of something you feel should be shared by the community, consider PR-ing it to Forge instead of making your own tag
* Tag naming conventions should follow Vanilla conventions. In particular, item and block groupings are plural instead of singular. E.g. `minecraft:logs`, `minecraft:saplings`.
* Item tags should be sorted into subdirectories according to the type of item, e.g. `forge:ingots/iron`, `forge:nuggets/brass`, etc.


Migration from OreDictionary
----------------------------

* For recipes, tags can be used directly in the vanilla recipe format (see below)
* For matching items in code, see the section above.
* If you are declaring a new type of item grouping, follow a couple naming conventions:
  * Use `domain:type/material`. When the name is a common one that all modders should adopt, use the `forge` domain.
  * For example, brass ingots should be registered under the `forge:ingots/brass` tag, and cobalt nuggets under the `forge:nuggets/cobalt` tag.


Using Tags in Recipes and Advancements
--------------------------------------

Tags are directly supported by Vanilla, see the respective Vanilla wiki pages for [recipes][] and [advancements][] for usage details.

[tags]: https://minecraft.gamepedia.com/Tag#JSON_format
[recipes]: https://minecraft.gamepedia.com/Recipe#JSON_format
[advancements]: https://minecraft.gamepedia.com/Advancements
