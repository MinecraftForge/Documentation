Loot Table Generation
=====================

[Loot tables][loottable] can be generated for a mod by subclassing `LootTableProvider` with a few modifications. After implementation, the provider must be [added][datagen] to the `DataGenerator`.

The `LootTableProvider` Subclass
--------------------------------

`LootTableProvider` is simplified into two methods: `#getTables`, which collect the table builders, and `#validate`, which checks whether the generated loot tables are valid. Both of these methods need to be overridden to use `LootTableProvider`.

`#validate` can be simplified to call `LootTables#validate` for every single table. It initially fails since it expects the tables defined within `BuiltInLootTables` to be generated as well.

```java
// In some LootTableProvider subclass
@Override
protected void validate(Map<ResourceLocation, LootTable> tables, ValidationContext ctx) {
  tables.forEach((name, table) -> LootTables.validate(ctx, name, table));
}
```

`#getTables` defines a list of factory methods for table builders for a given `LootContextParamSet`. Each table builder consumes a writer used to generate the given table for a specific name. To simplify understanding:

```java
// In some LootTableProvider subclass
@Override
protected
  List< // Get a list
    Pair< // of pairs
      Supplier< // for a factory
        Consumer< // which takes in
          BiConsumer< // a writer of
            ResourceLocation, // the name of the table
            LootTable.Builder // and the table to generate
          >
        >
      >,
      LootContextParamSet // with a given parameter set
    >
  >
getTables() {
  // Return table builders here
}
```

Table Builders
--------------

Each table builder has a method which takes in the writer to generate a table. This is typically done implementing a `Consumer<BiConsumer<ResourceLocation, LootTable.Builder>>`.

```java
public class ExampleLoot implements Consumer<BiConsumer<ResourceLocation, LootTable.Builder>> {

  // Used to create a factory method for the wrapping Supplier
  public ExampleLoot() {}

  // The method used to generate the loot tables
  @Override
  public void accept(BiConsumer<ResourceLocation, LootTable.Builder> writer) {
    // Generate loot tables here by calling writer#accept
  }
}
```

The table can then be added to `LootTableProvider#getTables` for any available `LootContextParamSet`:

```java
// In some LootTableProvider subclass
@Override
protected List<Pair<Supplier<Consumer<BiConsumer<ResourceLocation, LootTable.Builder>>>, LootContextParamSet>> getTables() {
  return ImmutableList.of(
    Pair.of(ExampleLoot::new, LootContextParamSets.EMPTY) // Loot table builder for the 'empty' parameter set
    //...
  );
}
```

### `BlockLoot` and `EntityLoot` Subclasses

For `LootContextParamSets#BLOCK` and `#ENTITY`, there are special types (`BlockLoot` and `EntityLoot` respectively) which provide additional helper methods for creating and validating that there are loot tables.

To use them, all registered objects must be supplied to either `BlockLoot#getKnownBlocks` and `EntityLoot#getKnownEntities` respectively. These methods are to make sure all objects within the iterable has a loot table.

!!! tip
    If `DeferredRegister` is being used to register a mod's objects, then the `#getKnown*` methods can be supplied the entries via `DeferredRegister#getEntities`:

    ```java
    // In some BlockLoot subclass for some DeferredRegister BLOCK_REGISTRAR
    @Override
    protected Iterable<Block> getKnownBlocks() {
      return BLOCK_REGISTRAR.getEntries() // Get all registered entries
        .stream() // Stream the wrapped objects
        .flatMap(RegistryObject::stream) // Get the object if available
        ::iterator; // Create the iterable
    }
    ```

Loot Table Builders
-------------------

To generate loot tables, they are accepted by the `LootTableProvider` as a `LootTable$Builder`. Afterwards, the specified `LootContextParamSet` is set and then built via `#build`. Before being built, the builder can specify entries, conditions, and modifiers which affect how the loot table functions.

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
