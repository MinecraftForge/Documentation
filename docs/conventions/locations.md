Locations
=========

Minecraft expects certain parts of your project to be in certain locations, such as textures and JSONs.

All locations and items covered in this page are relative to your `./src/main/resources/` folder.

### mods.toml

The `mods.toml` file is in the `./META-INF/` directory.

### Blockstates

Blockstate definition files are JSONs within `./assets/<modid>/blockstates/` folder.

### Localizations

[Localizations][i18n] are JSONs named after their lowercased [language code][langcode], such as `en_us`.

They are located in the `./assets/<modid>/lang/` folder.

### Models

Model files are JSONs located within `./assets/<modid>/models/block/` or `./assets/<modid>/models/item/` depending on whether they are for a block or an item, respectively.

### Textures

Textures are PNGs located within `./assets/<modid>/textures/block/` or `./assets/<modid>/textures/item/` depending on whether they are for a block or an item, respectively.

### Recipes

[Recipes][recipes] are JSONs located within `./data/<modid>/recipes/`.

[i18n]: ../concepts/internationalization.md
[langcode]: https://msdn.microsoft.com/en-us/library/ee825488(v=cs.20).aspx
[recipes]: ../utilities/recipes.md
