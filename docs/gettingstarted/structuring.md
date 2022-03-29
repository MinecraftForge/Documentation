Structuring Your Mod
====================

Let us look at how to organize your mod into different files and what those files should do.

Packaging
---------

Pick a unique package name. If you own a URL associated with your project, you can use it as your top level package. For example if you own "example.com", you may use `com.example` as your top level package.

!!! important
    If you do not own a domain, do not use it for your top level package. You can use your email, a subdomain of where you host a website, or your name/username as long as it can be unique.

After the top level package (if you have one), you append a unique name for your mod, such as `examplemod`. In our case it will end up as `com.example.examplemod`.

The `mods.toml` file
-------------------

!!! important
    The license field in the mods.toml is required. If it is not provided, an error will occur. See your choices at https://choosealicense.com/

This file defines the metadata of your mod. Its information may be viewed by users from the main screen of the game through the 'Mods' button. A single info file can describe several mods.

The `mods.toml` file is formatted as [TOML][], the example `mods.toml` file in the MDK provides comments explaining the contents of the file. It should be stored as `src/main/resources/META-INF/mods.toml`. A basic `mods.toml`, describing one mod, may look like this:
```toml
# The name of the mod loader type to load - for regular FML @Mod mods it should be javafml
modLoader="javafml"
# A version range to match for said mod loader - for regular FML @Mod it will be the forge version
# Forge for 1.18 is version 38
loaderVersion="[38,)"
# The license for your mod. This is mandatory and allows for easier comprehension of your redistributive properties.
# Review your options at https://choosealicense.com/. All rights reserved is the default copyright stance, and is thus the default here.
license="All Rights Reserved"
# A URL to refer people to when problems occur with this mod
issueTrackerURL="github.com/MinecraftForge/MinecraftForge/issues"
# If the mods defined in this file should show as separate resource packs
showAsResourcePack=false

[[mods]]
  modId="examplemod"
  version="1.0.0.0"
  displayName="Example Mod"
  updateJSONURL="minecraftforge.net/versions.json"
  displayURL="minecraftforge.net"
  logoFile="logo.png"
  credits="I'd like to thank my mother and father."
  authors="Author"
  description='''
  Lets you craft dirt into diamonds. This is a traditional mod that has existed for eons. It is ancient. The holy Notch created it. Jeb rainbowfied it. Dinnerbone made it upside down. Etc.
  '''

  [[dependencies.examplemod]]
    modId="forge"
    mandatory=true
    versionRange="[38,)"
    ordering="NONE"
    side="BOTH"

  [[dependencies.examplemod]]
    modId="minecraft"
    mandatory=true
    versionRange="[1.18,1.19)"
    ordering="NONE"
    side="BOTH"
```

If any string is specified as `${file.jarVersion}`, Forge will replace the string with the **Implementation Version** specified in your jar manifest at runtime. Since the user development environment has no jar manifest to pull from, it will be `NONE` instead. As such, it is usually recommended to leave the `version` field alone. Here is a table of attributes that may be given to a mod, where `mandatory` means there is no default and the absence of the property causes an error.

|     Property |   Type   | Default  | Description |
|-------------:|:--------:|:--------:|:------------|
|        modid |  string  | mandatory | The modid this file is linked to. |
|      version |  string  | mandatory | The version of the mod. It should be just numbers separated by dots, ideally conforming to Forge's [Semantic Versioning][versioning] structure. |
|  displayName |  string  | mandatory | The user-friendly name of this mod. |
| updateJSONURL |  string  |   `""`   | The URL to a [version JSON][updatechecker]. |
|   displayURL |  string  |   `""`   | A link to the mod's homepage. |
|     logoFile |  string  |   `""`   | The filename of the mod's logo. It must be placed in the root resource folder, not in a subfolder. |
|      credits |  string  |   `""`   | A string that contains any acknowledgements you want to mention. |
|      authors |  string  |   `""`   | The authors of this mod. |
|  description |  string  | mandatory | A description of this mod. |
| dependencies | [list] |   `[]`   | A list of dependencies of this mod. |

\* All version ranges use the [Maven Version Range Specification][mvr].

The Mod File
------------

Generally, we will start with a file named after your mod and put into your package. This is the *entry point* to your mod and will contain some special indicators marking it as such.

What is `@Mod`?
-------------

This is an annotation indicating to the Forge Mod Loader that the class is a Mod entry point. The `@Mod` annotation's value should match a mod id in the `src/main/resources/META-INF/mods.toml` file.

Keeping Your Code Clean Using Sub-packages
------------------------------------------

Rather than clutter up a single class and package with everything, it is recommended that you break your mod into subpackages.

A common subpackage strategy has packages for `common` and `client` code, which is code that can be run on both server/client and only client, respectively. Inside the `common` package would go things like Items, Blocks, and Block Entities (which can each, in turn, be another subpackage). Things like Screens and Renderers would go inside the `client` package.

!!! note
    This package style is only a suggestion, though it is a commonly used style. Feel free to use your own packaging system.

By keeping your code in clean subpackages, you can grow your mod much more organically.

Class Naming Schemes
--------------------

A common class naming scheme allows easier deciphering of what a class is, and it also makes it easier for someone developing with your mod to find things.

For Example:

* An `Item` called `PowerRing` would be in an `item` package, with a class name of `PowerRingItem`.
* A `Block` called `NotDirt` would be in a `block` package, with a class name of `NotDirtBlock`.
* Finally, a `BlockEntity` for a block called `SuperChewer` would be a `block.entity` or `blockentity` package, with a class name of `SuperChewerBlockEntity`.

Appending your class names with what *kind* of object they are makes it easier to figure out what a class is or guess the class for an object.

[TOML]: https://github.com/toml-lang/toml
[versioning]: ./versioning.md
[updatechecker]: ../misc/updatechecker.md
[mvr]: https://maven.apache.org/enforcer/enforcer-rules/versionRanges.html
