Configuration
=============

Configurations define settings and consumer preferences that can be applied to a mod instance. Forge uses a configuration system using [TOML][toml] files and read with [night-config][nightconfig].

Creating a Configuration
------------------------

A configuration can be created using a subtype of `IConfigSpec`. Forge implements the type via `ForgeConfigSpec` and enables its construction through `ForgeConfigSpec#Builder`. The builder can separate the config values into sections via `Builder#push` to create a section and `Builder#pop` to leave a section. Afterwards, the configuration can be built using one of two methods:

Method    | Description
:---      | :---
build     | Creates the `ForgeConfigSpec`.
configure | Creates a pair of the class holding the config values and the `ForgeConfigSpec`.

Each config value can be supplied with additional context to provide additional behavior. Contexts must be defined before the config value is fully built:

Method       | Description
:---         | :---
comment      | Provides a description of what the config value does. Can provide multiple strings for a multiline comment.
translation  | Provides a translation key for the name of the config value.
worldRestart | The world must be restarted before the config value can be changed.

### ConfigValue

Config values can be built with the provided contexts (if defined) using any of the `#define` methods. The methods take in four components: a path representing the name of the variable, the default value when no valid configuration is present, a validator to make sure the deserialized object is valid, and a class representing the data type of the config value.

!!! note
    The path is a `.` separated string representing the sections the config value is in.

```java
// For some ForgeConfigSpec$Builder builder
ConfigValue<T> value = builder.comment("Comment")
  .define("config_value_name", defaultValue);
```

The values themselves can be obtained using `ConfigValue#get`. The values are additionally cached to prevent multiple readings from files.

#### Range Values

Config values that are specified within a range can be defined using `#defineInRange`. These expect the value to be a subtype of `Comparable`. The method is broken down into five components: a path representing the name of the variable, the default value when no valid configuration is present, the minimum and maximum value, and a class representing the data type of the config value.

#### Whitelisted Values

Config values that must be a part of a specific whitelist can be defined using `#defineInList`. The method is broken down into three components: a path representing the name of the variable, the default value when no valid configuration is present, and a collection of the allowed values the configuration can be.

#### List Values

Config values that can take in a list of entries can be defined using `#defineList`. If the list provided by the consumer can be empty, `#defineListAllowEmpty` should be used instead. The method is broken down into three components: a path representing the name of the variable, the default value when no valid configuration is present, and a validator to make sure a deserialized element from the list is valid.

#### Enum Values

Config values that represent an `Enum` can be defined by `EnumValue`s via `#defineEnum`. The method is broken down into four components: a path representing the name of the variable, the default value when no valid configuration is present, a getter to convert a string or integer into an enum, and a collection of the allowed values the configuration can be.

#### Boolean Values

Config values that represent a `boolean` can be defined by `BooleanValue`s via `#define`. The method is broken down into two components: a path representing the name of the variable and the default value when no valid configuration is present.

#### Double Values

Config values that represent a `double` can be defined by `DoubleValue`s via `#defineInRange`. The method is broken down into four components: a path representing the name of the variable, the default value when no valid configuration is present, and the minimum and maximum value.

#### Int Values

Config values that represent an `int` can be defined by `IntValue`s via `#defineInRange`. The method is broken down into four components: a path representing the name of the variable, the default value when no valid configuration is present, and the minimum and maximum value.

#### Long Values

Config values that represent a `long` can be defined by `LongValue`s via `#defineInRange`. The method is broken down into four components: a path representing the name of the variable, the default value when no valid configuration is present, and the minimum and maximum value.

Registering a Configuration
---------------------------

Once a `ForgeConfigSpec` has been built, it must be registered to allow Forge to load, track, and sync the configuration settings as required. Configurations should be registered in the mod constructor via `ModLoadingContext#registerConfig`. A configuration can be registered with a given type representing the side the config belongs to (`CLIENT`, `COMMON`, `SERVER`), the `ForgeConfigSpec`, and optionally a specific file name for the configuration.

```java
// In the mod constructor with a ForgeConfigSpec CONFIG
ModLoadingContext.get().registerConfig(Type.COMMON, CONFIG);
```

!!! tip
    The definition of each config type and what they are used for can be found as part of the [constant's javadoc][type].

Reading a Configuration
-----------------------

Operations that occur whenever a config is loaded or reloaded can be done using the `ModConfigEvent$Loading` and `ModConfigEvent$Reloading` events. The events must be [registered][events] to the mod event bus.

!!! warning
    These events are called for all configurations for the mod; the `ModConfig` object provided should be used to denote which configuration is being loaded or reloaded.

[toml]: https://toml.io/
[nightconfig]: https://github.com/TheElectronWill/night-config
[type]: https://github.com/MinecraftForge/MinecraftForge/blob/1.18.x/fmlcore/src/main/java/net/minecraftforge/fml/config/ModConfig.java#L108-L136
[events]: ../concepts/events.md#creating-an-event-handler
