Configuration Files
===================

Forge has built in support for creating and managing mod configuration files. The purpose of a configuration file is to add flexibility and allow end users to customize their experience.

Creating
--------

Create a dedicated class. Use the builder instance to define the configuration structure and data. Comments are 100% optional. 

```java
private BooleanValue myBool;
public IntValue<THING> myInt;
public EnumValue<THING> myEnum;

public ServerConfig(ForgeConfigSpec.Builder builder) {
  builder.comment("examplemod settings"); // Comment at the start of the file

  myBool = builder
    .comment("Set this to true to enable something") // Comment on the setting
    .translation("examplemod.examplebool") // Language translation key
    .define("examplebool", false); // Setting key and default value
  
  builder.push("Example Category 1"); // 'Enter' the Category  
  myInt = builder
    .translation("examplemod.exampleint")
    .defineEnum("exampleint", THING.ONE); // Valid settings for enums are all values in the enum set
  builder.pop(); // 'Exit' the category
  
  builder.push("Example Category 2"); // 'Enter' the Category
  myEnum = builder
    .comment("Choose which thing")
    .translation("examplemod.exampleenum")
    .defineInRange("exampleenum", 5, 0, 30); // For integers, you can specify allowed value range
  builder.pop(); // 'Exit' the category
}
```

Default Values
--------------

```java

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
serverConfig.myBool.get()
```

Changing Values
---------------

Simply call the setting's set method and provide a value. The configuration file will be updated with the new value. No other actions are needed.

Configuration Events
--------------------

Forge will fire two events on the ModLoadingContext bus, ModConfigEvent.Load and ModConfigEvent.Reload. Unless you have stuff to do when a setting is loaded, you do not need this.
