Loot Table Generation
=====================

[Loot tables][loottable] can be generated for a mod by constructing a new `LootTableProvider` and providing `LootTableProvider$SubProviderEntry`s. The provider must be [added][datagen] to the `DataGenerator`.

```java
// On the MOD event bus
@SubscribeEvent
public void gatherData(GatherDataEvent event) {
    event.getGenerator().addProvider(
        // Tell generator to run only when server data are generating
        event.includeServer(),
        output -> new MyLootTableProvider(
          output,
          // Specify registry names of tables that are required to generate, or can leave empty
          Collections.emptySet(),
          // Sub providers which generate the loot
          List.of(subProvider1, subProvider2, /*...*/)
        )
    );
}
```

`LootTableSubProvider`
----------------------

Each `LootTableProvider$SubProviderEntry` takes in a supplied `LootTableSubProvider`, which generates the loot table, for a given `LootContextParamSet`. The `LootTableSubProvider` contains a method which takes in the writer (`BiConsumer<ResourceLocation, LootTable.Builder>`) to generate a table.

```java
public class ExampleSubProvider implements LootTableSubProvider {

  // Used to create a factory method for the wrapping Supplier
  public ExampleSubProvider() {}

  // The method used to generate the loot tables
  @Override
  public void generate(BiConsumer<ResourceLocation, LootTable.Builder> writer) {
    // Generate loot tables here by calling writer#accept
  }
}
```

The table can then be added to `LootTableProvider#getTables` for any available `LootContextParamSet`:

```java
// In the list passed into the LootTableProvider constructor
new LootTableProvider.SubProviderEntry(
  ExampleSubProvider::new,
  // Loot table generator for the 'empty' param set
  LootContextParamSets.EMPTY
)
```

### `BlockLootSubProvider` and `EntityLootSubProvider` Subclasses

For `LootContextParamSets#BLOCK` and `#ENTITY`, there are special types (`BlockLootSubProvider` and `EntityLootSubProvider` respectively) which provide additional helper methods for creating and validating that there are loot tables.

The `BlockLootSubProvider`'s constructor takes in a list of items, which are explosion resistant to determine whether the loot table can be generated if a block is exploded, and a `FeatureFlagSet`, which determines whether the block is enabled so that a loot table is generated for it.

```java
// In some BlockLootSubProvider subclass
public MyBlockLootSubProvider() {
  super(Collections.emptySet(), FeatureFlags.REGISTRY.allFlags());
}
```

The `EntityLootSubProvider`'s constructor takes in a `FeatureFlagSet`, which determines whether the entity type is enabled so that a loot table is generated for it.

```java
// In some EntityLootSubProvider subclass
public MyEntityLootSubProvider() {
  super(FeatureFlags.REGISTRY.allFlags());
}
```

To use them, all registered objects must be supplied to either `BlockLootSubProvider#getKnownBlocks` and `EntityLootSubProvider#getKnownEntityTypes` respectively. These methods are to make sure all objects within the iterable has a loot table.

!!! tip
    If `DeferredRegister` is being used to register a mod's objects, then the `#getKnown*` methods can be supplied the entries via `DeferredRegister#getEntries`:

    ```java
    // In some BlockLootSubProvider subclass for some DeferredRegister BLOCK_REGISTRAR
    @Override
    protected Iterable<Block> getKnownBlocks() {
      return BLOCK_REGISTRAR.getEntries() // Get all registered entries
        .stream() // Stream the wrapped objects
        .flatMap(RegistryObject::stream) // Get the object if available
        ::iterator; // Create the iterable
    }
    ```

The loot tables themselves can be added by implementing the `#generate` method.

```java
// In some BlockLootSubProvider subclass
@Override
public void generate() {
  // Add loot tables here
}
```

Loot Table Builders
-------------------

To generate loot tables, they are accepted by the `LootTableSubProvider` as a `LootTable$Builder`. Afterwards, the specified `LootContextParamSet` is set in the `LootTableProvider$SubProviderEntry` and then built via `#build`. Before being built, the builder can specify entries, conditions, and modifiers which affect how the loot table functions.

!!! note
    The functionality of loot tables is so expansive that it will not be covered by this documentation in its entirety. Instead, a brief description of each component will be mentioned. The specific subtypes of each component can be found using an IDE. Their implementations will be left as an exercise to the reader.

### LootTable

Loot tables are the base object and can be transformed into the required `LootTable$Builder` using `LootTable#lootTable`. The loot table can be built with a list of pools (via `#withPool`) applied in the order they are specified along with functions (via `#apply`) to modify the resulting items of those pools.

### LootPool

Loot pools represents a group to perform operations and can generate a  `LootPool$Builder` using `LootPool#lootPool`. Each loot pool can specify the entries (via `#add`) which define the operations in the pool, the conditions (via `#when`) which define if the operations in the pool should be performed, and functions (via `#apply`) to modify the resulting items of the entries. Each pool can be executed as many times as specified (via `#setRolls`). Additionally, bonus executions can be specified (via `#setBonusRolls`) which is modified by the luck of the executor.

### LootPoolEntryContainer

Loot entries define the operations to occur when selected, typically generating items. Each entry has an associated, [registered] `LootPoolEntryType`. They also have their own associated builders which subtype `LootPoolEntryContainer$Builder`. Multiple entries can execute at the same time (via `#append`) or sequentially until one fails (via `#then`). Additionally, entries can default to another entry on failure (via `#otherwise`).

### LootItemCondition

Loot conditions define requirements which need to be met for some operation to execute. Each condition has an associated, [registered] `LootItemConditionType`. They also have their own associated builders which subtype `LootItemCondition$Builder`. By default, all loot conditions specified must return true for an operation to execute. Loot conditions can also be specified such that only one must return true instead (via `#or`). Additionally, the resulting output of a condition can be inverted (via `#invert`).

### LootItemFunction

Loot functions modify the result of an execution before passing it to the output. Each function has an associated, [registered] `LootItemFunctionType`. They also have their own associated builders which subtype `LootItemFunction$Builder`.

#### NbtProvider

NBT providers are a special type of functions defined by `CopyNbtFunction`. They define where to pull tag information from. Each provider has an associated, [registered] `LootNbtProviderType`.

### NumberProvider

Number providers determine how many times a loot pool executes. Each provider has an associated, [registered] `LootNumberProviderType`.

#### ScoreboardNameProvider

Scoreboard providers are a special type of number providers defined by `ScoreboardValue`. They define the name of the scoreboard to pull the number of rolls to execute from. Each provider has an associated, [registered] `LootScoreProviderType`.

[loottable]: ../../resources/server/loottables.md
[datagen]: ../index.md#data-providers
[registered]: ../../concepts/registries.md#registries-that-arent-forge-registries
