Registries
==========

Registration is the process of taking the objects of a mod (such as items, blocks, sounds, etc.) and making them known to the game. Registering things is important, as without registration the game will simply not know about these objects, which will cause unexplainable behaviors and crashes. 

Most things that require registration in the game are handled by the Forge registries. A registry is an object similar to a map that assigns values to keys. Forge uses registries with [`ResourceLocation`][ResourceLocation] keys to register objects. This allows the `ResourceLocation` to act as the "registry name" for objects. The registry name for an object may be accessed with `#getRegistryName`/`#setRegistryName`. The setter can only be called once; calling it twice results in an exception. 

Every type of registrable object has its own registry. To see all registries supported by Forge, see the `ForgeRegistries` class. All registry names within a registry must be unique. However, names in different registries will not collide. For example, there's a `Block` registry, and an `Item` registry. A `Block` and an `Item` may be registered with the same name `example:thing` without colliding; however, if two different `Block`s or `Item`s were registered with the same exact name, the second object will override the first.

Methods for Registering
------------------

There are two proper ways to register objects: the `DeferredRegister` class, and the `RegistryEvent$Register` lifecycle event.

### DeferredRegister

`DeferredRegister` is the newer and documented way to register objects. It allows the use and convenience of static initializers while avoiding the issues associated with it. It simply maintains a list of suppliers for entries and registers the objects from those suppliers during the proper `RegistryEvent$Register` event.

An example of a mod registering a custom block:

```java
private static final DeferredRegister<Block> BLOCKS = DeferredRegister.create(ForgeRegistries.BLOCKS, MODID);

public static final RegistryObject<Block> ROCK_BLOCK = BLOCKS.register("rock", () -> new Block(BlockBehaviour.Properties.of(Material.STONE)));

public ExampleMod() {
  BLOCKS.register(FMLJavaModLoadingContext.get().getModEventBus());
}
```

### `Register` events

The `RegistryEvent`s are the second and more flexible way to register objects. These [events][] are fired after the mod constructors and before the loading of configs.

The event used to register objects is `RegistryEvent$Register<T>`. The type parameter `T` should be set to the type of the object being registered. Calling `#getRegistry` will return the registry, upon which objects are registered with `#register` or `#registerAll`. 

Here is an example: (the event handler is registered on the *mod event bus*)

```java
@SubscribeEvent
public void registerBlocks(RegistryEvent.Register<Block> event) {
  event.getRegistry().registerAll(new Block(...), new Block(...), ...);
}
```

### Registries that aren't Forge Registries

Due to some peculiarities of vanilla code, not all registries are wrapped by Forge. These can be static registries, like `RecipeType`, which are safe to use. There are also dynamic registries, like `ConfiguredFeature` and some other worldgen registries, which are typically represented in JSON. These objects should only be registered this way if there is another registry object that requires it. `DeferredRegister#create` has an overload which allows modders to specify the registry key of which vanilla registry to create a `RegistryObject` for. The registry method and attaching to the mod event bus is the same as other `DeferredRegister`s.

```java
private static final DeferredRegister<RecipeType<?>> REGISTER = DeferredRegister.create(Registry.RECIPE_TYPE_REGISTRY, "examplemod");

// As RecipeType is an interface, an anonymous class will be created for registering
// Vanilla RecipeTypes override #toString for debugging purposes, so it is omitted in this example
// Assume some recipe ExampleRecipe
public static final RegistryObject<RecipeType<ExampleRecipe>> EXAMPLE_RECIPE_TYPE = REGISTER.register("example_recipe_type", () -> new RecipeType<>() {});
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

Registered objects should not be stored in fields when they are created and registered. They are to be always newly created and registered whenever their respective `RegistryEvent$Register` event is fired. This is to allow dynamic loading and unloading of mods in a future version of Forge.

Registered objects must always be referenced through a `RegistryObject` or a field with `@ObjectHolder`.

### Using RegistryObjects

`RegistryObject`s can be used to retrieve references to registered objects once they are available. These are used by `DeferredRegister` to return a reference to the registered objects. Their references are updated after their corresponding registry's `RegistryEvent$Register` event is fired, along with the `@ObjectHolder` annotations.

To get a `RegistryObject`, call `RegistryObject#create` with a `ResourceLocation` and the `IForgeRegistry` of the registrable object. Custom registries can also be used by giving a supplier of the object's class. Store the `RegistryObject` in a `public static final` field, and call `#get` whenever you need the registered object.

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
  * one of the following conditions are true:
    * the **enclosing class** has an `@ObjectHolder` annotation, and the field is `final`, and:
      * the name value is the field's name; and
      * the namespace value is the enclosing class's namespace
      * _An exception is thrown if the namespace value cannot be found and inherited_
    * the **field** is annotated with `@ObjectHolder`, and:
      * the name value is explicitly defined; and
      * the namespace value is either explicitly defined or the enclosing class's namespace
  * the field type or one of its supertypes corresponds to a valid registry (e.g. `Item` or `ArrowItem` for the `Item` registry);
  * _An exception is thrown if a field does not have a corresponding registry._
* _An exception is thrown if the resulting `ResourceLocation` is incomplete or invalid (non-valid characters in path)_
* If no other errors or exceptions occur, the field will be injected
* If all of the above rules do not apply, no action will be taken (and a message may be logged)

`@ObjectHolder`-annotated fields are injected with their values after their corresponding registry's `RegistryEvent$Register` event is fired, along with the `RegistryObject`s.

!!! note
    If the object does not exist in the registry when it is to be injected, a debug message will be logged and no value will be injected.

As these rules are rather complicated, here are some examples:
```java
@ObjectHolder("minecraft") // Inheritable resource namespace: "minecraft"
class AnnotatedHolder {
  public static final Block diamond_block = null;   // No annotation. [public static final] is required.
                                                    // Block has a corresponding registry: [Block]
                                                    // Name path is the name of the field: "diamond_block"
                                                    // Namespace is not explicitly defined.
                                                    // So, namespace is inherited from class annotation: "minecraft"
                                                    // To inject: "minecraft:diamond_block" from the [Block] registry

  @ObjectHolder("ambient.cave")
  public static SoundEvent ambient_sound = null;    // Annotation present. [public static] is required.
                                                    // SoundEvent has a corresponding registry: [SoundEvent]
                                                    // Name path is the value of the annotation: "ambient.cave"
                                                    // Namespace is not explicitly defined.
                                                    // So, namespace is inherited from class annotation: "minecraft"
                                                    // To inject: "minecraft:ambient.cave" from the [SoundEvent] registry

  // Assume for the next entry that [ManaType] is a valid registry.          
  @ObjectHolder("neomagicae:coffeinum")
  public static final ManaType coffeinum = null;    // Annotation present. [public static] is required. [final] is optional.
                                                    // ManaType has a corresponding registry: [ManaType] (custom registry)
                                                    // Resource location is explicitly defined: "neomagicae:coffeinum"
                                                    // To inject: "neomagicae:coffeinum" from the [ManaType] registry

  public static final Item ENDER_PEARL = null;      // No annotation. [public static final] is required.
                                                    // Item has a corresponding registry: [Item].
                                                    // Name path is the name of the field: "ENDER_PEARL" -> "ender_pearl"
                                                    // !! ^ Field name is valid, because they are
                                                    //      converted to lowercase automatically.
                                                    // Namespace is not explicitly defined.
                                                    // So, namespace is inherited from class annotation: "minecraft"
                                                    // To inject: "minecraft:ender_pearl" from the [Item] registry

  @ObjectHolder("minecraft:arrow")
  public static final ArrowItem arrow = null;       // Annotation present. [public static] is required. [final] is optional.
                                                    // ArrowItem does not have a corresponding registry.
                                                    // ArrowItem's supertype of Item has a corresponding registry: [Item]
                                                    // Resource location is explicitly defined: "minecraft:arrow"
                                                    // To inject: "minecraft:arrow" from the [Item] registry                                                    

  public static Block bedrock = null;               // No annotation, so [public static final] is required.
                                                    // Therefore, the field is ignored.
    
  public static final CreativeModeTab group = null; // No annotation. [public static final] is required.
                                                    // CreativeModeTab does not have a corresponding registry.
                                                    // No supertypes of CreativeModeTab has a corresponding registry.
                                                    // Therefore, THIS WILL PRODUCE AN EXCEPTION.
}

class UnannotatedHolder { // Note the lack of an @ObjectHolder annotation on this class.
  @ObjectHolder("minecraft:flame")
  public static final Enchantment flame = null;     // Annotation present. [public static] is required. [final] is optional.
                                                    // Enchantment has corresponding registry: [Enchantment].
                                                    // Resource location is explicitly defined: "minecraft:flame"
                                                    // To inject: "minecraft:flame" from the [Enchantment] registry

  public static final Biome ice_flat = null;        // No annotation on the enclosing class.
                                                    // Therefore, the field is ignored.

  @ObjectHolder("minecraft:creeper")
  public static Entity creeper = null;              // Annotation present. [public static] is required.
                                                    // Entity does not have a corresponding registry.
                                                    // No supertypes of Entity has a corresponding registry.
                                                    // Therefore, THIS WILL PRODUCE AN EXCEPTION.

  @ObjectHolder("levitation")
  public static final Potion levitation = null;     // Annotation present. [public static] is required. [final] is optional.
                                                    // Potion has a corresponding registry: [Potion].
                                                    // Name path is the value of the annotation: "levitation"
                                                    // Namespace is not explicitly defined.
                                                    // No annotation in enclosing class.
                                                    // Therefore, THIS WILL PRODUCE AN EXCEPTION.
}
```

Creating Custom Forge Registries
--------------------------------

Custom registries can usually just be a simple map of key to value. This is a common style; however, it forces a hard dependency on the registry being present. It also requires that any data that needs to be synced between sides must be done manually. Custom Forge Registries provide a simple alternative for creating soft dependents along with better management and automatic syncing between sides (unless told otherwise). Since the objects also use a Forge registry, registration becomes standardized in the same way.

Custom Forge Registries are created with the help of a `RegistryBuilder`, through either `NewRegistryEvent` or the `DeferredRegister`. The `RegistryBuilder` class takes various parameters (such as the registry's name, the `Class` of its values, and various callbacks for different events happening on the registry). New registries are registered to the `RegistryManager` after `NewRegistryEvent` finishes firing.

The `Class` of the value of the registry must implement `IForgeRegistryEntry`, which defines that `#setRegistryName` and `#getRegistryName` can be called on the objects of that class. It is recommended to extend `ForgeRegistryEntry`, the default implementation instead of implementing the interface directly. When `#setRegistryName(String)` is called with a string, and that string does not have an explicit namespace, its namespace will be set to the current modid.

Any newly created registry should use its associated [registration method][registration] to register the associated objects.

### Using NewRegistryEvent

When using `NewRegistryEvent`, calling `#create` with a `RegistryBuilder` will return a supplier-wrapped registry. The supplied registry can be accessed after `NewRegistryEvent` has finished posting to the mod event bus. Getting the custom registry from the supplier before `NewRegistryEvent` finishes firing will result in a `null` value.

### With DeferredRegister

The `DeferredRegister` method is once again another wrapper around the above event. Once a `DeferredRegister` is created in a constant field using the `#create` overload which takes in the registry name and the mod id, the registry can be constructed via `DeferredRegister#makeRegistry`. This takes in the registry class along with a supplied `RegistryBuilder` containing any additional configurations. The method already populates `#setName` and `#setType` by default. Since this method can be returned at any time, a supplied version of an `IForgeRegistry` is returned instead. Getting the custom registry from the supplier before `NewRegistryEvent` is fired will result in a `null` value.

!!! important
    `DeferredRegister#makeRegistry` must be called before the `DeferredRegister` is added to the mod event bus via `#register`. `#makeRegistry` also uses the `#register` method to create the registry during `NewRegistryEvent`.

Handling Missing Entries
------------------------

There are cases where certain registry objects will cease to exist whenever a mod is updated or, more likely, removed. It is possible to specify actions to handle the missing mapping through the third of the registry events: `RegistryEvent$MissingMappings`. Within this event, a list of missing mappings can be obtained either by `#getMappings` given a mod id or all mappings via `#getAllMappings`.

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
[events]: ./events.md
[blockentity]: ../blockentities/index.md
