Internationalization and Localization
=====================================

Internationalization, i18n for short, is a way of designing code so that it requires no changes to be adapted for various languages. Localization is the process of adapting displayed text to the user's language.

I18n is implemented using _translation keys_. A translation key is a string that identifies a piece of displayable text in no specific language. For example, `block.minecraft.dirt` is the translation key referring to the name of the Dirt block. This way, displayable text may be referenced with no concern for a specific language. The code requires no changes to be adapted in a new language.

Localization will happen in the game's locale. In a Minecraft client the locale is specified by the language settings. On a dedicated server, the only supported locale is `en_us`. A list of available locales can be found on the [Minecraft Wiki][langs].

Language files
--------------

Language files are located by `assets/[namespace]/lang/[locale].json` (e.g. all US English translations provided by `examplemod` would be within `assets/examplemod/lang/en_us.json`). The file format is simply a json map from translation keys to values. The file must be encoded in UTF-8. Old .lang files can be converted to json using a [converter][converter].

```json
{
  "item.examplemod.example_item": "Example Item Name",
  "block.examplemod.example_block": "Example Block Name",
  "commands.examplemod.examplecommand.error": "Example Command Errored!"
}
```

Usage with Blocks and Items
---------------------------

Block, Item and a few other Minecraft classes have built-in translation keys used to display their names. These translation keys are specified by overriding `#getDescriptionId`. Item also has `#getDescriptionId(ItemStack)` which can be overridden to provide different translation keys depending on ItemStack NBT.

By default, `#getDescriptionId` will return `block.` or `item.` prepended to the registry name of the block or item, with the colon replaced by a dot. `BlockItem`s override this method to take their corresponding `Block`'s translation key by default. For example, an item with ID `examplemod:example_item` effectively requires the following line in a language file:

```json
{
  "item.examplemod.example_item": "Example Item Name"
}
```

!!! note
    The only purpose of a translation key is internationalization. Do not use them for logic. Use registry names instead.


Localization methods
--------------------

!!! warning
    A common issue is having the server localize for clients. The server can only localize in its own locale, which does not necessarily match the locale of connected clients.
    
    To respect the language settings of clients, the server should have clients localize text in their own locale using `TranslationTextComponent` or other methods preserving the language neutral translation keys.

### `net.minecraft.client.resources.I18n` (client only)

**This I18n class can only be found on a Minecraft client!** It is intended to be used by code that only runs on the client. Attempts to use this on a server will throw exceptions and crash.

- `get(String, Object...)` localizes in the client's locale with formatting. The first parameter is a translation key, and the rest are formatting arguments for `String.format(String, Object...)`.

### `TranslationTextComponent`

`TranslationTextComponent` is an `ITextComponent` that is localized and formatted lazily. It is very useful when sending messages to players because it will be automatically localized in their own locale.

The first parameter of the `TranslationTextComponent(String, Object...)` constructor is a translation key, and the rest are used for formatting. The only supported format specifiers are `%s` and `%1$s`, `%2$s`, `%3$s` etc. Formatting arguments may be other `ITextComponent`s that will be inserted into the resulting formatted text with all their attributes preserved.

### `TextComponentHelper`

- `createComponentTranslation(ICommandSource, String, Object...)` creates a localized and formatted `TextComponent` depending on a receiver. The localization and formatting is done eagerly if the receiver is a vanilla client. If not, the localization and formatting is done lazily with a `TranslationTextComponent`. This is only useful if the server should allow vanilla clients to connect.

[langs]: https://minecraft.gamepedia.com/Language#Available_languages
[converter]: https://tterrag.com/lang2json/
