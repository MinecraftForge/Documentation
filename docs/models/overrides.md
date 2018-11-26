Item Property Overrides
=======================

Item properties are a way for the "properties" of items to be exposed to the model system. An example is the bow, where the most important property is how far the bow has been pulled. This information is then used to choose a model for the bow, creating an animation for pulling it. This is different from assigning `ModelResourceLocation`s directly to items through `ModelLoader.setCustomModelResourceLocation` or `ModelLoader.setCustomMeshDefinition`. These methods fix the possible set of models. Used on a bow, for example, these methods would permanently fix the number of frames in the pull animation to 4. However, properties are more flexible.

An item property assigns a certain `float` value to every `ItemStack` it is registered for, and vanilla item model definitions can use these values to define "overrides", where an item defaults to a certain model, but if an override matches, it overrides the model and uses another. The format of item models, including overrides, can be found on the [wiki][]. They are useful mainly because of the fact that they are continuous. For example, bows use item properties to define their pull animation. Since the value of the property is a `float`, it increases continuously from 0 to 1. This allows resource packs to add as many models as they want for the bow pulling animation along that spectrum, instead of being stuck with four "slots" for their models in the animation. The same is true of the compass and clock.

Adding Properties to Items
--------------------------

`Item::addPropertyOverride` is used to add a property to an item. The `ResourceLocation` parameter is the name given to the property (e.g. `new ResourceLocation("pull")`). The `IItemPropertyGetter` is a function that takes the `ItemStack`, the `World` it's in, and the `EntityLivingBase` that holds it, returning the `float` value for the property. Some examples are the `"pulling"` and "`pull`" properties in `ItemBow`, and the several `static final` ones in `Item`. For modded item properties, it is recommended that the modid of the mod is used as the namespace (e.g. `examplemod:property` and not just `property`, as that really means `minecraft:property`).

Using Overrides
---------------

The format of an override can be seen on the [wiki][format], and a good example can be found in `model/item/bow.json`. For reference, here is a hypothetical example of an item with an `examplemod:power` property. If the values have no match, the default is the current model.

!!! important
    A predicate applies to all values *greater than or equal to* the given value.

```json
{
  "parent": "item/generated",
  "textures": {
    "__comment": "Default",
    "layer0": "examplemod:items/examplePartial"
  },
  "overrides": [
    {
      "__comment": "power >= .75",
      "predicate": {
        "examplemod:power": 0.75
      },
      "model": "examplemod:item/examplePowered"
    }
  ]
}
```

And here's a hypothetical snippet from the supporting code. (This does not have to be client-only; it will work on a server too. In vanilla, properties are registered in the item's constructor.)

```java
item.addPropertyOverride(new IItemPropertyGetter() {
  @SideOnly(Side.CLIENT)
  @Override
  public float apply(ItemStack stack, @Nullable World world, @Nullable EntityLivingBase entity) {
    return (float)getPowerLevel(stack) / (float)getMaxPower(stack); // Some external methods
  }
}
```

[format]: https://minecraft.gamepedia.com/Model#Item_models
