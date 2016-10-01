Item Property Overrides
=======================

An item property assigns a certain `float` value to every ItemStack it is registered for, and vanilla item model definitions can use these values to define "overrides", where an item defaults to a certain model, but if an override matches, it overrides the model and uses another. The format of item models, including overrides, can be found on the [wiki][]. They are useful mainly because of the fact that they are continuous. For example, bows use item properties to define their pull animation. Since the value of the property is a `float`, it increases continuously from 0 to 1. This allows resource packs to add as many models as they want for the bow pulling animation along that spectrum, instead of being stuck with four "slots" for their models in the animation. The same is true of the compass and clock.


Adding Properties to Items
--------------------------

To add a property to an `Item`, simply call `addPropertyOverride` on it. The `ResourceLocation` parameter is the name given to the property (e.g. `new ResourceLocation("pull")`). The `IItemPropertyGetter` is a function that takes the `ItemStack`, the `World` it's in, and the `EntityLivingBase` that holds it, returning the `float` value for the property. Some examples are the `"pulling"` and "`pull`" properties in `ItemBow`, and the several `static final` ones in `Item`. For your own item properties, use an RL with your modid as the domain (e.g. `examplemod:property`).


Using Overrides
---------------

The format of an override can be seen on the [wiki][], and a good example can be found in `model/item/bow.json`. For reference, here is a hypothetical example of an item with an `examplemod:power` property. Notice that when you define a predicate, it applies to *all values __greater than or equal to__ the given value*. If the values have no match, the default is the current model.

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

And here's a hypothetical snippet from the supporting code. (Note that this does not have to be client-only. It will work on a server too.)

```java
item.addPropertyOverride(new IItemPropertyGetter() {
  @SideOnly(Side.CLIENT)
  @Override
  public float apply(ItemStack stack, @Nullable World world, @Nullable EntityLivingBase entity) {
    return getPowerLevel(stack) / getMaxPower(stack); // Some external methods
  }
}
```

[wiki]: http://minecraft.gamepedia.com/Model#Item_models
