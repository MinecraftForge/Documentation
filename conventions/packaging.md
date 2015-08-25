# Mod Packaging
In Java, as you likely know, all classes must have a package name.

Package names should always be all-lowercase, as a Capitalized Name denotes a class.

## Base Package

The "base" package is the first part of the package name, usually the first two.

If you own a website, your base package should be your reversed domain name, like "com.google" or
"net.minecraftforge", etc. (In case it's not obvious, you **MUST NOT** use net.minecraftforge as
the base package for your mods.)

If you do not own a website, something like "mod.<username>" is also acceptable (e.g. "mod.steve").

If you have a website on GitHub, it's preferable to use it instead of the generic "mod." base. For
example, "io.github.google".

## Mod ID

Immediately after your base package should be the modid. You should *not* put classes directly into
your base package.

For example, if your base package was "com.example" and your mod was "BananaCraft", you would use
"com.example.bananacraft" as your main package.

This package is where your main mod class, annotated with @Mod, should go.

## Subpackages

For much improved organization, related classes should go in subpackages.
Generally, these should be ".block", ".item", ".client", ".entity", and ".network".

(e.g. "com.example.banancraft.block")

All classes which extend Block should go in .block, all classes which extend Item should
go in .item, anything which does client-specific things like rendering belongs in .client,
all classes which extend Entity belong in .entity, and anything that uses SimpleNetworkWrapper
should go in .network.

You can go another level deeper if your mod becomes unwieldy; this would be ".client.render",
".block.item", and ".client.gui". Anything that extends Render would go in ".client.render",
any ItemBlocks would be ".block.item", and any GuiScreens or GuiInventorys would be ".client.gui".

## Example
Here's an example of a well-structured mod based on this system:

 - com.example.bananacraft
     - block
         - BlockBananaFurnace
         - BlockBananaTreeLog
         - BlockBananaTreeLeaves
         - BlockLightAir
     - item
         - ItemBanana
         - ItemBananaCannon
         - ItemCharredBanana
     - entity
         - EntityBananaMonster
     - client
         - gui
             - GuiInventoryBananaFurnace
         - render
             - RenderBananaMonster
         - ClientProxy
     - network
         - MessageBananaVision
         - HandlerBananaVision
     - BananaCraftMod