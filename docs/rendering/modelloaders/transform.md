Transform
==========

When an [`BakedModel`][bakedmodel] is being rendered as an item, it can apply special handling depending on which transform it is being rendered in. "Transform" means in what context the model is being rendered. The possible transforms are represented in code by the `ItemTransforms$TransformType` enum. There are two systems for handling transform: the deprecated vanilla system, constituted by `BakedModel#getTransforms`, `ItemTransforms`, and `ItemTransform`, and the Forge system, embodied by the method `IForgeBakedModel#applyTransform`. The vanilla code is patched to favor using `applyTransform` over the vanilla system whenever possible.

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

The vanilla way of handling transform is through `BakedModel#getTransforms`. This method returns an `ItemTransforms`, which is a simple object that contains various `ItemTransform`s as `public final` fields. An `ItemTransform` represents a rotation, a translation, and a scale to be applied to the model. The `ItemTransforms` is a container for these, holding one for each of the `TransformType`s except `NONE`. In the vanilla implementation, calling `#getTransform` for `NONE` results in the default transform, `ItemTransform#NO_TRANSFORM`.

The entire vanilla system for handling transforms is deprecated by Forge, and most implementations of `BakedModel` should simply `return ItemTransforms#NO_TRANSFORMS` (which is the default implementation) from `BakedModel#getTransforms`. Instead, they should implement `#applyTransform`.

The Forge Way
-------------

The Forge way of handling transforms is `#applyTransform`, a method patched into `BakedModel`. It supersedes the `#getTransforms` method.

#### `BakedModel#applyTransform`

Given a `TransformType`, `PoseStack`, and a boolean to determine whether to apply the transform for the left hand, this method produces an `BakedModel` to be rendered. Because the returned `BakedModel` can be a totally new model, this method is more flexible than the vanilla method (e.g. a piece of paper that looks flat in hand but crumpled on the ground).

[bakedmodel]: ./bakedmodel.md
