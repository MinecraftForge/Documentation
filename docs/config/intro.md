Configuration Files
===================

Forge has built in support for creating and managing mod configuration files. The purpose of a configuration file is to add flexibility and allow end users to customize their experience.

Creating
--------

Create a dedicated class. Use the builder instance to define the configuration structure and data.

```java
private BooleanValue mySetting;

public ServerConfig(ForgeConfigSpec.Builder builder) {
  builder.comment("examplemod settings"); // Comment at the start of the file
  
  builder.push("Example Category"); // 'Enter' the Category
  
  mySetting = builder
    .comment("Set this to true to enable something") // Comment on the setting
    .translation("examplemod.exampleboolserver") // Language translation key
    .define("exampleboolserver", false); // Setting key and default value

  builder.pop(); // 'Exit' the category
}
```

Registration
------------

Create the Pair instance.

```java
protected final static Pair<ServerConfig, ForgeConfigSpec> serverConfigPair = new ForgeConfigSpec.Builder().configure(ServerConfig::new);
```

```java
ModLoadingContext.get().registerConfig(ModConfig.Type.SERVER, serverConfigPair.getRight());
```

Using Values
------------

Simply call the setting's get method.

```java
protected final static Config serverConfig = serverConfigPair.getLeft();
serverConfig.mySetting.get()
```

Changing Values
---------------

Simply call the setting's set method and provide a value. The configuration file will be updated with the new value. No other actions are needed.

Configuration Events
--------------------

Forge will fire two events on the ModLoadingContext bus, ModConfigEvent.Load and ModConfigEvent.Reload. Unless you have stuff to do when a setting is loaded, you do not need this.
