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