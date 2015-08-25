# Mod Identity
The 'identity' of your mod consists of it's name, mod id, filename, and version.

## Mod ID
Mod IDs should consist of alphanumeric characters (0-9, A-Z) and be all-lowercase. For example, vanilla's "mod id" is 'minecraft'.

Spacers (underscore and hyphen) are fine, but hyphens are preferred. **A mod id should never contain spaces or periods.** These can cause strange issues to arise.

## Mod Name
A mod's name can be virtually anything. Unicode, spacers, symbols, alphanumerics, all should work fine, but may trip up faulty code.

To maximize compatibility, mod names should be restricted to alphanumerics (A-Z, 0-9), spaces, and basic symbols.
Using characters outside this space is fine, but may trip up poorly-coded or legacy mods. A mod name should never contain color codes, as it can cause rendering problems.

## Filenames
A mod's filename can be anything supported by the target system, but there are some symbols and characters that can cause problems, or be outright refused, on some systems.
A mod filename should never contain any of the characters that are illegal on most popular filesystems; these are:

 - `#` (pound/hash/number sign)
 - `<` (left angle bracket/less than)
 - `>` (right angle bracket/greater than)
 - `$` (dollar sign)
 - `+` (plus sign)
 - `%` (percent sign)
 - `!` (exclamation point)
 - <code>`</code> (backtick/grave)
 - `&` (ampersand/and sign)
 - `*` (asterisk)
 - `'` (apostrophe/single quote)
 - `"` (double quote)
 - `|` (pipe/vertical bar)
 - `{` (left bracket)
 - `}` (right bracket)
 - `/` (forward slash)
 - `:` (colon)
 - `=` (equals sign)
 - `\` (backslash)
 - `@` (at sign)

A mod filename can contain spaces, but it is strongly discouraged, as spaces can cause trouble on a lot of systems.
All mods must have the .jar extension; the .zip extension was deprecated long ago.
Much like modids, hyphens are preferred to underscores.

A mod filename should generally match the pattern `NAME-VERSION.jar`. ForgeGradle emits jars named with this pattern by default.

For example, if you had a mod called "BananaCraft", version 2.1.4, you would name your mod `BananaCraft-2.1.4.jar`.


## Versions
In general projects, Semantic Versioning is often used (with format MAJOR.MINOR.PATCH). However, in the case of modding, it may be more beneficial to use the format MCVERSION-MAJORMOD.MAJORAPI.MINOR.PATCH (Modified SemVer), to be able to differenciate between save-changing and API-breaking changes, and to make it easier to see what version of the mod is for which version of Minecraft.

### Explanation of 'Modified SemVer'
A most likely incomplete list of things that should increment the various parts of the version number:

 - **MCVERSION**
  - Should always match the Minecraft version this mod is for
 - **MAJORMOD**
  - Removing items, blocks, tile entities, entities, etc
  - Changing or removing previously existing mechanics
  - Making other changes that require permanent changes to the save file (changes that completely invalidate the world should be mentioned in a changelog)
 - **MAJORAPI**
  - *Can be omitted if your mod does not have an API*
  - Changing the order of variables or enums
  - Changing method signatures
  - Changing method return types
  - Removing fields or methods
  - Other changes that break API and/or ABI compatibility for mods that use your API
 - **MINOR**
  - Adding items, blocks, tile entities, entities, etc
  - Adding new mechanics
  - Adding new features to the API
  - Moving blocks and offering a graceful update process (e.g. merging two blocks into one with a crafting recipe and/or automatic means to convert them)
 - **PATCH**
  - Bugfixes.

Whenever a part of the version is incremented, all lesser fields should be reset to zero. For example, if MINOR is incremented, PATCH should become 0. If MAJOR-API is incremented, MINOR and PATCH should become 0.

In addition, a version can have a "qualifier", such as "pre1" to denote a pre-release, or "rc1" to denote a release candidate. This should be placed after the version, preceded by a hyphen (-).

### Examples
A few examples of what could be considered a standard update process for a mod:
 - **1.7.10-0.0.0.0** (Initial experimental release, unfinished)
 - **1.7.10-0.0.1.0** (Add a feature)
 - **1.7.10-1.0.0.0** (Confident enough in stability and feature completeness to make an initial release)
 - **1.7.10-1.0.0.1** (Fix a bug)
 - **1.7.10-1.0.1.0** (Add a feature)
 - **1.7.10-1.0.1.1** (Fix another bug)
 - **1.7.10-1.1.0.0** (Remove an API method)
 - **1.7.10-1.1.1.0** (Deprecate an API method)
 - **1.7.10-2.0.0.0** (Remove an item)
 - **1.8-2.0.0.0** (Update to Minecraft 1.8)
 - **1.7.10-2.0.0.1**, **1.8-2.0.0.1** (Fix a bug in both versions)
 - **1.7.10-2.0.0.1-final** (Drop support for 1.7.10)
 - **1.8-3.0.0.0-pre1** (Pre-release of some major changes)
 - **1.8-3.0.0.0-pre2** (Some fixes are made to the pre-release)
 - **1.8-3.0.0.0-pre3** (A couple new features are added)
 - **1.8-3.0.0.0-pre4** (Remove a feature added in a previous pre-release)
 - **1.8-3.0.0.0-rc1** (Most of the bugs are thought to be fixed, and so it is now a release candidate)
 - **1.8-3.0.0.0-rc2** (Bugfixes)
 - **1.8-3.0.0.0** (Release of the version, maybe with a few more bugfixes, or potentially exactly the same as rc2)
 - **1.9-3.0.0.0** (Update to Minecraft 1.9, no new features)
 - **1.10-3.0.1.0** (Update to Minecraft 1.10, and a new feature)