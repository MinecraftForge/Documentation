Registries
==========

Registration is the process of taking the objects of a mod (such as items, blocks, sounds, etc.) and making them known to the game. Registering things is important, as without registration the game will simply not know about these objects, which will cause unexplainable behaviors and crashes. 

Most things that require registration in the game are handled by the Forge registries. A registry is an object similar to a map that assigns values to keys. Forge uses registries with [`ResourceLocation`][ResourceLocation] keys to register objects. This allows the `ResourceLocation` to act as the "registry name" for objects. The registry name for an object may be accessed with `#getRegistryName`/`#setRegistryName`. The setter can only be called once; calling it twice results in an exception. 

Every type of registrable object has its own registry. To see all registries supported by Forge, see the `ForgeRegistries` class. All registry names within a registry must be unique. However, names in different registries will not collide. For example, there's a `Block` registry, and an `Item` registry. A `Block` and an `Item` may be registered with the same name `example:thing` without colliding; however, if two different `Block`s or `Item`s were registered with the same exact name, the second object will override the first.

Methods for Registering
------------------

There are two proper ways to register objects: the `DeferredRegister` class, and the `RegistryEvent.Register` lifecycle event.

### DeferredRegister

`DeferredRegister` is the newer and documented way to register objects. It allows the use and convenience of static initialisers while avoiding the issues associated with it. It simply maintains a list of suppliers for entries and registers the objects from those suppliers during the proper `Register` event.

An example of a mod registering a custom block:

```java
private static final DeferredRegister<Block> BLOCKS = new DeferredRegister<>(ForgeRegistries.BLOCKS, MODID);

public static final RegistryObject<Block> ROCK_BLOCK = BLOCKS.register("rock", () -> new Block(Block.Properties.create(Material.ROCK)));

public ExampleMod() {
	BLOCKS.register(FMLJavaModLoadingContext.get().getModEventBus());
}
```

### `Register` events

The `RegistryEvent`s are the second and more flexible way to register objects. These [events][] are fired after the mod constructors and before the loading of configs.

The event used in registering objects is the `RegistryEvent.Register<T>`. The type parameter `T` should be set to the type of the object being registered. Calling `#getRegistry` will return the registry, upon which objects are registered with `#register` or `#registerAll`. 

`RegistryEvent.Register<?>` events are fired in this order: first, the `Block` registry, then the `Item` registry, and then all other registries in alphabetical order. 

Here is an example: (the event handler is registered on the *mod event bus*)

```java
@SubscribeEvent
public void registerBlocks(RegistryEvent.Register<Block> event) {
    event.getRegistry().registerAll(block1, block2, ...);
}
```

!!! note
    Some classes cannot by themself be registered; instead, `*Type` classes are registered, and used in the formers' constructors. For example, [`TileEntity`][tileentity] has `TileEntityType`, and `Entity` has `EntityType`. These `*Type` classes are factories that simply create the containing type on demand. 
    
    These factories are created through the use of their `*Type.Builder` classes. An example: (`REGISTER` refers to a `DeferredRegister<TileEntityType>`)
    ```java
    public static final RegistryObject<TileEntityType<ExampleTile>> EXAMPLE_TILE = REGISTER.register(
        "example_tile", () -> TileEntityType.Builder.create(ExampleTile::new, EXAMPLE_BLOCK.get()).build(null)
    );
    ```

Injecting Values Using @ObjectHolder
-------------------------------------

It is possible to have Forge inject registered object from registries into the `public static` fields of classes. This is done by annotating classes or fields with `@ObjectHolder` and supplying enough information to construct a `ResourceLocation` that identifies a specific object in a specific registry.

The rules for `@ObjectHolder` are as follows:

  * If the class is annotated with `@ObjectHolder`, its value will be the default namespace for all fields within if not explicitly defined
  * If the class is annotated with `@Mod`, the modid will be the default namespace for all annotated fields within if not explicitly defined
  * A field is considered for injection if:
    * it has at least the modifiers `public static`;
    * the field type corresponds to a valid registry (e.g. `Item` for the `Item` registry);
    * *An exception is thrown if the field type does not correspond to a valid registry*
    * the **field** is annotated with `@ObjectHolder`, then:
        * the name value is explicitly defined; and
        * the namespace value is either explicitly defined or the enclosing class's namespace
    * the **enclosing class** has an `@ObjectHolder` annotation, and the field is `final`, then:
        * the name value is the field's name; and
        * the namespace value is the enclosing class's namespace
        * *An exception is thrown if the namespace value cannot be found and inherited*
  * *An exception is thrown if the resulting `ResourceLocation` is invalid (non-valid characters in path)*
  * If no other errors or exceptions occur, the field will be injected
  * If all of the above rules do not apply, no action will be taken (and a message may be logged)

`@ObjectHolder` annotations are refreshed and their fields are injected with their values three times: after the `Block` registry event, after the `Item` registry event, and once after all other registries. 

!!! note
    If the object does not exist in the registry when it is to be injected, a debug message will be logged and no futher action taken.

As these rules are rather complicated, here are some examples:
```java
@ObjectHolder("minecraft") // Inheritable resource namespace: "minecraft"
class AnnotatedHolder {
    public static final Block diamond_block = null; // No annotation. [public static final] is required.
    												// Registry to be queried is [Block].
    												// Name path is the name of the field: "diamond_block"
    												// Namespace is not explicitly defined.
    												// So, namespace is inherited from class annotation: "minecraft"
    												// To inject: "minecraft:diamond_block" from the [Block] registry  

	@ObjectHolder("ambient.cave")
    public static SoundEvent ambient_sound = null;  // Annotation present. [public static] is required.
    												// Registry to be queried is [SoundEvent].
    												// Name path is the value of the annotation: "ambient.cave"
    												// Namespace is not explicitly defined.
    												// So, namespace is inherited from class annotation: "minecraft"
    												// To inject: "minecraft:ambient.cave" from the [SoundEvent] registry

	// Assume for the next entry that [ManaType] is a valid registry.  		
    @ObjectHolder("neomagicae:coffeinum")
    public static final ManaType coffeinum = null;  // Annotation present. [public static] is required. [final] is optional.
    												// Registry to be queried is [ManaType] (custom registry).
    												// Resource location is explicitly defined: "neomagicae:coffeinum"
    												// To inject: "neomagicae:coffeinum" from the [ManaType] registry 

    public static final Item ENDER_PEARL = null;    // No annotation. [public static final] is required.
    												// Registry to be queried is [Item].
    												// Name path is the name of the field: "ENDER_PEARL" -> "ender_pearl"
    												// !! ^ Field name is valid, because ResourceLocations
    												//      lowercase their values automatically.
    												// Namespace is not explicitly defined.
    												// So, namespace is inherited from class annotation: "minecraft"
    												// To inject: "minecraft:ender_pearl" from the [Item] registry 
    												
    public static Block bedrock = null;             // No annotation, so [public static final] is required.
    												// Therefore, the field is ignored.
}

class UnannotatedHolder { // Note the lack of an @ObjectHolder annotation on this class.
    @ObjectHolder("minecraft:flame")
    public static final Enchantment flame = null;   // Annotation present. [public static] is required. [final] is optional.
    												// Registry to be queried is [Enchantment].
    												// Resource location is explicitly defined: "minecraft:flame"
    												// To inject: "minecraft:flame" from the [Enchantment] registry  

    public static final Biome ice_flat = null;      // No annotation, so [public static final] is required.
    												// No annotation on the enclosing class.
    												// Therefore, the field is ignored.

	@ObjectHolder("minecraft:creeper")
    public static Entity creeper = null; 		    // Annotation present. [public static] is required.
    												// No valid registry exists for [Entity].
    												// Therefore, THIS WILL PRODUCE AN EXCEPTION.

    @ObjectHolder("levitation")
    public static final Potion levitation = null;   // Annotation present. [public static] is required. [final] is optional.
    												// Registry to be queried is [Potion].
    												// Name path is the value of the annotation: "levitation"
    												// Namespace is not explicitly defined.
    												// No annotation in enclosing class.
    												// Therefore, THIS WILL PRODUCE AN EXCEPTION.
}
```

Creating Custom Registries
-------------------

Custom registries are created by using `RegistryBuilder` during the `RegistryEvent.NewRegistry` event. The class `RegistryBuilder` takes certain parameters (such as the name, the `Class` of its values, and various callbacks for different events happening on the registry). Calling `RegistryBuilder#create` will result in the registry being built, registered to the `RegistryManager`, and returned to the caller for additional processing.

The `Class` of the value of the registry must implement `IForgeRegistryEntry`, which defines that `#setRegistryName` and `#getRegistryName` can be called on the objects of that class. It is recommended to extend `ForgeRegistryEntry`, the default implementation instead of implementing the interface directly. When `#setRegistryName(String)` is called with a string, and that string does not have an explicit namespace, its namespace will be set to the current modid.

The Forge registries can be accessed through the `ForgeRegistries` class. All registries, Forge-provided or custom, can be retrieved by calling `GameRegistry.findRegistry(Class)` with the appropriate class for the registry. For example, the registry for `Block`s can be retrieved by calling `GameRegistry.findRegistry(Block.class)`.

[ResourceLocation]: resources.md#resourcelocation
[events]: ../events/intro.md
[tileentity]: ../tileentities/tileentity.md