Configuration Files
===================

Minecraft Forge provides tools for letting users configure mods via special configuration files. This guide shows how to make use of these tools.

The Configuration Object
------------------------
Configuration files are accessed through an object of type `net.minecraftforge.common.config.Configuration`. Its constructor takes a `java.io.File` object as input, which will be used to save the configurations. The recommended file to use is `FMLPreInitializationEvent.getSuggestedConfigurationFile()`, which points to the file `.minecraft/config/[modid].cfg`

```java
public static Configuration config;

@EventHandler
public void preInit(FMLPreInitializationEvent event) {
  config = new Configuration(event.getSuggestedConfigurationFile());
}
```

To access properties from a configuration file, use the `Configuration.get[type]()` methods:

```java
boolean exampleBool = config.getBoolean("Example boolean", Configuration.CATEGORY_GENERAL, true, "This example boolean does nothing");
int exampleInt = config.getInt("Example integer", Configuration.CATEGORY_GENERAL, 4, 16, "This example integer does nothing");
```

See the javadocs on `Configuration` for more info.

Config GUIs
-----------

!!! important

    You must have your mcmod.info file set up to use config GUIs. See [Structuring Your Mod: The `mcmod.info` file](../gettingstarted/structuring.md#the-mcmodinfo-file) to learn how.

In-game, within the "Mods" dialog, there is a button labeled "Config" that is disabled by default. If you would like to know how to enable and make use of the "Config" dialog, @Minalien has [a great guide on setting it up](https://github.com/Minalien/BlogArchive/blob/master/ForgeTutorials/Spotlight__Config_GUIs.md).
