Perspective
===========

When an [`IBakedModel`][IBakedModel] is being rendered as an item, it can apply special handling depending on which perspective it is being rendered in. "Perspective" means in what context the model is being rendered. The possible perspectives are represented in code by the `ItemCameraTransforms$TransformType` enum. There are two systems for handling perspective: the deprecated vanilla system, constituted by `IBakedModel#getTransforms`, `ItemCameraTransforms`, and `ItemTransformVec3f`, and the Forge system, embodied by the method `IForgeBakedModel#handlePerspective`. The vanilla code is patched to favor using `handlePerspective` over the vanilla system whenever possible.

`TransformType`
---------------

`NONE` - Unused.

`THIRD_PERSON_LEFT_HAND`/`THIRD_PERSON_RIGHT_HAND`/`FIRST_PERSON_LEFT_HAND`/`FIRST_PERSON_RIGHT_HAND` - The first person values represent when the player is holding the item in their own hand. The third person values represent when another player is holding the item and the client is looking at them in the 3rd person. Hands are self-explanatory.

`HEAD` - Represents when any player is wearing the item in the helmet slot (e.g. pumpkins).

`GUI` - Represents when the item is being rendered in a GUI.

`GROUND` - Represents when the item is being rendered in the world as an `EntityItem`.

`FIXED` - Used for item frames.

The Vanilla Way
---------------

The vanilla way of handling perspective is through `IBakedModel#getTransforms`. This method returns an `ItemCameraTransforms`, which is a simple object that contains various `ItemTransformVec3f`s as `public final` fields. An `ItemTransformVec3f` represents a rotation, a translation, and a scale to be applied to the model. The `ItemCameraTransforms` is a container for these, holding one for each of the `TransformType`s except `NONE`. In the vanilla implementation, calling `#getTransform` for `NONE` results in the default transform, `ItemTransformVec3f#NO_TRANSFORM`.

The entire vanilla system for handling transforms is deprecated by Forge, and most implementations of `IBakedModel` should simply `return ItemCameraTransforms#NO_TRANSFORMS` (which is the default implementation) from `IBakedModel#getTransforms`. Instead, they should implement `#handlePerspective`.

The Forge Way
-------------

The Forge way of handling transforms is `#handlePerspective`, a method patched into `IBakedModel`. It supersedes the `##getTransforms` method. Additionally, the class `PerspectiveMapWrapper` is a simple implementation of an `IBakedModel` with the method; it is a wrapper around other `IBakedModel`s, augmenting them with a `Map<TransformType, TransformationMatrix>` to handle perspective.

#### `IBakedModel#handlePerspective`

Given a `TransformType` and `MatrixStack`, this method produces an `IBakedModel` to be rendered. Because the returned `IBakedModel` can be a totally new model, this method is more flexible than the vanilla method (e.g. a piece of paper that looks flat in hand but crumpled on the ground).

### `PerspectiveMapWrapper`

A wrapper around other `IBakedModel`s, this class delegates to the wrapped model for all `IBakedModel` methods except `#handlePerspective`, and utilizes a simple `Map<TransformType, TransformationMatrix>` for `#handlePerspective`. However, the more interesting parts of this class are the static helper methods.

#### `getTransforms` and `getTransformsWithFallback`

Given an `ItemCameraTransforms` or an `IModelTransform`, this method will extract an `ImmutableMap<TransformType, TransformationMatrix>` from it. To extract this information from an `IModelTransform`, each `TransformType` is passed to `#getPartTransformation`.

This is how models should support custom perspective transforms through `IModelTransform`. `IUnbakedModel`s should pass the `IModelTransform` in `#bake`. Then the `IBakedModel` can use these custom transforms in `#handlePerspective`, composing them on top of its own.

#### `handlePerspective`

Given either a map of transforms or an `IModelTransform`, an `IBakedModel`, a `TransformType`, and a `MatrixStack`, this finds the `IBakedModel` for the transform from the map or the `IModelTransform`, and then pairs it with the given model. To extract the transform from an `IModelTransform`, the `TransformType` is passed to `#getPartTransformation`. This method is meant to be a simple implementation of `IBakedModel#handlePerspective`.

[IBakedModel]: ibakedmodel.md
