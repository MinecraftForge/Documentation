Tags
====
Tags are generalized sets of objects in the game, used for grouping related things together and providing fast membership checks.
!!! note:
    Tags have replaced the OreDictionary-- from now on you should (and can only) use tags for all that OreDictionary did. Please see the extra notice at the bottom of this page for more information for transferring from OreDictionary to Tags.

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

Tags can be accessed in code through the `Tags.Items` and `Tags.Blocks` classes for all the Forge tags, and `ItemTags` or `BlockTags`s for ForgeTags.
See the examples below for how to use each.

`BlockTags.getCollection()` and `ItemTags.getCollection()` will retrieve the current `TagCollection`, from which you can retrieve a `Tag` object by its ID.
With a `Tag` object in hand, membership can be tested with `tag.contains(thing)`, or all the objects in the tag queried with `tag.getAllElements()`.

A reminder that `Tag`s contain `Item`s not `ItemStack`s. You can get the `Item` of an `ItemStack` from the stack by calling `<itemStack>.getItem()`.

An example of checking if an Item belongs to a Vanilla `Tag`:
```Java
boolean inTag;
// There's two methods to do this, doesn't really matter which you choose:
// Method 1: from the Item's perspective
inTag = someItemStack.getItem().isIn(Tags.Items.DUSTS_REDSTONE);
// Method 2: from the Tag's perspective
inTag = Tags.Items.DUSTS_REDSTONE.contains(someItemStack.getItem());
```

An example of checking if an Item is contained in a certain Forge `Tag`:
```Java
// Create a custom resource to use to fetch a tag instance ('mymod:myitemgroup' is the tag)
ResourceLocation myTagId = new ResourceLocation("mymod", "myitemgroup");
// Tags work through Items, not ItemStacks so we need to get the Item from our ItemStack
Item unknownItem = stack.getItem();
// This line will either retrieve the Tag (referenced by our ResourceLocation) or create it if it is not
// in the ItemTags collection of all the tags. Then it will check if our Item (again, not ItemStack)
// exists in the set of Items that belong to this Tag
boolean isInGroup = ItemTags.getCollection().getOrCreate(myTagId).contains(unknownItem);
// Alternatively, you can use the getTag and perform a null check to see if the tag exists and do it that way
Tag retrievedTag = ItemTags.getCollection().get(myTagId);
if(retrievedTag != null){
    //do something if retrievedTag.contains(unknownItem) or whatever else you'd like to do with that tag
}
```

There is also `ItemTags.getCollection().getOwningTags(item)` that returns all the `Tag`s that contain an `Item`, however this is generally not the way you'd want to handle tags, it's better if you can check if the `Item` is in a specific `Tag` as opposed to retrieving all its `Tag`s and seeing if the `Tag` is in there.

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
