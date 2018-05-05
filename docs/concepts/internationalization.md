Internationalization and localization
=====================================

Internationalization, i18n for short, is a way of designing code so that it requires no changes to be adapted for various languages. Localization is the process of adapting displayed text to the user's language.

I18n is implemented using _translation keys_. A translation key is a string that identifies a piece of displayable text in no specific language. For example, `tile.dirt.name` is the language key referring to the name of the Dirt block. This way, displayable text may be referenced with no concern for a specific language. The code requires no changes to be adapted in a new language.

Localization will happen in the game's locale. In a Minecraft client the locale is specified by the language settings. On a dedicated server, the only supported locale is en_US.

Language files
--------------

Language files are located by `assets/domain/lang/locale.lang` (e.g. the US English translation for `examplemod` would be `assets/examplemod/lang/en_us.lang`). Resource pack format 3 requires the locale name to be lowercased. The file format is simply lines of key-value pairs. Lines starting with `#` are treated as comments.

```properties
# items
item.examplemod.example_item.name=Example Item Name

# blocks
tile.examplemod.example_block.name=Example Block Name

# commands
commands.examplemod.examplecommand.usage=/example <value>
```

A language file may contain escape sequences if the file starts with the comment `#PARSE_ESCAPES`.

Localization methods
--------------------

!!! warning
    A common issue is having the server localize for clients. The server can only localize in its own locale, which does not necessarily match the locale of connected clients.
    
    To respect the language settings of clients, the server should have clients localize text in their own locale using TextComponentTranslation or other methods preserving the language neutral translation keys.

### `net.minecraft.client.resources.I18n` (client only)

**This I18n class can only be found on a Minecraft client!** It is intended to be used by code that only runs on the client. Attempts to use this on a server will throw exceptions and crash.

- `format(String, Object...)` localizes in the client's locale with formatting. The first parameter is a language key, and the rest are used for `String.format(String, Object...)`.

### `net.minecraft.util.text.translation.I18n` (deprecated)

**This class is deprecated and should often be avoided.** It is intended to be used by code that runs on the logical server. Because localization should rarely happen on the server, other alternatives should be considered.

- `translateToLocal(String)` localizes in the game's locale without formatting. The parameter is a language key.
- `translateToLocalFormatted(String, Object...)` localizes in the game's locale with formatting. The first parameter is a language key, and the rest are used for `String.format(String, Object...)`.

### `TextComponentTranslation`

`TextComponentTranslation` is an `ITextComponent` that is localized and formatted lazily. It is very useful when sending messages to players because it will be automatically localized in their own locale.

The first parameter of the `TextComponentTranslation(String, Object...)` constructor is a language key, and the rest are used for formatting. The only supported format specifiers are `%s` and `%1$s`, `%2$s`, `%3$s` etc. Formatting arguments may be other `ITextComponent`s that will be inserted into the resulting formatted text with all their attributes preserved.

### `TextComponentHelper`

- `createComponentTranslation(ICommandSender, String, Object...)` creates a localized and formatted `ITextComponent` depending on a command sender. The localization and formatting is done eagerly if the command sender is a vanilla client. If not, the localization and formatting is done lazily with a `TextComponentTranslation`. This is only useful if the server should allow vanilla clients to connect.
