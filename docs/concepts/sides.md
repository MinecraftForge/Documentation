Sides in Minecraft
===================

A very important concept to understand when modding Minecraft are the two sides: *client* and *server*. There are many, many common misconceptions and mistakes regarding siding, which can lead to bugs that might not crash the game, but can rather have unintended and often unpredictable effects.

Different Kinds of Sides
------------------------

When we say "client" or "server", it usually follows with a fairly intuitive understanding of what part of the game we're talking about. After all, a client is what the user interacts with, and a server is where the user connects for a multiplayer game. Easy, right?

As it turns out, there can be some ambiguity even with two such terms. Here we disambiguate the four possible meanings of "client" and "server":

* Physical client - The *physical client* is the entire program that runs whenever you launch Minecraft from the launcher. All threads, processes, and services that run during the game's graphical, interactable lifetime are part of the physical client.
* Physical server - Often known as the dedicated server, the *physical server* is the entire program that runs whenever you launch any sort of `minecraft_server.jar` that does not bring up a playable GUI.
* Logical server - The *logical server* is what runs game logic: mob spawning, weather, updating inventories, health, AI, and all other game mechanics. The logical server is present within the physical server, but is also can run inside a physical client together with a logical client, as a single player world. The logical server always runs in a thread named the `Server Thread`.
* Logical client - The *logical client* is what accepts input from the player and relays it to the logical server. In addition, it also receives information from the logical server and makes it available graphically to the player. The logical client runs in the `Client Thread`, though often several other threads are spawned to handle things like audio and chunk render batching.

In the Minecraft codebase, the physical side is represented by an enum called `Dist`, while the logical side is represented by an enum called `LogicalSide`.

Performing Side-Specific Operations
-----------------------------------

### `world.isRemote`

This boolean check will be your most used way to check sides. Querying this field on a `World` object establishes the  **logical** side the world belongs to. That is, if this field is `true`, the world is currently running on the logical client. If the field is `false`, the world is running on the logical server. It follows that the physical server will always contain `false` in this field, but we cannot assume that `false` implies a physical server, since this field can also be `false` for the logical server inside a physical client (in other words, a single player world).

Use this check whenever you need to determine if game logic and other mechanics should be run. For example, if you want to damage the player every time they click your block, or have your machine process dirt into diamonds, you should only do so after ensuring `world.isRemote` is `false`. Applying game logic to the logical client can cause desynchronization (ghost entities, desynchronized stats, etc.) in the lightest case, and crashes in the worst case.

This check should be used as your go-to default. Aside from `DistExecutor`, rarely will you need the other ways of determining side and adjusting behavior.

### `DistExecutor`

Considering the use of a single "universal" jar for client and server mods, and the separation of the physical sides into two jars, an important question comes to mind: How do we use code that is only present on one physical side? All code in `net.minecraft.client` is only present on the physical client, and all code in `net.minecraft.server.dedicated` is only present on the physical server. If any class you write references those names in any way, they will crash the game when that respective class is loaded in an environment where those names do not exist. A very common mistake in beginners is to call `Minecraft.getMinecraft().<doStuff>()` in block or tile entity classes, which will crash any physical server as soon as the class is loaded.

How do we resolve this? Luckily, FML has `DistExecutor`, which provides various methods to run different methods on different physical sides, or a single method only on one side.

!!! note

    It is important to understand that FML checks based on the **physical** side. A single player world (logical server + logical client within a physical client) will always use `Dist.CLIENT`!

### Thread Groups

If `Thread.currentThread().getThreadGroup() == SidedThreadGroups.SERVER` is true, it is likely the current thread is on the logical server. Otherwise, it is likely on the logical client. This is useful to retrieve the **logical** side when you do not have access to a `World` object to check `isRemote`. It *guesses* which logical side you are on by looking at the group of the currently running thread. Because it is a guess, this method should only be used when other options have been exhausted. In nearly every case, you should prefer checking `world.isRemote` to this check.

### `FMLEnvironment.dist` and `@OnlyIn`

`FMLEnvironment.dist` holds the **physical** side your code is running on. Since it is determined at startup, it does not rely on guessing to return its result. The number of use cases for this is limited, however.

Annotating a method or field with the `@OnlyIn(Dist)` annotation indicates to the loader that the respective member should be completely stripped out of the definition not on the specified **physical** side. Usually, these are only seen when browsing through the decompiled Minecraft code, indicating methods that the Mojang obfuscator stripped out. There is little to no reason for using this annotation directly. Only use it if you are overriding a vanilla method that already has `@OnlyIn` defined. In most other cases where you need to dispatch behavior based on physical sides, use `DistExecutor` or a check on `FMLEnvironment.dist` instead.

Common Mistakes
---------------

### Reaching Across Logical Sides

Whenever you want to send information from one logical side to another, you must **always** use network packets. It is incredibly tempting, when in a single player scenario, to directly transfer data from the logical server to the logical client.

This is actually very commonly inadvertently done through static fields. Since the logical client and logical server share the same JVM in a single player scenario, both threads writing to and reading from static fields will cause all sorts of race conditions and the classical issues associated with threading.

This mistake can also be made explicitly by accessing physical client-only classes such as `Minecraft` from common code that runs or can run on the logical server. This mistake is easy to miss for beginners, who debug in a physical client. The code will work there, but will immediately crash on a physical server.
