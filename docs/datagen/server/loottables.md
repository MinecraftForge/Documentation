Loot Table Generation
=====================

Loot tables can be generated for a mod by subclassing `LootTableProvider` with a few modifications. After implementation, the provider must be [added][datagen] to the `DataGenerator`.

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

`#getTables` defines a list of factory methods for table builders for a given `LootContextParamSet`. Each table builder consumes a writer used to generate the given table for a specific name. To simply understanding:

```java
// In some LootTableProvider subclass
@Override
protected
  List< // Create a list
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
  // Return tables builders here
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

### `BlockLoot` and `EntityLoot` Subclasses

# TODO

Loot Table Builders
-------------------

# TODO

[datagen]: ../index.md#data-providers
