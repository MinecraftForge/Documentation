# Versioning
In general projects, [Semantic Versioning](http://semver.org/) is often used (which has the format MAJOR.MINOR.PATCH). However, in the case of modding it may be more beneficial to use the format MCVERSION-MAJORMOD.MAJORAPI.MINOR.PATCH, to be able to differentiate between world-breaking and API-breaking changes of a mod.

## Examples
Here is a (most likely incomplete) list of things that increment the various variables.
* MCVERSION
	* Always matches the Minecraft version the mod is for.
* MAJORMOD
	* Removing items, blocks, tile entities, etc.
	* Changing or removing previously existing mechanics.
	* Updating to a new Minecraft version.
* MAJORAPI
	* Changing the order or variables of enums.
	* Changing return types of methods.
	* Removing public methods altogether.
* MINOR
	* Adding items, blocks, tile entities, etc.
	* Adding new mechanics.
	* Deprecating public methods. (This is not a MAJOR-API increment since it doesn't break an API.)
* PATCH
	* Bugfixes.

When incrementing any variable, all lesser variables should reset to 0. For instance, if MINOR would increment, PATCH would become 0. If MAJOR-MOD would increment, all other variables would become 0.

### Work in progress
If you are in the initial development stage of your mod (before any official releases), the MAJOR-MOD and MAJOR-API should always be 0. Only MINOR should be updated every time you build your mod. Once you build an official release (most of the time with a stable API), you should increment MAJOR-MOD to version 1.0.0.0. For any further development stages, refer to the [Prereleases](#prereleases) and [Release candidates](#release-candidates) section of this document.

### Multiple Minecraft versions
If the mod upgrades to a new version of Minecraft, and the old version will only receive bug fixes, the PATCH variable should be updated based on the version before the upgrade. If the mod is still in active development in both the old and the new version of Minecraft, it is advised to append the version to BOTH build numbers. For example, if the mod is upgraded to version 3.0.0.0 due to a Minecraft version change, the old mod should also be updated to 3.0.0.0. The old version will become, for example, version 1.7.10-3.0.0.0, while the new version will become 1.8-3.0.0.0. If there are no changes at all when building for a newer Minecraft version, all variables except for the Minecraft version should stay the same.

### Final release
When dropping support for a Minecraft version, the last build for that version should get the -final suffix. This denotes that the mod will no longer be supported for the denoted MC-VERSION and that players should upgrade to a newer version of the mod to continue receiving updates and bug fixes.

### Prereleases
It is also possible to prerelease work-in-progress features, which means new features are released that are not quite done yet. These can be seen as a sort of "beta". These versions should be appended with -betaX, where X is the number of the prerelease. (This guide does not use -pre since, at the time of writing, it is not a valid alias for -beta according to Forge.) Note that already released versions and versions before the initial release can not go into prerelease; variables (mostly MINOR, but MAJORAPI and MAJORMOD can also prerelease) should be updated accordingly before adding the -beta suffix. Versions before the initial release are simply work-in-progress builds.

### Release candidates
Release candidates act as prereleases before an actual version change. These versions should be appended with -rcX, where X is the number of the release candidate which should, in theory, only be increased for bugfixes. Already released versions can not receive release candidates; variables (mostly MINOR, but MAJORAPI and MAJORMOD can also prerelease)  should be updated accordingly before adding the -rc suffix. When releasing a release candidate as stable build, it can either be exactly the same as the last release candidate or have a few more bug fixes.