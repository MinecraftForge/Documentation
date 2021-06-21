`ItemOverrideList`
==================

`ItemOverrideList` provides a way for an [`IBakedModel`][baked] to process the state of an `ItemStack` and return a new `IBakedModel`; thereafter, the returned model replaces the old one. `ItemOverrideList` represents an arbitrary function `(IBakedModel, ItemStack, ClientWorld, LivingEntity)` → `IBakedModel`, making it useful for dynamic models. In vanilla, it is used to implement item property overrides.

### `ItemOverrideList()`

Given a list of `ItemOverride`s, the constructor copies that list and stores the copy. The list may be accessed with `#getOverrides`.

### `resolve`

This takes an `IBakedModel`, an `ItemStack`, a `ClientWorld`, and an `LivingEntity` to produce another `IBakedModel` to use for rendering. This is where models can handle the state of their items.

This should not mutate the world.

### `getOverrides`

Returns an immutable list containing all the [`ItemOverride`][override]s used by this `ItemOverrideList`. If none are applicable, this returns the empty list.

## `ItemOverride`

This class represents a vanilla item override, which holds several predicates for the properties on an item and a model to use in case those predicates are satisfied. They are the objects in the `overrides` array of a vanilla item JSON model:

```json
{
  "__comment": "Inside a vanilla JSON item model.",
  "overrides": [
    {
      "__comment": "This is an ItemOverride.",
      "predicate": {
        "__comment": "This is the Map<ResourceLocation, Float>, containing the names of properties and their minimum values.",
        "example1:prop": 4
      },
      "__comment": "This is the 'location', or target model, of the override, which is used if the predicate above matches.",
      "model": "example1:item/model"
    },
    {
      "__comment": "This is another ItemOverride.",
      "predicate": {
        "prop": 1
      },
      "model": "example2:item/model"
    }
  ]
}
```

[baked]: ibakedmodel.md
[override]: #itemoverride
