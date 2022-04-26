Tag Generation
==============

[Tags] can be generated for a mod by subclassing `TagsProvider` and implementing `#addTags`. After implementation, the provider must be [added][datagen] to the `DataGenerator`.

`TagsProvider`
--------------

The tags provider has two methods used for generating tags: creating a tag with objects and other tags via `#tag`, or using tags from other object types to generate the tag data via `#getOrCreateRawBuilder`.

!!! note
    Typically, a provider will not call `#getOrCreateRawBuilder` directly unless a registry contains a representation of objects from a different registry (blocks have item representations to obtain the blocks in the inventory).

When `#tag` is called, a `TagAppender` is created which acts as a chainable consumer of elements to add to the tag:

Method           | Description
:---:            | :---
`add`            | Adds an object to a tag. 
`addOptional`    | Adds an object to a tag through its name. If the object is not present, then the object will be skipped when loading.
`addTag`         | Adds a tag to a tag. All elements within the inner tag are now a part of the outer tag.
`addOptionalTag` | Adds a tag to a tag through its name. If the tag is not present, then the tag will be skipped when loading.
`replace`        | When `true`, all previously loaded entries added to this tag from other datapacks will be discarded. If a datapack is loaded after this one, then it will still append the entries to the tag.
`remove`         | Removes an object or tag from a tag.

```java
// In some TagProvider#addTags
this.tag(EXAMPLE_TAG)
  .add(EXAMPLE_OBJECT) // Adds an object to the tag
  .addOptional(new ResourceLocation("othermod", "other_object")) // Adds an object from another mod to the tag

this.tag(EXAMPLE_TAG_2)
  .addTag(EXAMPLE_TAG) // Adds a tag to the tag
  .remove(EXAMPLE_OBJECT) // Removes an object from this tag
```

!!! important
    If the mod's tags softly depends on another mod's tags (the other mod may or may not be present at runtime), the other mods' tags should be referenced using the optional methods.

### Existing Providers

Minecraft contains a few tag providers for certain registries that can be subclassed instead. Additionally, some providers contain additional helper methods to more easily create tags.

Registry Object Type         | Tag Provider
:---:                        | :---
`Block`                      | `BlockTagsProvider`
`Item`                       | `ItemTagsProvider`
`EntityType`                 | `EntityTypeTagsProvider`
`Fluid`                      | `FluidTagsProvider`
`GameEvent`                  | `GameEventTagsProvider`
`Biome`                      | `BiomeTagsProvider`
`ConfiguredStructureFeature` | `ConfiguredStructureTagsProvider`

#### `ItemTagsProvider#copy`

Blocks have item representations to obtain them in the inventory. As such, many of the block tags can also be an item tag. To easily generate item tags to have the same entries as block tags, the `#copy` method can be used which takes in the block tag to copy from and the item tag to copy to.

```java
//In ItemTagsProvider#addTags
this.copy(EXAMPLE_BLOCK_TAG, EXAMPLE_ITEM_TAG);
```

Custom Tag Providers
--------------------

A custom tag provider can be created via a `TagsProvider` subclass which takes in the `Registry` to generate tags for.

```java
public RecipeTypeTagsProvider(DataGenerator generator, ExistingFileHelper fileHelper) {
  super(generator, Registry.RECIPE_TYPE, MOD_ID, fileHelper);
}
```

### Forge Registry Tag Providers

If a registry is wrapped by Forge or [created by a mod][custom], a provider can be created via a `ForgeRegistryTagsProvider` subclass instead:

```java
public MotiveTagsProvider(DataGenerator generator, ExistingFileHelper fileHelper) {
  super(generator, ForgeRegistries.PAINTING_TYPES, MOD_ID, fileHelper);
}
```

[tags]: ../../resources/server/tags.md
[datagen]: ../index.md#data-providers
[custom]: ../../concepts/registries.md#creating-custom-forge-registries
