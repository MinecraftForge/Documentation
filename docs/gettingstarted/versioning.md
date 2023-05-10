Versioning
==========

In general projects, [semantic versioning][semver] is often used (which has the format `MAJOR.MINOR.PATCH`). However, in the case of modding it may be more beneficial to use the format `MCVERSION-MAJORMOD.MAJORAPI.MINOR.PATCH` to be able to differentiate between world-breaking and API-breaking changes of a mod.

!!! important
    Forge uses [Maven version ranges][cmpver] to compare version strings, which is not fully compatible with the Semantic Versioning 2.0.0 spec, such as the 'prerelease' tag.

Examples
--------

Here is a list of examples that can increment the various variables.

* `MCVERSION`
  * Always matches the Minecraft version the mod is for.
* `MAJORMOD`
  * Removing items, blocks, block entities, etc.
  * Changing or removing previously existing mechanics.
  * Updating to a new Minecraft version.
* `MAJORAPI`
  * Changing the order or variables of enums.
  * Changing return types of methods.
  * Removing public methods altogether.
* `MINOR`
  * Adding items, blocks, block entities, etc.
  * Adding new mechanics.
  * Deprecating public methods. (This is not a `MAJORAPI` increment since it doesn't break an API.)
* `PATCH`
  * Bugfixes.

When incrementing any variable, all lesser variables should reset to `0`. For instance, if `MINOR` would increment, `PATCH` would become `0`. If `MAJORMOD` would increment, all other variables would become `0`.

### Work In Progress

If you are in the initial development stage of your mod (before any official releases), the `MAJORMOD` and `MAJORAPI` should always be `0`. Only `MINOR` and `PATCH` should be updated every time you build your mod. Once you build an official release (most of the time with a stable API), you should increment `MAJORMOD` to version `1.0.0.0`. For any further development stages, refer to the [Prereleases][pre] and [Release candidates][rc] section of this document.

### Multiple Minecraft Versions

If the mod upgrades to a new version of Minecraft, and the old version will only receive bug fixes, the `PATCH` variable should be updated based on the version before the upgrade. If the mod is still in active development in both the old and the new version of Minecraft, it is advised to append the version to **both** build numbers. For example, if the mod is upgraded to version `3.0.0.0` due to a Minecraft version change, the old mod should also be updated to `3.0.0.0`. The old version will become, for example, version `1.7.10-3.0.0.0`, while the new version will become `1.8-3.0.0.0`. If there are no changes at all when building for a newer Minecraft version, all variables except for the Minecraft version should stay the same.

### Final Release

When dropping support for a Minecraft version, the last build for that version should get the `-final` suffix. This denotes that the mod will no longer be supported for the denoted `MCVERSION` and that players should upgrade to a newer version of the mod to continue receiving updates and bug fixes.

### Pre-releases

It is also possible to prerelease work-in-progress features, which means new features are released that are not quite done yet. These can be seen as a sort of "beta". These versions should be appended with `-betaX`, where `X` is the number of the prerelease. (This guide does not use `-pre` since, at the time of writing, it is not a valid alias for `-beta`.) Note that already released versions and versions before the initial release can not go into prerelease; variables (mostly `MINOR`, but `MAJORAPI` and `MAJORMOD` can also prerelease) should be updated accordingly before adding the `-beta` suffix. Versions before the initial release are simply work-in-progress builds.

### Release Candidates

Release candidates act as prereleases before an actual version change. These versions should be appended with `-rcX`, where `X` is the number of the release candidate which should, in theory, only be increased for bugfixes. Already released versions can not receive release candidates; variables (mostly `MINOR`, but `MAJORAPI` and `MAJORMOD` can also prerelease)  should be updated accordingly before adding the `-rc` suffix. When releasing a release candidate as stable build, it can either be exactly the same as the last release candidate or have a few more bug fixes.

[semver]: https://semver.org/
[cmpver]: https://maven.apache.org/ref/3.5.2/maven-artifact/apidocs/org/apache/maven/artifact/versioning/ComparableVersion.html
[pre]: #pre-releases
[rc]: #release-candidates
