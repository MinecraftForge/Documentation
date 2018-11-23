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
* [Sub Categories][subcategories]
* [@Ignore][ignoreuse]

Basics
------

A class annotated with `@Config` will have any fields turned into config options. Said fields can be annotated to add information, using the plethora of annotations provided in the `@Config` class.

!!! note

    Enum config values generate a comment that is as many lines long as the enum has values.

A good example of this system is [`Forge's Test`][forgetest]

@Config Use
-----------

This annotation is used to denote a class is the container for some configuration options. 

There are 4 properties:

|     Property|Type     | Default Value | Comment 
|           -:|:-       |     :-:       |:-
|        modid|`String` |     N/A       | The mod id that this configuration is associated with. 
|         name|`String` |     `""`      | A user friendly name for the config file, the default will be modid. 
|         type|`Type`   |`Type.INSTANCE`| The type this is, right now the only value is `Type.INSTANCE`. This is intended to be expanded upon later for more Forge controlled configs. 
|     category|`String` |  `"general"`  | Root element category. If this is an empty string then the root category is disabled. 

!!! important

    If you disable the root category, this will cause issues unless you create [Sub Categories][subcategories].

@Comment Use
------------

Adding a `@Comment` annotation to a field will add a comment to the config in its file. 

It has 1 property:

| Property|Type               | Default Value |Comment 
|       -:|:-                 |       :-:     |:-
|    value|`String[]`/`String`|       N/A     |The passed value will be converted to a `String[]` and for each element of the `String[]` a new line is added to the comment.

### Example
```java
@Comment({
  "You can add comments using this",
  "and if you supply an array it will be multi-line"
})
public static boolean doTheThing = true;
```
This would produce the following config:
```
# You can add comments using this
# and if you supply an array it will be multi-line
B:doTheThing=true   
``` 

@Name Use
---------

You should use the `@Name` annotation to give a config a user friendly name in the config file.

This has 1 property:

| Property | Type    | Default Value |
|        -:|:-       |      :-:      |
|     value|`String` |      N/A      | 

### Example
```java
@Name("FE/T for the thing")
public static int thingFE = 50; 
```
This will produce the following config:
```
I:"FE/T for the thing"=50
```

@RangeInt Use
-------------

You should use `@RangeInt` to limit an `int` or `Integer` config value. 

It has 2 properties:

| Property|Type   |    Default Value    |
|       -:|:-     |        :-:          |
|      min|`int`  | `Integer.MIN_VALUE` |
|      max|`int`  | `Integer.MAX_VALUE` |

### Example
```java
@RangeInt(min = 0) 
public static int thingFECapped = 50;
```
This will produce the following config:

```
# Min: 0
# Max: 2147483647
I:thingFECapped=50
```

@RangeDouble Use
----------------

You should use `@RangeDouble` to limit a `double` or `Double` config value. 

It has 2 properties:

| Property|Type     |    Default Value    
|       -:|:-       |        :-:         |
|      min|`double` | `Double.MIN_VALUE` |
|      max|`double` | `Double.MAX_VALUE` |

### Example
```java
@RangeDouble(min = 0, max = Math.PI) 
public static double chanceToDrop = 2;
```
This will produce the following config:
```
# Min: 0.0
# Max: 3.141592653589793
D:chanceToDrop=2.0
```

!!! note
  
    There is not currently (in 1.12.2) a `@RangedFloat` or `@RangedLong` or any other variant of the Ranged values. 

@LangKey Use
------------

If you want to add translations for your configs in the mod options menu, add to the config's field `@LangKey`.

This has 1 property:

| Property | Type    | Default Value |
|        -:|:-       |      :-:      |
|     value|`String` |      N/A      | 

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

This will force the world to be restarted if the config is changed in the mod options menu.

### Example
```java
@RequiresWorldRestart
public static boolean someOtherworldlyThing = false;
```
This will force the world to be restarted if the config is changed in the mod options menu.

Sub Categories
--------------
A Sub Category is a way to group certain (usually related) config options together, and should be used to help make navigating your config file easier. To create a Sub Category, you must make an object and add it as a static field in the parent category's class. The object's member fields will become configs in that Sub Category.

An example of how to setup a Sub Category:
```java
@Config(modid = "modid")
public class Configs {
  public static SubCategory subcat = new SubCategory();

  private static class SubCategory {
    public boolean someBool; 
    public int relatedInt;
  }
}
```
In the config file, this will produce the following:
```
subcat {
  B:someBool=false
  I:relatedInt=0
}
```

@Ignore Use
-----------
Adding the `@Ignore` annotation to a field in the config class will cause the `ConfigManager` to skip over it when processing your config file. 

!!! note

    This will only work on forge version 1.12.2-14.23.1.2602 and later, as the feature was added in [this update][ignoreupdate]

[basics]: #basics
[configuse]: #config-use
[commentuse]: #comment-use
[nameuse]: #name-use
[rangeintuse]: #rangeint-use
[rangedoubleuse]: #rangedouble-use
[langkeyuse]: #langkey-use
[requiresmcrestartuse]: #requiresmcrestart-use
[requiresworldrestartuse]: #requiresworldrestart-use
[ignoreuse]: #ignore-use
[forgetest]: https://github.com/MinecraftForge/MinecraftForge/blob/603903db507a483fefd90445fd2b3bdafeb4b5e0/src/test/java/net/minecraftforge/debug/ConfigTest.java
[ignoreupdate]: https://github.com/MinecraftForge/MinecraftForge/commit/ca7a5eadc05c427a21fb7ae745e5fd9a5d906267
[subcategories]: #sub-categories
