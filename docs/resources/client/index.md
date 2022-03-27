Resource Packs
==============

[Resource Packs][respack] allow for the customization of client resources through the `assets` directory. This includes textures, models, sounds, localizations, and others. Your mod (as well as Forge itself) can also have resource packs. Any user can therefore modify all the textures, models, and other assets defined within this directory.

### Creating a Resource Pack
Resource Packs are stored within your project's resources. The `assets` directory contains the contents of the pack, while the pack itself is defined by the `pack.mcmeta` alongside the `assets` folder.
Your mod can have multiple asset domains, since you can add or modify already existing resource packs, like vanilla's, Forge's, or another mod's.
You can then follow the steps found [at the Minecraft Wiki][createrespack] to create any resource pack.

Additional reading: [Resource Locations][resourcelocation]

[respack]: https://minecraft.fandom.com/wiki/Resource_Pack
[createrespack]: https://minecraft.fandom.com/wiki/Tutorials/Creating_a_resource_pack
[resourcelocation]: ../../concepts/resources.md#ResourceLocation
