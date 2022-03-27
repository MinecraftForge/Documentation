Perspective
===========

When an [`BakedModel`][bakedmodel] is being rendered as an item, it can apply special handling depending on which perspective it is being rendered in. "Perspective" means in what context the model is being rendered. The possible perspectives are represented in code by the `ItemTransforms$TransformType` enum. There are two systems for handling perspective: the deprecated vanilla system, constituted by `BakedModel#getTransforms`, `ItemTransforms`, and `ItemTransform`, and the Forge system, embodied by the method `IForgeBakedModel#handlePerspective`. The vanilla code is patched to favor using `handlePerspective` over the vanilla system whenever possible.

`TransformType`
---------------

`NONE` - Unused.

`THIRD_PERSON_LEFT_HAND`/`THIRD_PERSON_RIGHT_HAND`/`FIRST_PERSON_LEFT_HAND`/`FIRST_PERSON_RIGHT_HAND` - The first person values represent when the player is holding the item in their own hand. The third person values represent when another player is holding the item and the client is looking at them in the 3rd person. Hands are self-explanatory.

`HEAD` - Represents when any player is wearing the item in the helmet slot (e.g. pumpkins).

`GUI` - Represents when the item is being rendered in a `Screen`.

`GROUND` - Represents when the item is being rendered in the level as an `ItemEntity`.

`FIXED` - Used for item frames.

The Vanilla Way
---------------

The vanilla way of handling perspective is through `BakedModel#getTransforms`. This method returns an `ItemTransforms`, which is a simple object that contains various `ItemTransform`s as `public final` fields. An `ItemTransform` represents a rotation, a translation, and a scale to be applied to the model. The `ItemTransforms` is a container for these, holding one for each of the `TransformType`s except `NONE`. In the vanilla implementation, calling `#getTransform` for `NONE` results in the default transform, `ItemTransform#NO_TRANSFORM`.

The entire vanilla system for handling transforms is deprecated by Forge, and most implementations of `BakedModel` should simply `return ItemTransforms#NO_TRANSFORMS` (which is the default implementation) from `BakedModel#getTransforms`. Instead, they should implement `#handlePerspective`.

The Forge Way
-------------

The Forge way of handling transforms is `#handlePerspective`, a method patched into `BakedModel`. It supersedes the `#getTransforms` method. Additionally, the class `PerspectiveMapWrapper` is a simple implementation of an `BakedModel` with the method; it is a wrapper around other `BakedModel`s, augmenting them with a `Map<TransformType, Transformation>` to handle perspective.

#### `BakedModel#handlePerspective`

Given a `TransformType` and `PoseStack`, this method produces an `BakedModel` to be rendered. Because the returned `BakedModel` can be a totally new model, this method is more flexible than the vanilla method (e.g. a piece of paper that looks flat in hand but crumpled on the ground).

### `PerspectiveMapWrapper`

A wrapper around other `BakedModel`s, this class delegates to the wrapped model for all `BakedModel` methods except `#handlePerspective`, and utilizes a simple `Map<TransformType, Transformation>` for `#handlePerspective`. However, the more interesting parts of this class are the static helper methods.

#### `getTransforms` and `getTransformsWithFallback`

Given an `ItemTransforms` or an `ModelState`, this method will extract an `ImmutableMap<TransformType, Transformation>` from it. To extract this information from an `ModelState`, each `TransformType` is passed to `#getPartTransformation`.

This is how models should support custom perspective transforms through `ModelState`. `UnbakedModel`s should pass the `ModelState` in `#bake`. Then the `BakedModel` can use these custom transforms in `#handlePerspective`, composing them on top of its own.

#### `handlePerspective`

Given either a map of transforms or an `ModelState`, an `BakedModel`, a `TransformType`, and a `PoseStack`, this finds the `BakedModel` for the transform from the map or the `ModelState`, and then pairs it with the given model. To extract the transform from an `ModelState`, the `TransformType` is passed to `#getPartTransformation`. This method is meant to be a simple implementation of `BakedModel#handlePerspective`.

[bakedmodel]: ./bakedmodel.md
