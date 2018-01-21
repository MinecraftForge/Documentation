`@Config`
=======

The `@Config` annotation is an alternative to `Configuration`. 

Table of Contents
-------------

* [Basics][basics]
* [@Config Use][configuse]
* [@Comment Use][commentuse]
* [@Name Use][nameuse]
* [@RangeInt Use][rangeintuse]
* [@RangeDouble Use][rangedoubleuse]
* [@LangKey Use][langkeyuse]
* [@RequiresMcRestart Use][requiresmcrestartuse]
* [@RequiresWorldRestart Use][requiresworldrestartuse]

Basics
------

A Config should contain static fields, one per config option. There are a few exceptions, such as [Nested Configs][nestedconfigs] and [Sub Categories][subcategories]. Note that you can use an enum as a config field. To add information to and control config values, you can use the plethora of annotations provided in the `@Config` class.

A good example of this system is [`Forge's Test`][forgetest]

@Config Use
-----------

This annotation is used to denote a class is the container for some configuration options. There are 4 properties:

|     Property|Type     | Default Value | Comment 
|           -:|:-       |     :-:       |:-
|        modid|`String` |     N/A       | The mod id that this configuration is associated with. 
|         name|`String` |     `""`      | A user friendly name for the config file, the default will be modid. 
|         type|`Type`   |`Type.INSTANCE`| The type this is, right now the only value is `Type.INSTANCE`. This is intended to be expanded upon later for more Forge controlled configs. 
|     category|`String` |  `"general"`  | Root element category, defaults to "general", if this is an empty string then the root category is disabled. Any primitive fields will cause an error, and you must specify sub-category objects. 

### Example
```java
@Config(modid = "reallycoolmod")
public class Configs {

}
```

@Comment Use
------------

Adding a `@Comment` annotation to a field will add a comment to the config in it's file. It has 1 property:

| Property|Type       | Default Value |Comment 
|       -:|:-         |       :-:     |:-
|    value|`String[]` |       N/A     |This can be passed as a `String` or `String[]`, a `String[]` will form a multi-line comment where 1 element = 1 line.

### Example
```java
@Comment({
  "You can add comments using this",
  "and if you supply an array it will me multiline"
})
public static boolean doTheThing = true;
```
This will produce a `boolean` config value with name `doTheThing`, the defualt value `true` and the comment provided in the config file.

@Name Use
---------

You should use the `@Name` annotation to give a config a user friendly name in the config file. This has 1 property:
| Property | Type    | Default Value |
|        -:|:-       |      :-:      |
|     value|`String` |      N/A      | 

### Example
```java
@Name("FE/T for the thing")
public static int thingFE = 50; 
```
This will produce an `int` config value with the name `FE/T for the thing`, and the default value `50` in the config file.

@RangeInt Use
-------------

You should use `@RangeInt` to limit an `int` config value. It has a couple of properties:

| Property|Type |    Default Value    |
|       -:|:-   |        :-:          |
|      min|int  | `Integer.MIN_VALUE` |
|      max|int  | `Integer.MAX_VALUE` |

### Example
```java
@RangeInt(min = 0) 
public static int thingFE = 50;
```
This will produce an `int` config value with the name `thingFE`, and the default value `50` in the config file; it will ensure the value stays between the bounds of `0` and `Integer.MAX_VALUE`.

@RangeDouble Use
----------------

You should use `@RangeDouble` to limit a `double` config value. It has a couple of properties:

| Property|Type   |    Default Value   |
|       -:|:-     |        :-:         |
|      min|double | `Double.MIN_VALUE` |
|      max|double | `Double.MAX_VALUE` |

### Example
```java
@RangeDouble(min = 0, max = Math.PI) 
public static double chanceToDrop = 2;
```
This will produce a `double` config value with the name `chanceToDrop`, and the default value `Math.PI` in the config file; it will ensure the value stays between the bounds of `0` and `Math.PI`.

@LangKey Use
------------

You should use the `@LangKey` annotation to give a config a user friendly via .lang files in the mod options menu. NOTE: This does not affect anything in the config file itself. This has 1 property:
| Property | Type    | Default Value |
|        -:|:-       |      :-:      |
|     value|`String` |      N/A      | 

### Example
```java
@LangKey("modid.config.thingFE")
public static int thingFE = 50; 
```
This will produce an `int` config value with the name `thingFE`, and the default value `50` in the config file. However in the mod options menu, it will have the translated name supplied from the lang file with the `@LangKey`.

@RequiresMcRestart Use
----------------------

You should include this annotation on a config that if changed, will require the game to be restarted for the change to take affect.

### Example
```java
@RequiresMcRestart
public static boolean overlayEnabled = false;
```
This will make the game require a restart if the value is changed in the configs menu.

@RequiresWorldRestart Use
-------------------------

This will force the game to be restarted if the config is changed in the mod options menu.

### Example
```java
@RequiresWorldRestart
public static boolean someOtherworldlyThing = false;
```
This will force the world to be restarted if the config is changed in the mod options menu.

Nested Configs
--------------
A Nested config is possible like this:
```java
@Config(modid = "modid")
public class Configs {
  public static NestedConfig nestedConfig = new NestedConfig();
  
  public static class NestedConfig {
    public String message = "Don't go that way";
  }
}
```

Sub Categories
--------------
A Sub Category can be setup like this:
```java
@Config(modid = "modid")
public class Configs {
    public static SubCategory subcat = new SubCategory(59);

    public static class SubCategory {
      @Config.RangeInt(min = 0, max = 1000)
      @Config.Comment("This is the FE/t used by the thing")
      public int feForTheThing; 

      public SubCategory(int defaultFE) {
        feForTheThing = defaultFE;
    }
}
```

[basics]: #Basics
[configuse]: #@Config-Use
[commentuse]: #@Comment-Use
[nameuse]: #@Name-Use
[rangeintuse]: #@RangeInt-Use
[rangedoubleuse]: #@RangeDouble-Use
[langkeyuse]: #@LangKey-Use
[requiresmcrestartuse]: #@RequiresMcRestart-Use
[requiresworldrestartuse]: #@RequiresWorldRestart-Use
[forgetest]: https://github.com/MinecraftForge/MinecraftForge/blob/1.12.x/src/test/java/net/minecraftforge/debug/ConfigTest.java
[nestedconfigs]: #Nested-Configs
[subcategories]: #Sub-Categories