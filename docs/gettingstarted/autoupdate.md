Forge Update Checker
====================

Forge provides a very lightweight opt-in update-checking framework. All it does is check for updates, then show a flashing icon on the Mods button of the main menu and mod list if any mods have an available update, along with the respective changelogs. It *does not* download updates automatically.

Getting Started
---------------

The first thing you want to do is specify the `updateJSON` parameter in your `@Mod` annotation. The value of this parameter should be a valid URL pointing to an update JSON file. This file can be hosted on your own web server, or on GitHub, or wherever you want, as long as it can be reliably reached by all users of your mod.

Update JSON format
------------------

The JSON itself has a relatively simple format, given as follows:

```Javascript
{
  "homepage": "<homepage/download page for your mod>",
  "<mcversion>": {
    "<modversion>": "<changelog for this version>", 
    // List all versions of your mod for the given Minecraft version, along with their changelogs
    ...
  },
  ...
  "promos": {
    "<mcversion>-latest": "<modversion>",
    // Declare the latest "bleeding-edge" version of your mod for the given Minecraft version
    "<mcversion>-recommended": "<modversion>",
    // Declare the latest "stable" version of your mod for the given Minecraft version
    ...
  }
}
```

This is fairly self-explanatory, but some notes:
 
* The link under `homepage` is the link the user will be shown when the mod is outdated.
* Forge uses an internal algorithm to determine whether one version String of your mod is "newer" than another. Most versioning schemes should be compatible, but see the `ComparableVersion` class if you are concerned about whether your scheme is supported. Adherence to [semantic versioning](http://semver.org/) is highly recommended.
* The changelog string can be separated into lines using `\n`. Some prefer to include a abbreviated changelog, then link to an external site that provides a full listing of changes.
* Manually inputting data can be chore. You can configure your `build.gradle` to automatically update this file when building a release, as Groovy has native JSON parsing support. Doing this is left as an exercise to the reader.

Two concrete examples can be seen here for [Charset](https://gist.githubusercontent.com/Meow-J/fe740e287c2881d3bf2341a62a7ce770/raw/bf829cdefc84344d86d1922e2667778112b845b1/update.json) and [Botania Unofficial](https://gist.githubusercontent.com/Meow-J/1299068c775c2b174632534a18b65fb8/raw/42c578cf2303aa76d8900f5fdc6366122549d2a8/update.json).
