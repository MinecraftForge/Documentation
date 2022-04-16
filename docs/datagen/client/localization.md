Language Generation
===================

[Language files][lang] can be generated for a mod by subclassing `LanguageProvider` and implementing `#addTranslations`. Each `LanguageProvider` subclass created represents a separate [locale] (`en_us` represents American English, `es_es` represents Spanish, etc.). After implementation, the provider must be [added][datagen] to the `DataGenerator`.

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
    // Encdoded as 'Art\u00EDculo de ejemplo' for 'es_es' (Spanish) locale
    this.addItem(EXAMPLE_ITEM, "Artículo de ejemplo");
    ```

[lang]: ../../concepts/internationalization.md
[locale]: https://minecraft.fandom.com/wiki/Language#Languages
[datagen]: ../index.md#data-providers
