# Getting started with items
This guide is for creating basic items.

# Creating an item
Your very first item will be quite basic but it will be an item.
So to get started create a package inside your main package where you store your item classes.
I recommend naming the package item or items to make it easy.
Inside the package you just created create a class.
I recommend that you name the class something like "ItemBasic" if the item was named basicItem or just basic.
Now to get to the code!
Inside the class you just created type in this code
```java
package domain.you.yourmod.item;

import net.minecraft.item.Item;
import net.minecraft.creativetab.CreativeTabs;

public class ItemBasic extends Item {
  public ItemBasic(String name, String texture){
    setUnlocalizedName(name);
    setTextureName(texture);
    setCreativeTab(CreativeTabs.tabMisc);
  }
}
```
And that is all there is to it in the main item class.

# Registering an item
So now when you have created your item you need to register it.
So now we register the item in the main class.
Let's say your main class looks like this
```java
package domain.you.yourmod;

import cpw.mods.fml.common.Mod;
import cpw.mods.fml.common.SidedProxy;
import cpw.mods.fml.common.event.FMLInitializationEvent;
import cpw.mods.fml.common.event.FMLPostInitializationEvent;
import cpw.mods.fml.common.event.FMLPreInitializationEvent;
import cpw.mods.fml.common.event.FMLServerStartingEvent;
import domain.you.yourmod.item.ItemBasic;

@Mod(modid = "YourMod", version = "1.0.0")
public class YourMod {

    @Mod.EventHandler
    public void preInit(FMLPreInitializationEvent event){
    }

    @Mod.EventHandler
    public void init(FMLInitializationEvent event){
    }

    @Mod.EventHandler
    public void postInit(FMLPostInitializationEvent event){
    }

}

```
Then you would make it look like this
```java
package domain.you.yourmod;

import cpw.mods.fml.common.Mod;
import cpw.mods.fml.common.SidedProxy;
import cpw.mods.fml.common.event.FMLInitializationEvent;
import cpw.mods.fml.common.event.FMLPostInitializationEvent;
import cpw.mods.fml.common.event.FMLPreInitializationEvent;
import cpw.mods.fml.common.event.FMLServerStartingEvent;
import cpw.mods.fml.common.registry.GameRegistry;
import domain.you.yourmod.item.ItemBasic;

@Mod(modid = "YourMod", version = "1.0.0")
public class YourMod {

    public static ItemBasic itemBasic;

    @Mod.EventHandler
    public void preInit(FMLPreInitializationEvent event){
      itemBasic = new ItemBasic("itemBasic", "yourmod:itemBasic");
      GameRegistry.registerItem(itemBasic, itemBasic.getUnlocalizedName());
    }

    @Mod.EventHandler
    public void init(FMLInitializationEvent event){
    }

    @Mod.EventHandler
    public void postInit(FMLPostInitializationEvent event){
    }

}

```
And now when you start up minecraft in your development environment you should in the misc tab see your item named something like "item.itemBasic.name".
And there you have it a basic item in Forge!
