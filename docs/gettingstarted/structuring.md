Structuring Your Mod
====================

We'll look at how to organize your mod into different files and what those files should do.

Packaging
---------

Pick a unique package name. If you own a URL associated with your project, you can use it as your top level package. For example if you own "example.com", you may use `com.example` as your top level package.

!!! important

    If you do not own a domain, do not use it for your top level package. It is perfectly acceptable to start your package with anything, such as your name/nickname, or the name of the mod.

After the top level package (if you have one) you append a unique name for your mod, such as `examplemod`. In our case it will end up as `com.example.examplemod`.

The `mods.toml` file
-------------------

The `mods.toml` file defines the metadata of your mod. Its information may be viewed by users from the main screen of the game through the Mods button. A single info file can describe several mods.

The `mods.toml` file should be stored as `src/main/resources/mcmod.info`. A basic `mcmod.info`, describing one mod, may look like this:
```java
modLoader="javafml" #mandatory
loaderVersion="[31,)" #mandatory. 26 for 1.14.2, 27 for 1.14.3, 28 for 1.14.4. 29,30,31 for 1.15, 1.15.2/3

modLoader="javafml"
issueTrackerURL="http://my.issue.tracker/"
[[mods]]
modId="examplemod"
version="${file.jarVersion}"
displayName="Example Mod"
updateJSONURL="http://myurl.me/"
displayURL="http://example.com/"
logoFile="examplemod.png"
credits="Thanks for this example mod goes to Java"
authors="Love, Cheese and small house plants"
description='Very useful description here.'
[[dependencies.examplemod]] #optional
    modId="forge" #mandatory
    mandatory=true #mandatory
    versionRange="[28,)" #mandatory
    ordering="NONE"
    side="BOTH"
```
The default Gradle configuration replaces `${file.jarVersion}` with the project .jar version, so you should use that instead of directly writing it out. Here is a table of attributes that may be given to a mod, where `required` means there is no default and the absence of the property causes an error. In addition to the required properties, you should also define `description`, `version`, `mcversion`, `url`, and `authorList`.

|     Property |   Type   | Default  | Description |
|-------------:|:--------:|:--------:|:------------|
|     modLoader|  string  | required | The modid this description is linked to. If the mod is not loaded, the description is ignored. |
|  displayName |  string  | required | The user-friendly name of this mod. |
|  description |  string  |   `""`   | A description of this mod in 1-2 paragraphs. |
|      version |  string  |   `""`   | The version of the mod. |
|   displayURL |  string  |   `""`   | A link to the mod's homepage. |
|updateJSONURL |  string  |   `""`   | The URL to a [version JSON](autoupdate#forge-update-checker). |
|      authors | [string] |   `[]`   | A list of authors to this mod. |
|      credits |  string  |   `""`   | A string that contains any acknowledgements you want to mention. |
|     logoFile |  string  |   `""`   | The path to the mod's logo. It is resolved on top of the classpath, so you should put it in a location where the name will not conflict, maybe under your own assets folder. |

The Mod File
------------

Generally, we'll start with a file named after your mod, and put into your package. This is the *entry point* to your mod
and will contain some special indicators marking it as such.

What is `@Mod`?
-------------

This is an annotation indicating to the Forge Mod Loader that the class is a Mod entry point. It contains various metadata about the mod. It also designates the class that will receive `@EventHandler` events.

Here is a table of the properties of `@Mod`:

|                         Property |        Type        |    Default     | Description |
|---------------------------------:|:------------------:|:--------------:|:------------|
|                            modid |       String       |    required    | A unique identifier for the mod. It must be lowercased, and will be truncated to 64 characters in length. |
|                             name |       String       |       ""       | A user-friendly name for the mod. |
|                          version |       String       |       ""       | The version of the mod. It should be just numbers seperated by dots, ideally conforming to [Semantic Versioning](https://semver.org/). Even if `useMetadata` is set to `true`, it's a good idea to put the version here anyways. |
|                     dependencies |       String       |       ""       | Dependencies for the mod. The specification is described in the Forge `@Mod` javadoc:<br><blockquote><p>A dependency string can start with the following four prefixes: `"before"`, `"after"`, `"required-before"`, `"required-after"`; then `":"` and the `modid`.</p><p>Optionally, a version range can be specified for the mod by adding `"@"` and then the version range.[\*](#version-ranges)</p><p>If a "required" mod is missing, or a mod exists with a version outside the specified range, the game will not start and an error screen will tell the player which versions are required.</p>
|                      useMetadata |       boolean      |      false     | If set to true, properties in `@Mod` will be overridden by `mods.toml`. |
| clientSideOnly<br>serverSideOnly | boolean<br>boolean | false<br>false | If either is set to `true`, the jar will be skipped on the other side, and the mod will not load. If both are true, the game crashes. |
|        acceptedMinecraftVersions |       String       |       ""       | The version range of Minecraft the mod will run on.[\*](#version-ranges) An empty string will match all versions. |
|         acceptableRemoteVersions |       String       |       ""       | Specifies a remote version range that this mod will accept as valid.[\*](#version-ranges) `""` Matches the current version, and `"*"` matches all versions. Note that `"*"` matches even when the mod is not present on the remote side at all. |
|           acceptableSaveVersions |       String       |       ""       | A version range specifying compatible save version information.[\*](#version-ranges) If you follow an unusual version convention, use `SaveInspectionHandler` instead. |
|           certificateFingerprint |       String       |       ""       | See the tutorial on [jar signing](../concepts/jarsigning.md). |
|                      modLanguage |       String       |     "java"     | The programming language the mod is written in. Can be either `"java"` or `"scala"`. |
|               modLanguageAdapter |       String       |       ""       | Path to a language adapter for the mod. The class must have a default constructor and must implement `ILanguageAdapter`. If it doesn't, Forge will crash. If set, overrides `modLanguage`. |
|                 canBeDeactivated |       boolean      |      false     | This is not implemented, but if the mod could be deactivated (e.g. a minimap mod), this would be set to `true` and the mod would [receive](../events/intro.md#creating-an-event-handler) `FMLDeactivationEvent` to perform cleanup tasks. |
|                       guiFactory |       String       |       ""       | Path to the mod's GUI factory, if one exists. GUI factories are used to make custom config screens, and must implement `IModGuiFactory`. For an example, look at `FMLConfigGuiFactory`. |
|                       updateJSON |       String       |       ""       | URL to an update JSON file. See [Forge Update Checker](autoupdate.md) |

<a name="version-ranges" style="color: inherit; text-decoration: inherit">\* All version ranges use the [Maven Version Range Specification](https://maven.apache.org/enforcer/enforcer-rules/versionRanges.html).</a>

You can find an example mod in the [Forge src download](https://files.minecraftforge.net/).

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
