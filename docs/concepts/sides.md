Sides in Minecraft
===================

A very important concept to understand when modding Minecraft are the two sides: *client* and *server*. There are many, many common misconceptions and mistakes regarding siding, which can lead to bugs that might not crash the game, but can rather have unintended and often unpredictable effects.

Different Kinds of Sides
------------------------

When we say "client" or "server", it usually follows with a fairly intuitive understanding of what part of the game we are talking about. After all, a client is what the user interacts with, and a server is where the user connects for a multiplayer game. Easy, right?

As it turns out, there can be some ambiguity even with two such terms. Here we disambiguate the four possible meanings of "client" and "server":

* Physical client - The *physical client* is the entire program that runs whenever you launch Minecraft from the launcher. All threads, processes, and services that run during the game's graphical, interactable lifetime are part of the physical client.
* Physical server - Often known as the dedicated server, the *physical server* is the entire program that runs whenever you launch any sort of `minecraft_server.jar` that does not bring up a playable GUI.
* Logical server - The *logical server* is what runs game logic: mob spawning, weather, updating inventories, health, AI, and all other game mechanics. The logical server is present within a physical server, but it also can run inside a physical client together with a logical client, as a single player world. The logical server always runs in a thread named the `Server Thread`.
* Logical client - The *logical client* is what accepts input from the player and relays it to the logical server. In addition, it also receives information from the logical server and makes it available graphically to the player. The logical client runs in the `Render Thread`, though often several other threads are spawned to handle things like audio and chunk render batching.

In the MinecraftForge codebase, the physical side is represented by an enum called `Dist`, while the logical side is represented by an enum called `LogicalSide`.

Performing Side-Specific Operations
-----------------------------------

### `Level#isClientSide`

This boolean check will be your most used way to check sides. Querying this field on a `Level` object establishes the  **logical** side the level belongs to. That is, if this field is `true`, the level is currently running on the logical client. If the field is `false`, the level is running on the logical server. It follows that the physical server will always contain `false` in this field, but we cannot assume that `false` implies a physical server, since this field can also be `false` for the logical server inside a physical client (in other words, a single player world).

Use this check whenever you need to determine if game logic and other mechanics should be run. For example, if you want to damage the player every time they click your block, or have your machine process dirt into diamonds, you should only do so after ensuring `#isClientSide` is `false`. Applying game logic to the logical client can cause desynchronization (ghost entities, desynchronized stats, etc.) in the best case, and crashes in the worst case.

This check should be used as your go-to default. Aside from `DistExecutor`, rarely will you need the other ways of determining side and adjusting behavior.

### `DistExecutor`

Considering the use of a single "universal" jar for client and server mods, and the separation of the physical sides into two jars, an important question comes to mind: How do we use code that is only present on one physical side? All code in `net.minecraft.client` is only present on the physical client. If any class you write references those names in any way, they will crash the game when that respective class is loaded in an environment where those names do not exist. A very common mistake in beginners is to call `Minecraft.getInstance().<doStuff>()` in block or block entity classes, which will crash any physical server as soon as the class is loaded.

How do we resolve this? Luckily, FML has `DistExecutor`, which provides various methods to run different methods on different physical sides, or a single method only on one side.

!!! note
    It is important to understand that FML checks based on the **physical** side. A single player world (logical server + logical client within a physical client) will always use `Dist.CLIENT`!

`DistExecutor` works by taking in a supplied supplier executing a method, effectively preventing classloading by taking advantage of the [`invokedynamic` JVM instruction][invokedynamic]. The executed method should be static and within a different class. Additionally, if no parameters are present for the static method, a method reference should be used instead of a supplier executing a method.

There are two main methods within `DistExecutor`: `#runWhenOn` and `#callWhenOn`. The methods take in the physical side the executing method should run on and the supplied executing method which either runs or returns a result respectively.

These two methods are subdivided further into `#safe*` and `#unsafe*` variants. Safe and unsafe variants are misnomers for their purposes. The main difference is that when in a development environment, the `#safe*` methods will validate that the supplied executing method is a lambda returning a method reference to another class with an error being thrown otherwise. Within the production environment, `#safe*` and `#unsafe*` are functionally the same.

```java
// In a client class: ExampleClass
public static void unsafeRunMethodExample(Object param1, Object param2) {
  // ...
}

public static Object safeCallMethodExample() {
  // ...
}

// In some common class
DistExecutor.unsafeRunWhenOn(Dist.CLIENT, () -> ExampleClass.unsafeRunMethodExample(var1, var2));

DistExecutor.safeCallWhenOn(Dist.CLIENT, () -> ExampleClass::safeCallMethodExample);

```

!!! warning
    Due to a change in how `invokedynamic` works in Java 9+, all `#safe*` variants of the `DistExecutor` methods throw the original exception wrapped within a `BootstrapMethodError` in the development environment. `#unsafe*` variants or a check to [`FMLEnvironment#dist`][dist] should be used instead.

### Thread Groups

If `Thread.currentThread().getThreadGroup() == SidedThreadGroups.SERVER` is true, it is likely the current thread is on the logical server. Otherwise, it is likely on the logical client. This is useful to retrieve the **logical** side when you do not have access to a `Level` object to check `isClientSide`. It *guesses* which logical side you are on by looking at the group of the currently running thread. Because it is a guess, this method should only be used when other options have been exhausted. In nearly every case, you should prefer checking `Level#isClientSide`.

### `FMLEnvironment#dist` and `@OnlyIn`

`FMLEnvironment#dist` holds the **physical** side your code is running on. Since it is determined at startup, it does not rely on guessing to return its result. The number of use cases for this is limited, however.

Annotating a method or field with the `@OnlyIn(Dist)` annotation indicates to the loader that the respective member should be completely stripped out of the definition not on the specified **physical** side. Usually, these are only seen when browsing through the decompiled Minecraft code, indicating methods that the Mojang obfuscator stripped out. There is **NO** reason for using this annotation directly. Use `DistExecutor` or a check on `FMLEnvironment#dist` instead.

Common Mistakes
---------------

### Reaching Across Logical Sides

Whenever you want to send information from one logical side to another, you must **always** use network packets. It is incredibly tempting, when in a single player scenario, to directly transfer data from the logical server to the logical client.

This is actually very commonly inadvertently done through static fields. Since the logical client and logical server share the same JVM in a single player scenario, both threads writing to and reading from static fields will cause all sorts of race conditions and the classical issues associated with threading.

This mistake can also be made explicitly by accessing physical client-only classes such as `Minecraft` from common code that runs or can run on the logical server. This mistake is easy to miss for beginners who debug in a physical client. The code will work there, but it will immediately crash on a physical server.


Writing One-Sided Mods
----------------------

In recent versions, Minecraft Forge has removed a "sidedness" attribute from the mods.toml. This means that your mods are expected to work whether they are loaded on the physical client or the physical server. So for one-sided mods, you would typically register your event handlers inside a `DistExecutor#safeRunWhenOn` or `DistExecutor#unsafeRunWhenOn` instead of directly calling the relevant registration methods in your mod constructor. Basically, if your mod is loaded on the wrong side, it should simply do nothing, listen to no events, and so on. A one-sided mod by nature should not register blocks, items, ... since they would need to be available on the other side, too.

Additionally, if your mod is one-sided, it typically does not forbid the user from joining a server that is lacking that mod. Therefore, you should set the `displayTest` property in your [mods.toml][structuring] to whatever value is necessary.

```toml
[[mods]]
  # ...

  # MATCH_VERSION means that your mod will cause a red X if the versions on client and server differ. This is the default behaviour and should be what you choose if you have server and client elements to your mod.
  # IGNORE_SERVER_VERSION means that your mod will not cause a red X if it's present on the server but not on the client. This is what you should use if you're a server only mod.
  # IGNORE_ALL_VERSION means that your mod will not cause a red X if it's present on the client or the server. This is a special case and should only be used if your mod has no server component.
  # NONE means that no display test is set on your mod. You need to do this yourself, see IExtensionPoint.DisplayTest for more information. You can define any scheme you wish with this value.
  # IMPORTANT NOTE: this is NOT an instruction as to which environments (CLIENT or DEDICATED SERVER) your mod loads on. Your mod should load (and maybe do nothing!) whereever it finds itself.
  displayTest="IGNORE_ALL_VERSION" # MATCH_VERSION is the default if nothing is specified (#optional)
```

If a custom display test is to be used, then the `displayTest` option should be set to `NONE`, and an `IExtensionPoint$DisplayTest` extension should be registered:

```java
//Make sure the mod being absent on the other network side does not cause the client to display the server as incompatible
ModLoadingContext.get().registerExtensionPoint(IExtensionPoint.DisplayTest.class, () -> new IExtensionPoint.DisplayTest(() -> NetworkConstants.IGNORESERVERONLY, (a, b) -> true));
```

This tells the client that it should ignore the server version being absent, and the server that it should not tell the client this mod should be present. So this snippet works both for client- and server-only-sided mods.


[invokedynamic]: https://docs.oracle.com/javase/specs/jvms/se17/html/jvms-6.html#jvms-6.5.invokedynamic
[dist]: #fmlenvironmentdist-and-onlyin
[structuring]: ../gettingstarted/structuring.md#the-modstoml-file
