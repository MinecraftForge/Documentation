Models
======

The [model system][models] is Minecraft's way of giving blocks and items their shapes. Through the model system, blocks and items are mapped to their models, which define how they look. One of the main goals of the model system is to allow not only textures but the entire shape of a block/item to be changed by resource packs. Indeed, any mod that adds items or blocks also contains a mini-resource pack for their blocks and items.

Model Files
-----------

Models and textures are linked through [`ResourceLocation`][resloc]s but are stored in the `ModelManager` using `ModelResourceLocation`s. Models are referenced in different locations through the block or item's registry name depending on whether they are referencing [block states][statemodel] or [item models][itemmodels]. Blocks will have their `ModelResourceLocation` represent their registry name along with a stringified version of its current [`BlockState`][state] while items will use their registry name followed by `inventory`.

!!! note
    JSON models only support cuboid elements; there is no way to express a triangular wedge or anything like it. To have more complicated models, another format must be used.

### Textures

Textures, like models, are contained within resource packs and are referred to with `ResourceLocation`s. In Minecraft, the [UV coordinates][uv] (0,0) are taken to mean the **top-left** corner. UVs are *always* from 0 to 16. If a texture is larger or smaller, the coordinates are scaled to fit. A texture should also be square, and the side length of a texture should be a power of two, as doing otherwise breaks mipmapping (e.g. 1x1, 2x2, 8x8, 16x16, and 128x128 are good. 5x5 and 30x30 are not recommended because they are not powers of 2. 5x10 and 4x8 are completely broken as they are not square.). Textures should only ever be not a square if it is [animated][animated].

[models]: https://minecraft.fandom.com/wiki/Tutorials/Models#File_path
[resloc]: ../../../concepts/resources.md#resourcelocation
[statemodel]: https://minecraft.fandom.com/wiki/Tutorials/Models#Block_states
[itemmodels]: https://minecraft.fandom.com/wiki/Tutorials/Models#Item_models
[state]: ../../../blocks/states.md
[uv]: https://en.wikipedia.org/wiki/UV_mapping
[animated]: https://minecraft.fandom.com/wiki/Resource_Pack?so=search#Animation
