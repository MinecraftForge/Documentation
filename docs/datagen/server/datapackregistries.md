Datapack Registry Object Generation
==================================

Datapack registry objects can be generated for a mod by constructing a new `DatapackBuiltinEntriesProvider` and providing a `RegistrySetBuilder` with the new objects to register. The provider must be [added][datagen] to the `DataGenerator`.

!!! note
    `DatapackBuiltinEntriesProvider` is a Forge extension on top of `RegistriesDatapackGenerator` which properly handles referencing existing datapack registry objects without exploding the entry. So, this documentation will use `DatapackBuiltinEntriesProvider`.

```java
// On the MOD event bus
@SubscribeEvent
public void gatherData(GatherDataEvent event) {
    event.getGenerator().addProvider(
        // Tell generator to run only when server data are generating
        event.includeServer(),
        output -> new DatapackBuiltinEntriesProvider(
          output,
          event.getLookupProvider(),
          // The builder containing the datapack registry objects to generate
          new RegistrySetBuilder().add(/* ... */),
          // Set of mod ids to generate the datapack registry objects of
          Set.of(MOD_ID)
        )
    );
}
```

`RegistrySetBuilder`
--------------------

A `RegistrySetBuilder` is responsible for building all datapack registry objects to be used within the game. The builder can add a new entry for a registry, which can then register objects to that registry.

First, a new instance of a `RegistrySetBuilder` can be initialized by calling the constructor. Then, the `#add` method (which takes in the `ResourceKey` of the registry, a `RegistryBootstrap` consumer containing the `BootstapContext` to register the objects, and an optional `Lifecycle` argument to indicate the registry's current lifecycle status) can be called to handle a specific registry for registration.

```java
new RegistrySetBuilder()
  // Create configured features
  .add(Registries.CONFIGURED_FEATURE, bootstrap -> {
    // Register configured features here
  })
  // Create placed features
  .add(Registries.PLACED_FEATURE, bootstrap -> {
    // Register placed features here
  });
```

!!! note
    Datapack registries created through Forge can also generate their objects using this builder by also passing in the associated `ResourceKey`.

Registering with `BootstapContext`
----------------------------------

The `#register` method in the `BootstapContext` provided by the builder can be used to register objects. It takes in the `ResourceKey` representing the registry name of the object, the object to register, and an optional `Lifecycle` argument to indicate the registry object's current lifecycle status. 

```java
public static final ResourceKey<ConfiguredFeature<?, ?>> EXAMPLE_CONFIGURED_FEATURE = ResourceKey.create(
  Registries.CONFIGURED_FEATURE,
  new ResourceLocation(MOD_ID, "example_configured_feature")
);

// In some constant location or argument
new RegistrySetBuilder()
  // Create configured features
  .add(Registries.CONFIGURED_FEATURE, bootstrap -> {
    // Register configured features here
    bootstrap.register(
      // The resource key for the configured feature
      EXAMPLE_CONFIGURED_FEATURE,
      new ConfiguredFeature<>(
        Feature.ORE, // Create an ore feature
        new OreConfiguration(
          List.of(), // Does nothing
          8 // in veins of at most 8
        )
      )
    );
  })
  // Create placed features
  .add(Registries.PLACED_FEATURE, bootstrap -> {
    // Register placed features here
  });
```

### Datapack Registry Object Lookup

Sometimes datapack registry objects may want to use other datapack registry objects or tags containing datapack registry objects. In those cases, you can look up another datapack registry using `BootstapContext#lookup` to get a `HolderGetter`. From there, you can get a `Holder$Reference` to the datapack registry object or a `HolderSet$Named` for the tag via `#getOrThrow` by passing in the associated key.

```java
public static final ResourceKey<ConfiguredFeature<?, ?>> EXAMPLE_CONFIGURED_FEATURE = ResourceKey.create(
  Registries.CONFIGURED_FEATURE,
  new ResourceLocation(MOD_ID, "example_configured_feature")
);

public static final ResourceKey<PlacedFeature> EXAMPLE_PLACED_FEATURE = ResourceKey.create(
  Registries.PLACED_FEATURE,
  new ResourceLocation(MOD_ID, "example_placed_feature")
);

// In some constant location or argument
new RegistrySetBuilder()
  // Create configured features
  .add(Registries.CONFIGURED_FEATURE, bootstrap -> {
    // Register configured features here
    bootstrap.register(
      // The resource key for the configured feature
      EXAMPLE_CONFIGURED_FEATURE,
      new ConfiguredFeature(/* ... */)
    );
  })
  // Create placed features
  .add(Registries.PLACED_FEATURE, bootstrap -> {
    // Register placed features here

    // Get configured feature registry
    HolderGetter<ConfiguredFeature<?, ?>> configured = bootstrap.lookup(Registries.CONFIGURED_FEATURE);

    bootstrap.register(
      // The resource key for the placed feature
      EXAMPLE_PLACED_FEATURE,
      new PlacedFeature(
        configured.getOrThrow(EXAMPLE_CONFIGURED_FEATURE), // Get the configured feature
        List.of() // and do nothing to the placement location
      )
    )
  });
```

[datagen]: ../index.md#data-providers