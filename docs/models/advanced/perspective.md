Perspective
===========

When an [`IBakedModel`][IBakedModel] is being rendered as an item, it can apply special handling depending on which perspective it is being rendered in. "Perspective" means in what context the model is being rendered. The possible perspectives are represented in code by the `ItemCameraTransforms.TransformType` enum. There are two systems for handling perspective: the deprecated vanilla system, constituted by `IBakedModel::getItemCameraTransforms`, `ItemCameraTranforms`, and `ItemTransformVec3f`, and the Forge system, embodied by the method `IBakedModel::handlePerspective`. The vanilla code is patched to favor using `handlePerspective` over the vanilla system whenever possible.

`TransformType`
---------------

`NONE` - Unused.

`THIRD_PERSON_LEFT_HAND`/`THIRD_PERSON_RIGHT_HAND`/`FIRST_PERSON_LEFT_HAND`/`FIRST_PERSON_RIGHT_HAND` - The first person values represent when the player is holding the item in their own hand. The third person values represent when another player is holding the item and the client is looking at them in the 3rd person. Hands are self-explanatory.

`HEAD` - Represents when any player is wearing the item in the helmet slot (e.g. pumpkins).

`GUI` - Represents when the item is being rendered in a GUI.

`GROUND` - Represents when the item is being rendered in the world as an `EntityItem`.

`FIXED` - Used for item frames.

This enum is also patched to implement [`IModelPart`][IModelState]. This allows `IModelState`s to alter the perspective handling of models. However, the model itself must implement this behavior. (See [below][state perspective].)

The Vanilla Way
---------------

The vanilla way of handling perspective is through `IBakedModel::getItemCameraTransforms`. This method returns an `ItemCameraTransforms`, which is a simple object that contains various `ItemTransformVec3f`s as `public final` fields. An `ItemTransformVec3f` represents a rotation, a translation, and a scale to be applied to the model. The `ItemCameraTransforms` is a container for these, holding one for each of the `TransformType`s, sans `NONE`. In the vanilla implementation, calling `getTransform` for `NONE` results in the default transform, `ItemTransformVec3f.DEFAULT`.

The entire vanilla system for handling transforms is deprecated by Forge, and most implementations of `IBakedModel` should simply `return ItemCameraTransforms.DEFAULT` (which is the default implementation) from `IBakedModel::getItemCameraTransforms`. Instead, they should implement `handlePerspective`.

The Forge Way
-------------

The Forge way of handling transforms is `handlePerspective`, a method patched into `IBakedModel`. It supersedes the `getItemCameraTransforms` method. Additionally, the class `PerspectiveMapWrapper` is a simple implementation of an `IBakedModel` with the method; it is a wrapper around other `IBakedModel`s, augmenting them with a `Map<TransformType, TRSRTransformation>` to handle perspective.

#### `IBakedModel::handlePerspective`

Given a `TransformType`, this method produces an `IBakedModel` and `Matrix4f`. The model is what will be rendered, and the (nullable) matrix is the transform to use. Because the returned `IBakedModel` can be a totally new model, this method is more flexible than the vanilla method (e.g. a piece of paper that looks flat in hand but crumpled on the ground).

### `PerspectiveMapWrapper`

A wrapper around other `IBakedModel`s, this class delegates to the wrapped model for all `IBakedModel` methods except `handlePerspective`, and utilizes a simple `Map<TransformType, TRSRTransformation>` for `handlePerspective`. However, the more interesting parts of this class are the static helper methods.

#### `getTransforms`

Given an `ItemCameraTransforms` or an `IModelState`, this method will extract an `ImmutableMap<TransformType, TRSRTransformation>` from it. To extract this information from an `IModelState`, each `TransformType` is passed to `apply`.

This is how models should support custom perspective transforms through `IModelState`. `IModel`s should use `getTransforms` in `bake` and store the passed in perspective transforms in the `IBakedModel`. Then the `IBakedModel` can use these custom transforms in `handlePerspective`, composing them on top of its own.

#### `handlePerspective`

Given either a map of transforms or an `IModelState`, an `IBakedModel`, and a `TransformType`, this finds the `Matrix4f` for the transform from the map or the `IModelState`, and then pairs it with the given model. To extract the transform from an `IModelState`, the `TransformType` is passed to `apply`. This method is meant to be a simple implementation of `IBakedModel::handlePerspective`.

[state perspective]: #gettransforms
[IBakedModel]: ibakedmodel.md
[IModelState]: imodelstate+part.md
