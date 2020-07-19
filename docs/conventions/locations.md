Locations
=========

Minecraft expects certain parts of your project to be in certain locations, such as textures and JSONs.

All locations and items covered in this page are relative to your `./src/main/resources/` folder.

### mods.toml

The `mods.toml` file is in the `./META-INF/` directory.

### Blockstates

Blockstate definition files are in the JSON format and are in the `./assets/<modid>/blockstates/` folder.

### Localizations

[Localizations][i18n] are plain-text files with the file extension `.json` and the name being their [language code][langcode] in lowercase such as `en_us`.

They are located in the `./assets/<modid>/lang/` folder.

### Models

Model files are in JSON format and are located in `./assets/<modid>/models/block/` or `./assets/<modid>/models/item/` depending on whether they are for a block or an item, respectively.

### Textures

Textures are in the PNG format and are located in `./assets/<modid>/textures/block/` or `./assets/<modid>/textures/item/` depending on whether they are for a block or an item, respectively.

### Recipes

[Recipes][Recipes] are in JSON format and are located in `./data/<modid>/recipes/`.

[Recipes]: ../utilities/recipes.md
[langcode]: https://msdn.microsoft.com/en-us/library/ee825488(v=cs.20).aspx
[i18n]: ../concepts/internationalization.md
