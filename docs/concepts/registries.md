Registries
==========

Registration is the process of taking the objects of a mod (items, blocks, sounds, etc.) and making them known to the game. Registering things is important, as without registration the game will simply not know about these objects in a mod and will exhibit great amounts of unexplainable behavior (and probably crash).

Most things that require registration in the game are handled by the Forge registries. A registry is a simple object similar to a map that assigns values to keys. Additionally, they automatically assign integer IDs to values. Forge uses registries with [`ResourceLocation`][ResourceLocation] keys to register objects, which are of type `IForgeRegistryEntry`. This allows the RL to act like a "registry name" for the object. The registry name for an object may be accessed with `get`/`setRegistryName`. The setter can only ever be called once, and calling it twice results in an exception. Every type of registrable object has its own registry, and names in two different registries will not collide. (E.g. there's a registry for `Block`s, and a registry for `Item`s, and a `Block` and an `Item` may be registered with the same name `mod:example` without colliding. However, if two blocks were registered with that name, an exception would be thrown.)

The default implementation of `IForgeRegistryEntry` (`IForgeRegistryEntry.Impl`) also provides two convenience implementations of `setRegistryName`: one where the parameter is a single string, and one where there are two string parameters. The overload that takes a single string checks whether the input contains a `:` (i.e. it checks whether the passed in stringified `ResourceLocation` has a domain), and if it doesn't it uses the current modid as the resource domain. The two argument overload simply constructs the registry name using the `modID` as the domain and `name` as the path.

There also exists the "registry registry", a registry that registers other registries. This registry registers registries with `ResourceLocation` names and secondary `Class` keys. This allows one to look up the registry that registers a certain class (e.g. one can look up `Block.class` in the registry registry with `GameRegistry.findRegistry` to get the registry that registers blocks).

Registering Things
------------------

The recommended way to register things is through the `RegistryEvent`s. In `RegistryEvent.NewRegistry`, registries should be created. Later, `RegistryEvent.Register` is fired once for each registered registry. Because `Register` is a generic event, the event handler should set the type parameter to the type of the object being registered. The event will contain the registry to register things to (`getRegistry`), and things may be registered with `register`(`All`) on the registry. Here's an example of an event handler that registers blocks:

```java
@SubscribeEvent
public void registerBlocks(RegistryEvent.Register<Block> event) {
    event.getRegistry().registerAll(block1, block2, ...);
}
```

The order in which `RegistryEvent.Register` events fire is arbitrary, with the exception that `Block` will *always* fire first, and `Item` will *always* fire second, right after `Block`. After the `Register<Block>` event has fired, all [`ObjectHolder`][ObjectHolder] annotations are refreshed, and after `Register<Item>` has fired they are refreshed again. They are refreshed for a third time after *all* of the other `Register` events have fired.

!!! important
    These events are fired *before* preinit. This means that `@Mod.EventBusSubscriber` (or `MinecraftForge.EVENT_BUS.register` in the `@Mod` class's constructor for e.g. Scala mods which do not support `static`) should be used to register the event handler before preinit.

There is another, older way of registering objects into registries, using `GameRegistry.register`. Anytime something suggests using this method, it should be replaced with an event handler for the appropriate registry event. This method simply finds the registry corresponding to an `IForgeRegistryEntry` with `IForgeRegistryEntry::getRegistryType`, and then registers the object to the registry. There is also a convenience overload that takes an `IForgeRegistryEntry` (`ifre`) and an RL, which is equivalent to `GameRegistry.register(ifre.setRegistryName(rl))`.

Creating Registries
-------------------

Registries are not only for Forge. Any mod can create their own registries, and any mod can register things to registries from any other mod. Registries are created by using `RegistryBuilder`. This class takes certain parameters for the registry it will generate, such as the name. the `Class` of it's values, and various callbacks for when the registry is changed. Upon calling `RegistryBuilder::create`, the registry is built, registered to the registry registry, and returned to the caller.

Injecting Registry Values Into Fields
-------------------------------------

It is possible to have Forge inject values from registries into `public static final` fields of classes. This is done by annotating classes and fields with `@ObjectHolder`. If a class has this annotation, all the `public static final` fields within are taken to be object holders too, and the value of the annotation is the domain of the holder (i.e. every field uses it as the default domain for the registry name of the object to inject). If a field has this annotation, and the value does not contain a domain, the domain is chosen from the surrounding class's `@ObjectHolder` annotation. If the class is not annotated in this situation, the field is ignored with a warning. If it does contain a domain, then the object to inject into the field is the object with that name. If the class has the annotation and one of the `public static final` fields does not, then the resource path of the object's name is taken to be the field's name. The type of the registry is taken from the type of the field.

!!! note
    If an object is not found, either because the object itself hasn't been registered or because the registry does not exist, a debug message is logged and the field is left unchanged.

As these rules are rather complicated, here are some examples:

```java
@ObjectHolder("minecraft") // Resource domain "minecraft"
class AnnotatedHolder {
    public static final Block diamond_block = null; // public static final is required.
                                                    // Type Block means that the Block registry will be queried.
                                                    // diamond_block is the field name, and as the field is not annotated it is taken to be the resource path.
                                                    // As there is no explicit domain, "minecraft" is inherited from the class.
                                                    // Object to be injected: "minecraft:diamond_block" from the Block registry.

    @ObjectHolder("ender_eye")
    public static final Item eye_of_ender = null;   // Type Item means that the Item registry will be queried.
                                                    // As the annotation has the value "ender_eye", that overrides the field's name.
                                                    // As the domain is not explicit, "minecraft" is inherited from the class.
                                                    // Object to be injected: "minecraft:ender_eye" from the Item registry.

    @ObjectHolder("neomagicae:coffeinum")
    public static final ManaType coffeinum = null;  // Type ManaType means that the ManaType registry will be queried. This is obviously a registry made by a mod.
                                                    // As the annotation has the value "neomagicae:coffeinum", that overrides the field's name.
                                                    // The domain is explicit, and is "neomagicae", overriding the class's "minecraft" default.
                                                    // Object to be injected: "neomagicae:coffeinum" from the ManaType registry.

    public static final Item ENDER_PEARL = null;    // Note that the actual name is "minecraft:ender_pearl", not "minecraft:ENDER_PEARL".
                                                    // Therefore, THIS WILL FAIL. The field has to be lowercased or annotated.
}

class UnannotatedHolder { // Note lack of annotation on this class.
    @ObjectHolder("minecraft:flame")
    public static final Enchantment flame = null;   // No annotation on the class means that there is no preset domain to inherit.
                                                    // Field annotation supplies all the information for the object.
                                                    // Object to be injected: "minecraft:flame" from the Enchantment registry.

    public static final Biome ice_flat = null;      // No annotation on the class or the field.
                                                    // Therefore this just gets ignored.

    @ObjectHolder("levitation")
    public static final Potion levitation = null;   // No resource domain in annotation, and no default specified by class annotation.
                                                    // Therefore, THIS WILL FAIL. The field annotation needs a domain, or the class needs an annotation.
}
```

[ResourceLocation]: resources.md#resourcelocation
[ObjectHolder]: #injecting-registry-values-into-fields
