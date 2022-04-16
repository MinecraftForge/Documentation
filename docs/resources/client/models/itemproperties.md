Item Properties
===============

Item properties are a way for the "properties" of items to be exposed to the model system. An example is the bow, where the most important property is how far the bow has been pulled. This information is then used to choose a model for the bow, creating an animation for pulling it.

An item property assigns a certain `float` value to every `ItemStack` it is registered for, and vanilla item model definitions can use these values to define "overrides", where an item defaults to a certain model, but if an override matches, it overrides the model and uses another. They are useful mainly because they are continuous. For example, bows use item properties to define their pull animation. The item models are decided by the 'float' number predicates, it is not limited but generally between `0.0F` and `1.0F`. This allows resource packs to add as many models as they want for the bow pulling animation along that spectrum, instead of being stuck with four "slots" for their models in the animation. The same is true of the compass and clock.

Adding Properties to Items
--------------------------

`ItemProperties#register` is used to add a property to a certain item. The `Item` parameter is the item the property is being attached to (e.g. `ExampleItems#APPLE`). The `ResourceLocation` parameter is the name given to the property (e.g. `new ResourceLocation("pull")`). The `ItemPropertyFunction` is a functional interface that takes the `ItemStack`, the `ClientLevel` it is in (may be null), the `LivingEntity` that holds it (may be null), and the `int` containing the id of the holding entity (may be `0`), returning the `float` value for the property. For modded item properties, it is recommended that the modid of the mod is used as the namespace (e.g. `examplemod:property` and not just `property`, as that really means `minecraft:property`). These should be done in `FMLClientSetupEvent`.
There's also another method `ItemProperties#registerGeneric` that is used to add properties to all items, and it does not take `Item` as its parameter since all items will apply this property.

!!! important
    Use `FMLClientSetupEvent#enqueueWork` to proceed with the tasks, since the data structures in `ItemProperties` are not thread-safe.

!!! note
    `ItemPropertyFunction` is deprecated by Mojang in favor of using the subinterface `ClampedItemPropertyFunction` which clamps the result between `0` and `1`.

Using Overrides
---------------

The format of an override can be seen on the [wiki][format], and a good example can be found in `model/item/bow.json`. For reference, here is a hypothetical example of an item with an `examplemod:power` property. If the values have no match, the default is the current model, but if there are multiple matches, the last match in the list will be selected.

!!! important
    A predicate applies to all values *greater than or equal to* the given value.

```js
{
  "parent": "item/generated",
  "textures": {
    // Default
    "layer0": "examplemod:items/example_partial"
  },
  "overrides": [
    {
      // power >= .75
      "predicate": {
        "examplemod:power": 0.75
      },
      "model": "examplemod:item/example_powered"
    }
  ]
}
```

And here is a hypothetical snippet from the supporting code. Unlike the older versions (lower than 1.16.x), this needs to be done on client side only because `ItemProperties` does not exist on server.

```java
private void setup(final FMLClientSetupEvent event)
{
  event.enqueueWork(() ->
  {
    ItemProperties.register(ExampleItems.APPLE, 
      new ResourceLocation(ExampleMod.MODID, "pulling"), (stack, level, living, id) -> {
        return living != null && living.isUsingItem() && living.getUseItem() == stack ? 1.0F : 0.0F;
      });
  });
}
```

[format]: https://minecraft.gamepedia.com/Model#Item_models
