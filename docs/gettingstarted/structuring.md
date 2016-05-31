Structuring Your Mod
====================

We'll look at how to organize your mod into different files and what those files should do.

Packaging
---------

Pick a unique package name. If you own a URL associated with your project, you can use it as your top level package. For example if you own "example.com", you may use `com.example` as your top level package.

!!! important

    If you do not own a domain, do not use it for your top level package. It is perfectly acceptable to start your package with anything, such as your name/nickname, or the name of the mod.

After the top level package (if you have one) you append a unique name for your mod, such as `examplemod`. In our case it will end up as `com.example.examplemod`.

The Mod File
------------

Generally, we'll start with a file named after your mod, and put into your package. This is the *entry point* to your mod
and will contain some special indicators marking it as such.

What is `@Mod`?
-------------

This is an annotation indicating to the Forge Mod Loader that the class is a Mod entry point. It contains various metadata about the mod. It also designates the class that will receive `@EventHandler` events. More information can be found at... (Coming Soon)

All components of @Mod() are written inside the paratheses and chained together. There's only ever a single @Mod in your entire mod, sitting on top of your entry class.

Components:

`modid` [Required]
This identifies your mod uniquely to Forge and should probably the first thing you enter. It's only visible internally.

Example: @Mod(modid="examplemod")

`name` [Required]
This is the public name of your mod, as the user sees it.

Example: @Mod(modid="examplemod", name="Mad Mod For Kool Kids")

`version` [Required]
This is the version of your mod and gets both publically displayed and internally used to detect version mismatches.
You can write pretty much whatever in here, but it's generally a good idea to have some sort of structure. Even if it's something as simple as a single number that increases every time you update your mod.

Example: @Mod(modid="examplemod", name="Mad Mod For Kool Kids" version="1.radical")

`acceptableRemoteVersions` [Optional]
This lets Forge know what Client-side versions your mod is ok with. The wildcard * (a star) means that your mod is fine with ANY version on the other end, even nothing at all. You can use this for Server-side only mods.
[TODO: Someone add here how the versions can be structured. I THINK you can set minimum/maximum versions?]

Example: [TODO]

`canBeDeactivated` [Optional]
This lets Forge know whether or not your mod can be safely turned off/on during gameplay. There's a menu option for enabling/disabling mods in the main menu, which uses this. Unlike most other annotation options this one takes a boolean instead of a string, so it's without quotes.

Example: @Mod(canBeDeactivated=true)

[More annotations to be added here]

You can find an example mod in the [Forge src download](http://files.minecraftforge.net/).

Keeping Your Code Clean Using Sub-packages
------------------------------------------

Rather than clutter up a single class and package with everything, it is recommended you break your mod into subpackages.

A common subpackage strategy has packages for `common` and `client` code, which is code that can be run on server/client and client, respectively. Inside the `common` package would go things like Items, Blocks, and Tile Entities (which can each in turn be another subpackage). Things like GUIs and Renderers would go inside the `client` package.

!!! note

    This package style is only a suggestion, though it is a commonly used style. Feel free to use your own packaging system.

By keeping your code in clean subpackages, you can grow your mod much more organically.

Class Naming Schemes
--------------------

A common class naming scheme allows easier deciphering of what a class is, and also makes it easier for someone developing with your mod to find things.

For Example:

* An `Item` called `PowerRing` would be in an `item` package, with a class name of `ItemPowerRing`.
* A `Block` called `NotDirt` would be in a `block` package, with a class name of `BlockNotDirt`.
* Finally, a `TileEntity` for a block called `SuperChewer` would be a `tile` or `tileentity` package, with a class name of `TileSuperChewer`.

Prepending your class names with what *kind* of object they are makes it easier to figure out what a class is, or guess the class for an object.
