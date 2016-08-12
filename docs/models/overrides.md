Item Property Overrides
=======================

When you have an item for which you want to use different models depending on its state, you have a few options: use a blockstate JSON, several item models, or use item properties. When you use a blockstate JSON or several item models for an item, you can directly bind certain metadatas to certain variants/models, and with an `ItemMeshDefinition` you can use arbitrary code to map `ItemStack`s to variants/models. However, what if you need more flexibility? For example, a bow needs to know how long it has been pulled, which is most easily accessed as a property of the holding entity. Minecraft 1.8 introduced item property overrides. An item property assigns a certain `float` value to every ItemStack it is registered for, and vanilla item model definitions can use these values to define "overrides", where an item defaults to a certain model, but if an override matches, it overrides the model and uses another. The format of item models, including overrides, can be found on the [wiki]. In the example with bows, an item property is especially nice as properties can be continuous values. Instead of hardcoding only 4 slots for bow models, item properties allow you to define as many models as you want on the spectrum of the "pulling" property.


Adding Properties to Items
--------------------------

To add a property to an `Item`, simply call `addPropertyOverride` on it. The `ResourceLocation` parameter is simply the name given to the property (e.g. `new ResourceLocation("pull")`). The `IItemPropertyGetter` is a function that takes the `ItemStack` for which we're looking for a model, the `World` it's in, and the `EntityLivingBase` that holds it, returning the `float` value for the property. Some examples are the `"pulling"` and "`pull`" properties in `ItemBow`, and the several `static final` ones in `Item`.

Using Overrides
---------------

The format of an override can be seen on the [wiki], and a good example can be found in `model/item/bow.json`. For reference, here is a hypothetical example of an item with a `power` property. Notice that when you define a predicate, it applies to *all values __greater than or equal to__ the given value*. If the values have no match, the default is the current model.

```json
{
  "parent": "item/generated",
  "texture": {
    "__comment": "Default",
    "layer0": "examplemod:items/examplePartial"
  },
  "overrides": [
    {
      "__comment": "power >= .75",
      "predicate": { 
        "power": 0.75
      },
      "model": "examplemod:item/examplePowered"
    }
  ]
}
```

[wiki]: http://minecraft.gamepedia.com/Model#Item_models
