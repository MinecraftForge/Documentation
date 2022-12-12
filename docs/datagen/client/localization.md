Language Generation
===================

[Language files][lang] can be generated for a mod by subclassing `LanguageProvider` and implementing `#addTranslations`. Each `LanguageProvider` subclass created represents a separate [locale] (`en_us` represents American English, `es_es` represents Spanish, etc.). After implementation, the provider must be [added][datagen] to the `DataGenerator`.

```java
// On the MOD event bus
@SubscribeEvent
public void gatherData(GatherDataEvent event) {
    event.getGenerator().addProvider(
        // Tell generator to run only when client assets are generating
        event.includeClient(),
        // Localizations for American English
        output -> new MyLanguageProvider(output, MOD_ID, "en_us")
    );
}
```

`LanguageProvider`
------------------

Each language provider is simple a map of strings where each translation key is mapped to a localized name. A translation key mapping can be added using `#add`. Additionally, there are methods which use the translation key of a `Block`, `Item`, `ItemStack`, `Enchantment`, `MobEffect`, and `EntityType`.

```java
// In LanguageProvider#addTranslations
this.addBlock(EXAMPLE_BLOCK, "Example Block");
this.add("object.examplemod.example_object", "Example Object");
```

!!! tip
    Localized names which contain alphanumeric values not in American English can be supplied as is. The provider automatically translates the characters into their unicode equivalents to be read by the game.

    ```java
    // Encdoded as 'Example with a d\u00EDacritic'
    this.addItem("example.diacritic", "Example with a díacritic");
    ```

[lang]: ../../concepts/internationalization.md
[locale]: https://minecraft.fandom.com/wiki/Language#Languages
[datagen]: ../index.md#data-providers
