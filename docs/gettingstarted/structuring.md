Structuring Your Mod
====================

In this section, we'll look at the general convention on how to organize your mod into different packages, and what those packages should do.

Packaging
---------

Your mod should have a unique package name to avoid conflicts with anything else that might be loaded in from a Classloader. If you own a domain you would like to associate or have a domain associated with other projects already, you can use it as your **top level package**. For example, if you own the domain *"examplemod.com"*, you can choose to use `com.examplemod` as your top level package.

**HOWEVER**

If you do not own a domain, **do *NOT* use it for your top level package!**  
It is perfectly acceptable to start your package with anything, such as your name/nickname, or the name of the mod. For example, `username.mods` would be a good top level package. 

After you pick a top level package, you should append a unique name to it for your mod. Some good examples would be `com.examplemod.awesomesauce` or `username.mods.awesomesauce`, where **AwesomeSauce** is the name of our mod.

The Mod File
------------

Generally, we'll start with a file named after your mod, and put into your package. This is the *entry point* to your mod and will contain some special annotations marking it as such. These annotations are `@Mod`, `@Instance`, and `@EventHandler`. Let's take a look at this example:

!!! note
This example is a modified version of the one found in the MDK [here](https://github.com/MinecraftForge/MinecraftForge/blob/1.10.x/mdk/src/main/java/com/example/examplemod/ExampleMod.java)

    package com.examplemod.awesomesauce;
        
    import net.minecraft.init.Blocks;
    import net.minecraftforge.fml.common.Mod;
    import net.minecraftforge.fml.common.Mod.EventHandler;
    import net.minecraftforge.fml.common.event.FMLInitializationEvent;
        
    @Mod(modid = "awesomesauce", name = "AwesomeSauce", version = "0.1")
    public class AwesomeSauceMod
    {
        @Instance
        public static AwesomeSauceMod instance = new AwesomeSauceMod();
        
        @EventHandler
        public void init(FMLInitializationEvent event)
        {
            // some example code
            System.out.println("DIRT BLOCK >> "+Blocks.DIRT.getUnlocalizedName());
        }
    }

What is `@Mod`?
-------------

`@Mod` is the annotation indicating that the class is a *Mod entry point* for Forge Mod Loader. It contains various bits of Metadata that the mod will use as well as modifiers that tell Forge how to handle your mod. For instance, Forge supports mods written in `Java` and `Scala`, so if you write your mod in `Scala`, you'll need to also set `modLanguage = "scala"` in the `@Mod` annotation so Forge know how to deal with your mod.

Now, the `@Mod` annotation can take quite a few arguments, but the only three *required* ones are `modid`, `name`, and `version`.
* `modid` is the unique identifier and *internal* name of the mod, and takes a `String`. Usually, this is the same name as the mod, but has some special requirements for the naming convention; namely, it has to be *less than* 64 characters long, and *all lowercase*. Having `modid = "SomeReallyLongAndCamelCasedNameForYourModIDWillNotWorkAndMakeForgeReallyReallyAngry"` is a no-no. It's used internally by Forge and by other Mod Developers that wish to find your mod through Forge (for instance, to use your APIs).
 * **ONCE YOU PICK THIS IDENTIFIER, YOU SHOULD NOT CHANGE IT DURING THE LIFE OF THE MOD. BAD THINGS HAPPEN IF YOU DO AND OTHER MODS DEPEND ON YOUR MOD.**
* `name` is the *external* name of the mod, and takes a `String`. This is literally just the name of your mod, in our case it would be `name = "AwesomeSauce`.
* `version` is the version of the mod, and takes a `String`. There is no set standard for how you version things, but it's recommended that you read the [versioning](https://mcforge.readthedocs.io/en/latest/conventions/versioning/) article.

Simple, right? `@Mod` has a wide range of other things you can throw at it, like the `modLanguage` example above, but those will be covered in the articles that use them.

What is `@Instance`?
-------------------
`@Instance` is actually a child annotation of `@Mod`. It basically just gives Forge and other Mod Developers a way to instance your mod if they need to.

What is `@EventHandler`?
-----------------------
`@EventHandler` is an annotation used to mark whatever method it's attached to as a handler for a *Forge Lifecycle Event*. There are two main categories of Lifecycle Events: **Standard** and **Server**. **Standard Lifecycle Events** are always fired when the client and server first starts up, and **Server Lifecycle Events** are only fired when the server, either internal or dedicated, starts up. There are some specialized events as well, which are covered in more detail along with the rest of the loding stages [here](https://mcforge.readthedocs.io/en/latest/conventions/loadstages/).

For a simple mod, *FMLPreInitializationEvent*, *FMLInitializationEvent*, and *FMLPostInitializationEvent* should be more than enough to set up everything you need.

Keeping Your Code Clean Using Sub-packages
------------------------------------------

So, now you have a top level package for your mod and you are ready to get those fingers going. But, before you go and make the Next Best Thing, we should talk about package organization and the use of subpackages. In short, *do it*. Literally nobody like reading a wall of text in a single class trying to figure out how your mod works so they can extend it or fix a bug or whatever.

A common package layout has a `common` subpackage, for client *and* server things, and `client` subpackage, for client-only things. You could also have a subpackage for events and one for items and so forth. An example of this would be:

* `com.examplemod.awesomesauce.api` for your mods API
* `com.examplemod.awesomesauce.client.gui` for client-side GUI classes
* `com.examplemod.awesomesauce.events` for your custom events

Organize it in a way that it makes it easy for you to follow your code, while also allowing your mod to grow and evolve organically as time progresses and new features are added to Minecraft and Forge.

Class Naming Schemes
--------------------

Naming your classes, and being consistant, is important to knowing what those classes do. `BlockSauce` should be a Block, `ItemSpoon` should be an Item, et cetera. However, making sure those classes are in the right package will also help with the ability to find that class if you decide you need to look at it one day down the line. If you have `EntitySauceMonster` in the `com.examplemod.awesomesauce.client.gui` package, you might need to think about refactoring your code to better structure it.
