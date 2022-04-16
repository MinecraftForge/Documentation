Conditionally-Loaded Data
=========================

There are times when modders may want to include data-driven objects using information from another mod without having to explicitly make that mod a dependency. Other cases may be to swap out certain objects with other modded entries when they are present. This can be done through the conditional subsystem.

Implementations
---------------

Currently, conditional loading is implemented for recipes and advancements. For any conditional recipe or advancement, a list of conditions to datum pair is loaded. If the conditions specified for a datum in the list is true, then that datum is returned. Otherwise, the datum is discarded.

```js
{
  // The type needs to be specified for recipes as they can have custom serializers
  // Advancements do not need this type
  "type": "forge:conditional",
  
  "recipes": [ // Or 'advancements' for Advancements
    {
      // The conditions to check
      "conditions": [
        // Conditions in the list are ANDed together
        {
          // Condition 1
        },
        {
          // Condition 2
        }
      ],
      "recipe": { // Or 'advancement' for Advancements
        // The recipe to use if all conditions succeed
      }
    },
    {
      // Next condition to check if the previous fails
    },
  ]
}
```

Conditionally-loaded data additionally have wrappers for [data generation][datagen] through `ConditionalRecipe$Builder` and `ConditionalAdvancement$Builder`.

Conditions
----------

Conditions are specified by setting `type` to the name of the condition as specified by [`IConditionSerializer#getID`][serializer].

### True and False

Boolean conditions consist of no data and return the expected value of the condition. They are represented by `forge:true` and `forge:false`.

```js
// For some condition
{
  // Will always return true (or false for 'forge:false')
  "type": "forge:true"
}
```

### Not, And, and Or

Boolean operator conditions consist of the condition(s) being operated upon and apply the following logic. They are represented by `forge:not`, `forge:and`, and `forge:or`.


```js
// For some condition
{
  // Inverts the result of the stored condition
  "type": "forge:not",
  "value": {
    // A condition
  }
}
```

```js
// For some condition
{
  // ANDs the stored conditions together (or ORs for 'forge:or')
  "type": "forge:and",
  "values": [
    {
      // First condition
    },
    {
      // Second condition to be ANDed (or ORed for 'forge:or')
    }
  ]
}
```

### Mod Loaded

`ModLoadedCondition` returns true whenever the specified mod with the given id is loaded in the current application. This is represented by `forge:mod_loaded`.

```js
// For some condition
{
  "type": "forge:mod_loaded",
   // Returns true if 'examplemod' is loaded
  "modid": "examplemod"
}
```

### Item Exists

`ItemExistsCondition` returns true whenever the given item has been registered in the current application. This is represented by `forge:item_exists`.

```js
// For some condition
{
  "type": "forge:item_exists",
   // Returns true if 'examplemod:example_item' has been registered
  "item": "examplemod:example_item"
}
```

### Tag Empty

`TagEmptyCondition` returns true whenever the given item tag has no items within it. This is represented by `forge:tag_empty`.

```js
// For some condition
{
  "type": "forge:tag_empty",
   // Returns true if 'examplemod:example_tag' is an item tag with no entries
  "tag": "examplemod:example_tag"
}
```

Creating Custom Conditions
--------------------------

Custom conditions can be created by implementing `ICondition` and its associated `IConditionSerializer`.

### ICondition

Any condition only need to implement two methods:

Method | Description
:---:  | :---
getID  | The registry name of the condition. Must be equivalent to [`IConditionSerializer#getID`][serializer]. Used only for [data generation][datagen].
test   | Returns true if the condition has been satisfied.

!!! note
    Every `#test` has access to some `IContext` representing the state of the game. Currently, only tags can be obtained from a registry.

### IConditionSerializer

Serializers need to implement three methods:

Method | Description
:---:  | :---
getID  | The registry name of the condition. Must be equivalent to [`ICondition#getID`][condition].
read   | Reads the condition data from JSON.
write  | Writes the given condition data to JSON.

!!! note
    Condition serializers are not responsible for writing or reading the type of the serializer, similar to other serializer implementations in Minecraft.

Afterwards, a static instance should be declared to hold the initialized serializer and then registered using `CraftingHelper#register` either during the `RegistryEvent$Register` for `RecipeSerializer`s or during `FMLCommonSetupEvent`.

```java
// In some serializer class
public static final ExampleConditionSerializer INSTANCE = new ExampleConditionSerializer();

// In some handler class
public void registerSerializers(RegistryEvent.Register<RecipeSerializer<?>> event) {
  CraftingHelper.register(INSTANCE);
}
```

!!! important
    If using `FMLCommonSetupEvent` to register a condition serializer, it must be enqueued to the synchronous work queue via `FMLCommonSetupEvent#enqueueWork` as `CraftingHelper#register` is not thread-safe.

[datagen]: ../../datagen/server/recipes.md
[serializer]: #iconditionserializer
[condition]: #icondition
