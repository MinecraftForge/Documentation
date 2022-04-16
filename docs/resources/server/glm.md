Global Loot Modifiers
===========

Global Loot Modifiers are a data-driven method of handling modification of harvested drops without the need to overwrite dozens to hundreds of vanilla loot tables or to handle effects that would require interactions with another mod's loot tables without knowing what mods may be loaded. Global Loot Modifiers are also stacking, rather than last-load-wins, similar to tags.

Registering a Global Loot Modifier
-------------------------------

You will need 4 things:

1. Create a `global_loot_modifiers.json`.
    * This will tell Forge about your modifiers and works similar to [tags].
2. A serialized json representing your modifier.
    * This will contain all of the data about your modification and allows data packs to tweak your effect.
3. A class that extends `IGlobalLootModifier`.
    * The operational code that makes your modifier work. Most modders can extend `LootModifier` as it supplies base functionality.
4. Finally, a class that extends `GlobalLootModifierSerializer` for your operational class.
    * This is [registered] as any other `IForgeRegistryEntry`.

The `global_loot_modifiers.json`
-------------------------------

The `global_loot_modifiers.json` represents all loot modifiers to be loaded into the game. This file **MUST** be placed within `data/forge/loot_modifiers/global_loot_modifiers.json`.

!!! important
    `global_loot_modifiers.json` will only be read in the `forge` namespace. The file will be neglected if it is under the mod's namespace.

`entries` is an *ordered list* of the modifiers that will be loaded. The [ResourceLocation][resloc]s specified points to their associated entry within `data/<namespace>/loot_modifiers/<path>.json`. This is primarily relevant to data pack makers for resolving conflicts between modifiers from separate mods.

`replace`, when `true`, changes the behavior from appending loot modifiers to the global list to replacing the global list entries entirely. Modders will want to use `false` for compatibility with other mod implementations. Datapack makers may want to specify their overrides with `true`.

```js
{
  "replace": false, // Must be present
  "entries": [
    // Represents a loot modifier in 'data/examplemod/loot_modifiers/example_glm.json'
    "examplemod:example_glm",
    "examplemod:example_glm2"
    // ...
  ]
}
```

The Serialized JSON
-------------------------------

This file contains all of the potential variables related to your modifier, including the conditions that must be met prior to modifying any loot. Avoid hard-coded values wherever possible so that data pack makers can adjust balance if they wish to.

`type` represents the registry name of the [`GlobalLootModifierSerializer`][serializer] used to read the associated JSON file. This must always be present.

`conditions` should represent the loot table conditions for this modifier to activate. Conditions should avoid being hardcoded to allow datapack creators as much flexibility to adjust the criteria. This must also be always present.

!!! important
    Although `conditions` should represent what is needed for the modifier to activate, this is only the case if using the bundled Forge classes. If using `LootModifier` as a subclass, all conditions will be **ANDed** together and checked to see if the modifier should be applied.

Any additional properties read by the serializer and defined by the modifier can also be specified.

```js
// Within data/examplemod/loot_modifiers/example_glm.json
{
  "type": "examplemod:example_loot_modifier",
  "conditions": [
    // Normal loot table conditions
    // ...
  ],
  "prop1": "val1",
  "prop2": 10,
  "prop3": "minecraft:dirt"
}
```

`IGlobalLootModifier`
---------------------

To supply the functionality a global loot modifier specifies, a `IGlobalLootModifier` implementation must be specified. These are instances generated each time a serializer decodes the information from JSON and supplies it into this object.

There is only one method that needs to be defined in order to create a new modifier: `#apply`. This takes in the current loot that will be generated along with the context information such as the currently level or additional defined parameters. It returns the list of drops to generate.

!!! note
    The returned list of drops from any one modifier is fed into other modifiers in the order they are registered. As such, modified loot can be modified by another loot modifier.

### The `LootModifier` Subclass

`LootModifier` is an abstract implementation of `IGlobalLootModifier` to provide the base functionality which most modders can easily extend and implement. This expands upon the existing interface by defining the `#apply` method to check the conditions to determine whether or not to modify the generated loot.

There are two things of note within the subclass implementation: the constructor which must take in an array of `LootItemCondition`s and the `#doApply` method.

The array of `LootItemCondition`s define the list of conditions that must be true before the loot can be modified. The supplied conditions are **ANDed** together, meaning that all conditions must be true.

The `#doApply` method works the same as the `#apply` method except that it only executes once all conditions return true.

```java
public class ExampleModifier extends LootModifier {

  public ExampleModifier(LootItemCondition[] conditionsIn, String prop1, int prop2, Item prop3) {
    super(conditionsIn);
    // Store the rest of the parameters
  }

  @Nonnull
  @Override
  protected List<ItemStack> doApply(List<ItemStack> generatedLoot, LootContext context) {
    // Modify the loot and return the new drops
  }
}
```

`GlobalLootModifierSerializer`
------------------------------

The connector between the JSON and the `IGlobalLootModifier` instance is the `GlobalLootModifierSerializer<T>` implementation, where `T` represents the type of the `IGlobalLootModifier` to use.

Two methods must be defined within the serializer implementation: `#read` and `#write`.

`#read` takes in the registry name of the JSON, the serialized `JsonObject`, and the array of conditions that, by most implementations, must be true to allow the loot modifier to execute. The only data that should be deserialized from the `JsonObject` are the custom properties specified for use by the implemented loot modifier. If no custom properties are needed, then no data should be deserialized from the `JsonObject` as the conditions are supplied as a parameter.

`#write` is responsible for turning the defined loot modifier and writing it to a `JsonObject`. This requires that all conditions along with any custom properties must be written. For ease of convenience, `#makeConditions` can be called to create a new `JsonObject` with the conditions already serialized within. Any additional properties to be serialized can then be added to this `JsonObject`. This is utilized for [data generation][datagen] of the associated loot modifier.

```java
public ExampleModifierSerializer extends GlobalLootModifierSerializer<ExampleModifier> {

  @Override
  public ExampleModifier read(ResourceLocation location, JsonObject object, LootItemCondition[] conditions) {
    String prop1 = GsonHelper.getAsString(object, "prop1");
    // Deserializer other properties
    return new ExampleModifier(conditions, prop1, prop2, prop3);
  }

  @Override
  public JsonObject write(ExampleModifier instance) {
    // Create json object with conditions in modifier
    JsonObject res = this.makeConditions(instance.conditionsIn);
    res.addProperty("prop1", instance.prop1);
    // Add other properties in modifier
    return res;
  }
}

```

[Examples][examples] can be found on the Forge Git repository, including silk touch and smelting effects.

[tags]: ./tags.md
[resloc]: ../../concepts/resources.md#ResourceLocation
[serializer]: #globallootmodifierserializer
[registered]: ../../concepts/registries.md#methods-for-registering
[datagen]: ../../datagen/server/glm.md
[examples]: https://github.com/MinecraftForge/MinecraftForge/blob/1.18.x/src/test/java/net/minecraftforge/debug/gameplay/loot/GlobalLootModifiersTest.java
