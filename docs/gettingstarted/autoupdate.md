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
* Forge uses an internal algorithm to determine whether one version String of your mod is "newer" than another. Most versioning schemes should be compatible, but see the `ComparableVersion` class if you are concerned about whether your scheme is supported. Adherence to [semantic versioning](https://semver.org/) is highly recommended.
* The changelog string can be separated into lines using `\n`. Some prefer to include a abbreviated changelog, then link to an external site that provides a full listing of changes.
* Manually inputting data can be chore. You can configure your `build.gradle` to automatically update this file when building a release, as Groovy has native JSON parsing support. Doing this is left as an exercise to the reader.

Two concrete examples can be seen here for [Charset](https://gist.githubusercontent.com/Meow-J/fe740e287c2881d3bf2341a62a7ce770/raw/bf829cdefc84344d86d1922e2667778112b845b1/update.json) and [Botania Unofficial](https://gist.githubusercontent.com/Meow-J/1299068c775c2b174632534a18b65fb8/raw/42c578cf2303aa76d8900f5fdc6366122549d2a8/update.json).

Retrieving Update Check Results
-------------------------------

You can retrieve the results of the Forge Update Checker using `ForgeVersion.getResult(ModContainer)`. The returned object has a field `status` which indicates the status of the version check.
Example values: `FAILED` (the version checker couldn't connect to the URL provided), `UP_TO_DATE` (the current version is equal to or newer than the latest stable version), `OUTDATED` (there is a new stable version), `BETA_OUTDATED` (there is a new unstable version), or `BETA` (the current version is equal to or newer than the latest unstable version). The status will be `PENDING` if the result requested has not finished yet; in that case, you should try again in a little bit. 
Otherwise, the returned object will also have the target version and any changelog lines, as specified in `update.json`.
You can obtain your own `ModContainer` to pass to this method using `Loader.instance().activeModContainer()`, or any other mod's `ModContainer` using `Loader.instance().getIndexedModList().get(<modid>)`.
