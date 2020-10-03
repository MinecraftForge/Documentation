Item Property Overrides
=======================

Item properties are a way for the "properties" of items to be exposed to the model system. An example is the bow, where the most important property is how far the bow has been pulled. This information is then used to choose a model for the bow, creating an animation for pulling it.

An item property assigns a certain `float` value to every `ItemStack` it is registered for, and vanilla item model definitions can use these values to define "overrides", where an item defaults to a certain model, but if an override matches, it overrides the model and uses another. They are useful mainly because they are continuous. For example, bows use item properties to define their pull animation. Since the value of the property is a `float`, it increases continuously from 0 to 1. This allows resource packs to add as many models as they want for the bow pulling animation along that spectrum, instead of being stuck with four "slots" for their models in the animation. The same is true of the compass and clock.

Adding Properties to Items
--------------------------

`ItemModelsProperties::func_239420_a_` is used to add a property to all items, it does not take `Item` as it's parameter. `ItemModelsProperties::func_239418_a_` is used to add a property to a certain item. The `Item` parameter is the item the property is attaching to (e.g. ExampleItems.APPLE). The `ResourceLocation` parameter is the name given to the property (e.g. `new ResourceLocation("pull")`). The `IItemPropertyGetter` is a function that takes the `ItemStack`, the `ClientWorld` it's in (may be null), and the `LivingEntity` that holds it (may be null), returning the `float` value for the property. For modded item properties, it is recommended that the modid of the mod is used as the namespace (e.g. `examplemod:property` and not just `property`, as that really means `minecraft:property`). These should be done in FMLClientSetupEvent.
!!! important
    Use DeferredWorkQueue to proceed the task, since the data structures in ItemModelsProperties are not threadsafe.

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

And here's a hypothetical snippet from the supporting code. Unlike the older versions (lower than 1.16.x), this needs to be done on client side only because ItemModelsProperties does not exist on server.

```java
private void setup(final FMLCommonSetupEvent event)
{
  DeferredWorkQueue.runLater(() ->
  {
    ItemModelsProperties.func_239418_a_(ExampleItems.APPLE, 
      new ResourceLocation(ExampleMod.MODID, pulling"), (stack, world, living) -> {
        return living != null && living.isHandActive() && living.getActiveItemStack() == stack ? 1.0F : 0.0F;
      });
  });
}
```

[format]: https://minecraft.gamepedia.com/Model#Item_models
