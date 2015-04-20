# Introduction to structuring your mod

We'll look at how to organize your mod into different files and what those files should do.

## Packaging
Pick a unique package name. Java style guidelines suggest a reversed, dot-separated domain. The domain doesn't have to
exist on the internet, but it can if you wish. After you've identified your top-level, such as `com.fakemods`, append a
unique name for your mod, such as `examplemod`. You'll end up with `com.fakemods.examplemod`.

## The mod file
Generally, we'll start with a file named after your mod, and put into your package. This is the *entry point* to your mod
and will contain some special indicators marking it as such.

### What is @Mod?
This is a java annotation indicating to the Forge Mod Loader that the class is a Mod entry point. It contains various
metadata about the mod. It also designates the class that will carry any @EventHandler methods. More information can
be found at... (TODO: link to mod javadoc and a more indepth guide)

You will find an example mod in your downloaded Src.

## Keeping your code clean using sub-packages
Rather than clutter up a single class and package with everything, we recommend you break your mod into subpackages.
A common subpacking strategy has subpackages for `items`, `blocks`, `tileentities`, `client` code, `gui` code.

By keeping your code in clean subpackages, you can grow your mod much more organically.

## Class naming schemes
A common class naming scheme prepends some basic type information. Minecraft (MCP) follows this convention, for the 
most part. An `Item` called `PowerRing` would be in a subpackage of `items`, with a classname of `ItemPowerRing`, for
example. A `Block` called `NotDirt` would be in a subpackage of `blocks`, with a classname of `BlockNotDirt`. Finally, 
a `Tile`Entity for a block called `SuperChewer` would be in a subpackage of `tileentities` with a classname of
`TileSuperChewer`.

Following this naming convention will help others understand your code better, and will help everyone if we see your
code in an error message somewhere.
