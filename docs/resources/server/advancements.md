Advancements
============

Advancements are tasks that can be achieved by the player which may advance the progress of the game. Advancements can trigger based on any action the player may be directly involved in.

All advancement implementations within vanilla are data driven via JSON. This means that a mod is not necessary to create a new advancement, only a [data pack][datapack]. A full list on how to create and put these advancements within the mod's `resources` can be found on the [Minecraft Wiki][wiki]. Additionally, advancements can be [loaded conditionally and defaulted][conditional] depending on what information is present (mod loaded, item exists, etc.).

Advancement Criteria
--------------------

To unlock an advancement, the specified criteria must be met. Criteria are tracked through triggers which execute when a certain action is performed: killing an entity, changing an inventory, breading animals, etc. Any time an advancement is loaded into the game, the criteria defined are read and added as listeners to the trigger. Afterwards a trigger function is called (usually named `#trigger`) which checks all listeners as to whether the current state meets the conditions of the advancement criteria. The criteria listeners for the advancement are only removed once the advancement has been obtained by completing all requirements.

Requirements are defined as an array of string arrays representing the name of the criteria specified on the advancement. An advancement is completed once one string array of criteria has been met:

```js
// In some advancement JSON

// List of defined criteria to meet
"criteria": {
  "example_criterion1": { /*...*/ },
  "example_criterion2": { /*...*/ },
  "example_criterion3": { /*...*/ },
  "example_criterion4": { /*...*/ }
},

// This advancement is only unlocked once
// - Criteria 1 AND 2 have been met
// OR
// - Criteria 3 and 4 have been met
"requirements": [
  [
    "example_criterion1",
    "example_criterion2"
  ],
  [
    "example_criterion3",
    "example_criterion4"
  ]
]
```

A list of criteria triggers defined by vanilla can be found in `CriteriaTriggers`. Additionally, the JSON formats are defined on the [Minecraft Wiki][triggers].

### Custom Criteria Triggers

Custom criteria triggers can be created by implementing `SimpleCriterionTrigger` for the created `AbstractCriterionTriggerInstance` subclass.

### AbstractCriterionTriggerInstance Subclass

The `AbstractCriterionTriggerInstance` represents a single criteria defined in the `criteria` object. Trigger instances are responsible for holding the defined conditions, returning whether the inputs match the condition, and writing the instance to JSON for data generation.

Conditions are usually passed in through the constructor. The `AbstractCriterionTriggerInstance` super constructor requires the instance to define the registry name of the trigger and the conditions the player must meet as an `EntityPredicate$Composite`. The registry name of the trigger should be supplied to the super directly while the conditions of the player should be a constructor parameter.

```java
// Where ID is the registry name of the trigger
public ExampleTriggerInstance(EntityPredicate.Composite player, ItemPredicate item) {
  super(ID, player);
  // Store the item condition that must be met
}
```

!!! note
    Typically, trigger instances have a static constructor which allow these instances to be easily created for data generation. These static factory methods can also be statically imported instead of the class itself.

    ```java
    public static ExampleTriggerInstance instance(EntityPredicate.Builder playerBuilder, ItemPredicate.Builder itemBuilder) {
      return new ExampleTriggerInstance(EntityPredicate.Composite.wrap(playerBuilder.build()), itemBuilder.build());
    }
    ```

Additionally, the `#serializeToJson` method should be overridden. The method should add the conditions of the instance to the other JSON data.

```java
@Override
public JsonObject serializeToJson(SerializationContext context) {
  JsonObject obj = super.serializeToJson(context);
  // Write conditions to json
  return obj;
}
```

Finally, a method should be added which takes in the current data state and returns whether the user has met the necessary conditions. The conditions of the player are already checked through `SimpleCriterionTrigger#trigger(ServerPlayer, Predicate)`. Most trigger instances call this method `#matches`.

```java
// This method is unique for each instance and is as such not overridden
public boolean matches(ItemStack stack) {
  // Since ItemPredicate matches a stack, a stack is the input
  return this.item.matches(stack);
}
```

### SimpleCriterionTrigger

The `SimpleCriterionTrigger<T>` subclass, where `T` is the type of the trigger instance, is responsible for specifying the registry name of the trigger, creating a trigger instance, and a method to check trigger instances and run attached listeners on success.

The registry name of the trigger is supplied to `#getId`. This should match the registry name supplied to the trigger instance.

A trigger instance is created via `#createInstance`. This method reads a criteria from JSON.

```java
@Override
public ExampleTriggerInstance createInstance(JsonObject json, EntityPredicate.Composite player, DeserializationContext context) {
  // Read conditions from JSON: item
  return new ExampleTriggerInstance(player, item);
}
```

Finally, a method is defined to check all trigger instances and run the listeners if their condition is met. This method takes in the `ServerPlayer` and whatever other data defined by the matching method in the `AbstractCriterionTriggerInstance` subclass. This method should internally call `SimpleCriterionTrigger#trigger` to properly handle checking all listeners. Most trigger instances call this method `#trigger`.

```java
// This method is unique for each trigger and is as such not overridden
public void trigger(ServerPlayer player, ItemStack stack) {
  this.trigger(player,
    // The condition checker method within the AbstractCriterionTriggerInstance subclass
    triggerInstance -> triggerInstance.matches(stack)
  );
}
```

Afterwards, an instance should be registered using `CriteriaTriggers#register` during `FMLCommonSetupEvent`.

!!! important
    `CriteriaTriggers#register` must be enqueued to the synchronous work queue via `FMLCommonSetupEvent#enqueueWork` as the method is not thread-safe.

### Calling the Trigger

Whenever the action being checked is performed, the `#trigger` method defined by the `SimpleCriterionTrigger` subclass should be called.

```java
// In some piece of code where the action is being performed
// Where EXAMPLE_CRITERIA_TRIGGER is the custom criteria trigger
public void performExampleAction(ServerPlayer player, ItemStack stack) {
  // Run code to perform action
  EXAMPLE_CRITERIA_TRIGGER.trigger(player, stack);
}
```

Advancement Rewards
-------------------

When an advancement is completed, rewards may be given out. These can be a combination of experience points, loot tables, recipes for the recipe book, or a [function] executed as a creative player.

```js
// In some advancement JSON
"rewards": {
  "experience": 10,
  "loot": [
    "minecraft:example_loot_table",
    "minecraft:example_loot_table2"
    // ...
  ],
  "recipes": [
    "minecraft:example_recipe",
    "minecraft:example_recipe2"
    // ...
  ],
  "function": "minecraft:example_function"
}
```

[datapack]: https://minecraft.fandom.com/wiki/Data_pack
[wiki]: https://minecraft.fandom.com/wiki/Advancement/JSON_format
[conditional]: ./conditional.md#implementations
[function]: https://minecraft.fandom.com/wiki/Function_(Java_Edition)
[triggers]: https://minecraft.fandom.com/wiki/Advancement/JSON_format#List_of_triggers
