Registries
==========

Registration is the process of taking the objects of a mod (such as items, blocks, sounds, etc.) and making them known to the game. Registering things is important, as without registration the game will simply not know about these objects, which will cause unexplainable behaviors and crashes. 

Most things that require registration in the game are handled by the Forge registries. A registry is an object similar to a map that assigns values to keys. Forge uses registries with [`ResourceLocation`][ResourceLocation] keys to register objects. This allows the `ResourceLocation` to act as the "registry name" for objects.

Every type of registrable object has its own registry. To see all registries wrapped by Forge, see the `ForgeRegistries` class. All registry names within a registry must be unique. However, names in different registries will not collide. For example, there's a `Block` registry, and an `Item` registry. A `Block` and an `Item` may be registered with the same name `example:thing` without colliding; however, if two different `Block`s or `Item`s were registered with the same exact name, the second object will override the first.

Methods for Registering
------------------

There are two proper ways to register objects: the `DeferredRegister` class, and the `RegisterEvent` lifecycle event.

### DeferredRegister

`DeferredRegister` is the recommended way to register objects. It allows the use and convenience of static initializers while avoiding the issues associated with it. It simply maintains a list of suppliers for entries and registers the objects from those suppliers during `RegisterEvent`.

An example of a mod registering a custom block:

```java
private static final DeferredRegister<Block> BLOCKS = DeferredRegister.create(ForgeRegistries.BLOCKS, MODID);

public static final RegistryObject<Block> ROCK_BLOCK = BLOCKS.register("rock", () -> new Block(BlockBehaviour.Properties.of(Material.STONE)));

public ExampleMod() {
  BLOCKS.register(FMLJavaModLoadingContext.get().getModEventBus());
}
```

### `RegisterEvent`

`RegisterEvent` is the second way to register objects. This [event] is fired for each registry after the mod constructors and before the loading of configs. Objects are registered using `#register` by passing in the registry key, the name of the registry object, and the object itself. There is an additional `#register` overload which takes in a consumed helper to register an object with a given name. It is recommended to use this method to avoid unnecessary object creation.

Here is an example: (the event handler is registered on the *mod event bus*)

```java
@SubscribeEvent
public void register(RegisterEvent event) {
  event.register(ForgeRegistries.Keys.BLOCKS,
    helper -> {
      helper.register(new ResourceLocation(MODID, "example_block_1"), new Block(...));
      helper.register(new ResourceLocation(MODID, "example_block_2"), new Block(...));
      helper.register(new ResourceLocation(MODID, "example_block_3"), new Block(...));
      // ...
    }
  );
}
```

### Registries that aren't Forge Registries

Not all registries are wrapped by Forge. These can be static registries, like `LootItemConditionType`, which are safe to use. There are also dynamic registries, like `ConfiguredFeature` and some other worldgen registries, which are typically represented in JSON. `DeferredRegister#create` has an overload which allows modders to specify the registry key of which vanilla registry to create a `RegistryObject` for. The registry method and attaching to the mod event bus is the same as other `DeferredRegister`s.

!!! important
    Dynamic registry objects can **only** be registered through data files (e.g. JSON). They **cannot** be registered in-code.

```java
private static final DeferredRegister<LootItemConditionType> REGISTER = DeferredRegister.create(Registries.LOOT_CONDITION_TYPE, "examplemod");

public static final RegistryObject<LootItemConditionType> EXAMPLE_LOOT_ITEM_CONDITION_TYPE = REGISTER.register("example_loot_item_condition_type", () -> new LootItemConditionType(...));
```

!!! note
    Some classes cannot by themselves be registered. Instead, `*Type` classes are registered, and used in the formers' constructors. For example, [`BlockEntity`][blockentity] has `BlockEntityType`, and `Entity` has `EntityType`. These `*Type` classes are factories that simply create the containing type on demand. 
    
    These factories are created through the use of their `*Type$Builder` classes. An example: (`REGISTER` refers to a `DeferredRegister<BlockEntityType>`)
    ```java
    public static final RegistryObject<BlockEntityType<ExampleBlockEntity>> EXAMPLE_BLOCK_ENTITY = REGISTER.register(
      "example_block_entity", () -> BlockEntityType.Builder.of(ExampleBlockEntity::new, EXAMPLE_BLOCK.get()).build(null)
    );
    ```

Referencing Registered Objects
------------------------------

Registered objects should not be stored in fields when they are created and registered. They are to be always newly created and registered whenever `RegisterEvent` is fired for that registry. This is to allow dynamic loading and unloading of mods in a future version of Forge.

Registered objects must always be referenced through a `RegistryObject` or a field with `@ObjectHolder`.

### Using RegistryObjects

`RegistryObject`s can be used to retrieve references to registered objects once they are available. These are used by `DeferredRegister` to return a reference to the registered objects. Their references are updated after `RegisterEvent` is called for their registry, along with the `@ObjectHolder` annotations.

To get a `RegistryObject`, call `RegistryObject#create` with a `ResourceLocation` and the `IForgeRegistry` of the registrable object. Custom registries can also be used by supplying the registry name instead. Store the `RegistryObject` in a `public static final` field, and call `#get` whenever you need the registered object.

An example of using `RegistryObject`:

```java
public static final RegistryObject<Item> BOW = RegistryObject.create(new ResourceLocation("minecraft:bow"), ForgeRegistries.ITEMS);

// assume that 'neomagicae:mana_type' is a valid registry, and 'neomagicae:coffeinum' is a valid object within that registry
public static final RegistryObject<ManaType> COFFEINUM = RegistryObject.create(new ResourceLocation("neomagicae", "coffeinum"), new ResourceLocation("neomagicae", "mana_type"), "neomagicae"); 
```

### Using @ObjectHolder

Registered objects from registries can be injected into the `public static` fields by annotating classes or fields with `@ObjectHolder` and supplying enough information to construct a `ResourceLocation` to identify a specific object in a specific registry.

The rules for `@ObjectHolder` are as follows:

* If the class is annotated with `@ObjectHolder`, its value will be the default namespace for all fields within if not explicitly defined
* If the class is annotated with `@Mod`, the modid will be the default namespace for all annotated fields within if not explicitly defined
* A field is considered for injection if:
  * it has at least the modifiers `public static`;
  * the **field** is annotated with `@ObjectHolder`, and:
    * the name value is explicitly defined; and
    * the registry name value is explicitly defined
  * _A compile-time exception is thrown if a field does not have a corresponding registry or name._
* _An exception is thrown if the resulting `ResourceLocation` is incomplete or invalid (non-valid characters in path)_
* If no other errors or exceptions occur, the field will be injected
* If all of the above rules do not apply, no action will be taken (and a message may be logged)

`@ObjectHolder`-annotated fields are injected with their values after `RegisterEvent` is fired for their registry, along with the `RegistryObject`s.

!!! note
    If the object does not exist in the registry when it is to be injected, a debug message will be logged and no value will be injected.

As these rules are rather complicated, here are some examples:

```java
class Holder {
  @ObjectHolder(registryName = "minecraft:enchantment", value = "minecraft:flame")
  public static final Enchantment flame = null;     // Annotation present. [public static] is required. [final] is optional.
                                                    // Registry name is explicitly defined: "minecraft:enchantment"
                                                    // Resource location is explicitly defined: "minecraft:flame"
                                                    // To inject: "minecraft:flame" from the [Enchantment] registry

  public static final Biome ice_flat = null;        // No annotation on the field.
                                                    // Therefore, the field is ignored.

  @ObjectHolder("minecraft:creeper")
  public static Entity creeper = null;              // Annotation present. [public static] is required.
                                                    // The registry has not been specified on the field.
                                                    // Therefore, THIS WILL PRODUCE A COMPILE-TIME EXCEPTION.

  @ObjectHolder(registryName = "potion")
  public static final Potion levitation = null;     // Annotation present. [public static] is required. [final] is optional.
                                                    // Registry name is explicitly defined: "minecraft:potion"
                                                    // Resource location is not specified on the field
                                                    // Therefore, THIS WILL PRODUCE A COMPILE-TIME EXCEPTION.
}
```

Creating Custom Forge Registries
--------------------------------

Custom registries can usually just be a simple map of key to value. This is a common style; however, it forces a hard dependency on the registry being present. It also requires that any data that needs to be synced between sides must be done manually. Custom Forge Registries provide a simple alternative for creating soft dependents along with better management and automatic syncing between sides (unless told otherwise). Since the objects also use a Forge registry, registration becomes standardized in the same way.

Custom Forge Registries are created with the help of a `RegistryBuilder`, through either `NewRegistryEvent` or the `DeferredRegister`. The `RegistryBuilder` class takes various parameters (such as the registry's name, id range, and various callbacks for different events happening on the registry). New registries are registered to the `RegistryManager` after `NewRegistryEvent` finishes firing.

Any newly created registry should use its associated [registration method][registration] to register the associated objects.

### Using NewRegistryEvent

When using `NewRegistryEvent`, calling `#create` with a `RegistryBuilder` will return a supplier-wrapped registry. The supplied registry can be accessed after `NewRegistryEvent` has finished posting to the mod event bus. Getting the custom registry from the supplier before `NewRegistryEvent` finishes firing will result in a `null` value.

### With DeferredRegister

The `DeferredRegister` method is once again another wrapper around the above event. Once a `DeferredRegister` is created in a constant field using the `#create` overload which takes in the registry name and the mod id, the registry can be constructed via `DeferredRegister#makeRegistry`. This takes in  a supplied `RegistryBuilder` containing any additional configurations. The method already populates `#setName` by default. Since this method can be returned at any time, a supplied version of an `IForgeRegistry` is returned instead. Getting the custom registry from the supplier before `NewRegistryEvent` is fired will result in a `null` value.

!!! important
    `DeferredRegister#makeRegistry` must be called before the `DeferredRegister` is added to the mod event bus via `#register`. `#makeRegistry` also uses the `#register` method to create the registry during `NewRegistryEvent`.

Handling Missing Entries
------------------------

There are cases where certain registry objects will cease to exist whenever a mod is updated or, more likely, removed. It is possible to specify actions to handle the missing mapping through the third of the registry events: `MissingMappingsEvent`. Within this event, a list of missing mappings can be obtained either by `#getMappings` given a registry key and mod id or all mappings via `#getAllMappings` given a registry key.

!!! important
    `MissingMappingsEvent` is fired on the **Forge** event bus.

For each `Mapping`, one of four mapping types can be selected to handle the missing entry:

| Action | Description |
| :---:  |     :---    |
| IGNORE | Ignores the missing entry and abandons the mapping. |
|  WARN  | Generates a warning in the log. |
|  FAIL  | Prevents the world from loading. |
| REMAP  | Remaps the entry to an already registered, non-null object. |

If no action is specified, then the default action will occur by notifying the user about the missing entry and whether they still would like to load the world. All actions besides remapping will prevent any other registry object from taking the place of the existing id in case the associated entry ever gets added back into the game.

[ResourceLocation]: ./resources.md#resourcelocation
[registration]: #methods-for-registering
[event]: ./events.md
[blockentity]: ../blockentities/index.md
