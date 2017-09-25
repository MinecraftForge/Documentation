Configuration Annotations
=========================

The 1.12.x version of Minecraft Forge introduced novel mod configuration system based on annotations. This new system relies on Forge ASM as to automatically discover mod configuration classes and their respective configurable fields as to make working with configurations as easy as possible. Ideally this new system will encourage the standard implementation of mod configurations as to afford end-users with maximally configurable modded Minecraft experiences.


Basics
-------------------------

The annotation-based configuration system revolves around the `@Config` annotation, found in the `net.minecraftforge.common.config` package of Minecraft Forge. The `@Config` annotation is intended to be applied to any class that contains user-configurable fields, requiring only the id of the mod that owns the configuration for basic usage. Following the application of the `@Config` annotation to a configuration class, Forge will then resolve and manage any `public static` fields in the class as configuration elements.

!!! important

    There is currently no way to have Forge ignore a `public static` field in a `@Config` class, so make sure not to place any non-user configurable `public static`

Consequently, the simplest possible usage of the annotation-based configuration system would be as follows.

````Java
@Config(modid = "my_mod_id")
public class MyModConfig {

  public static boolean myBooleanSetting = false;

}
````

The prior usage would then create a boolean property `general.myBooleanSetting` with a default value of `false` in a configuration file named `my_mod_id.conf` which is managed by Forge.

Whereas the prior example used only the Java primitive `boolean`, the annotation-based configuration system will accept all Java primitives, and their respective boxed forms. Furthermore, the annotation system is additionally capable of accepting `String` and `enum` values.

!! important

    By default the annotation-based configuration system loads all mod configurations exactly once, directly after the mod is constructed but before the mod enters pre-initialization.


Comments
-------------------------

Often, despite our best efforts in naming, the property key alone does not do justice in describing the function of a given configuration property. In this case, or moreso in general it would be nice as to be able to give the end-user more information as to what a configuration element actually does. For this reason, the `@Comment` annotation was created.

The `@Comment` annotation is simple to use, as it may be applied directly to any valid field inside a `@Config` class as to add either a single line, or a multi-line comment. Extending the prior example usage of the `@Config` annotation:

````Java
@Config(modid = "my_mod_id")
public class MyModConfig {

  @Comment("This is a lovely single-line comment.")
  public static boolean myPropertyWithSingleLineComment = false;

  @Comment({"Whereas this,", "is a multi-line comment"})
  public static boolean myPropertyWithMultiLineComment = false;

}
````

!!! note

    Single-line comments, having only one string value set in the annotation, do not require (but will accept) surrounding brackets unlike multi-line comments that require surrounding brackets.

!!! important

    It is strongly recommended that you do not use the newline character `\n` (or platform-specific equivalents) in comments, and instead use the multi-line `@Comment` annotation form, as Forge will then be able to ensure the proper handling of the multi-line comment.

Property Ranges
-------------------------

While when using boolean configuration properties all possible input values are considered valid, in the case of numeric inputs there may arise the need as to constrain the acceptable inputs to a certain continuous range. For this reason, the annotations `@RangeInt` and `@RangeDouble` exist.

The `@Range` annotations consist of two values, a minimum value and a maximum value, which together define an inclusive range of acceptable inputs for a given numeric property. Note, that inclusive means that the values set for `min` and `max` are considered valid inputs for the property. If either min or max are not set, then the annotation will default to `<? extends Number>.MIN_VALUE` and `<? extends Number>.MAX_VALUE` respectively.

Building off the prior examples a sample usage of the `@RangeInt` and `@RangeDouble` would be as follows.

````Java
@Config(modid = "my_mod_id")
public class MyModConfig {

  @Comment("This integer property accepts values 1 to 10 inclusive.")
  @RangeInt(min = 1, max = 10)
  public static int myIntegerProperty = false;

  @Comment("This double property accepts values 0.0 to 1.0 inclusive.")
  @RangeDouble(min = 0.0, max = 1.0)
  public static double myDoubleProperty = false;

}
````

!! important

    While both the `@RangeInt` and `@RangeDouble` accept a min and a max value to be set they are not interchangeable, given that the type must match. Consequently the `@RangeInt` annotation is only to be applied to `int` and `Integer` fields, and the `@RangeDouble` is only to be applied to `double` and `Double` fields.

!! important

    There currently exists no range annotations capable of supporting numeric types other than the aforementioned `int`, `Integer`, `double`, and `Double` types. As such, you are forced to use `int` instead of `byte` or `long`, `Integer` instead of `Byte` or `Long`, `double` instead of `float`, and `Double` instead of `Float`. This issue will likely be fixed in a future release given wide enough adoption of the new annotation-based configuration system.


Sub-categories
-------------------------

Smaller mods will generally have fewer properties (say about 5 - 10) and do not need to worry about dividing up their configurations into more manageable groups of properties for the end-user to manage. However, for larger mods configurations consisting of 20 to 50 elements is not all that uncommon, and the need for sub-categories becomes irrefutable. Recognizing such a need, the annotation-based configuration system provides a mechanism by which `@Config` classes can be divided into groups that are reflected directly in the structure of the `@Config` class.

The sub-division of `@Config` classes is accomplished by the addition of `public static` inner classes that act as the physical configuration groupings. Thus, any property that is placed in the inner class is then resolved by the system as not to exist in the default group defined by the `@Config` annotation but rather a new group with the name of the inner class.

Building upon the prior examples, an example usage of property grouping is as follows:

````Java
@Config(modid = "my_mod_id")
public class MyModConfig {

  @Comment("This property belongs to the default group.")
  public static boolean myPropertyDefaultGroup = false;

  public static class MyCategory {

    @Comment("This property belongs to the MyCategory group.")
    public static boolean myPropertyMyCategory = false;

  }

}
````


Alternate Names
-------------------------

Sometimes, for reasons unknown, we wind up with variable names in a configuration class that would be unsuitable for use as an actual property key. This would be problematic as Forge determines the property key based off of variable names. For this reason, the `@Name` annotation exists.

The name annotation allows for the convenient changing of the property's name from the default value inferred from the name of the variable to something that is deemed more suitable by the modder.

An example usage would be as follows:

````Java
@Config(modid = "my_mod_id")
public class MyModConfig {

  @Comment("This property would normally have a horrible name!")
  @Name("my_well_named_property")
  public static boolean MY_hoRibbliyNAMEdVairable = false;

}
````

!! Note

    If you are following conventional Java variable naming practices then the variables defined in your `@Config` class likely contain a great number of capital letters, as seen in the provided example usages (prior to the horribly named one). Since the Forge standard for registration names is all-lowercase, the default property names would therefore be unsuitable, and use of the `@Name` annotation is highly recommended.

    This behavior is partly an oversight and partly a technical limitation. Forge has no intention of punishing any modder who conforms to standard practices. Ideally future releases of Forge will automatically convert traditionally-named variables into conforming property names by replacing capital characters with respective lowercase characters preceded by the underscore character `_`.

!! Note

    The `@Name` annotation cannot currently be applied to a inner class grouping, an oversight which is likely to change in a future version of Forge.

Internationalization
-------------------------

Since the annotation-based configuration system ties into the in-game mod configuration menu, it becomes important to consider the need to display comments, property names, and category names in the native language of the end user. For this reason the `@LangKey` annotation exists. This annotation is similar to the `@Name` annotation, however, instead of changing the property name, it changes the key that is used for localization purposes. By default, without this annotation, Forge will attempt to localize a property or category for in-game display by using the element's fully-qualified name as the language key.

An example usage of the `@LangKey` is as follows:

````Java
@Config(modid = "my_mod_id")
public class MyModConfig {

  @Comment("This property has a non-default language key.")
  @LangKey("my_mod_id.some_other_category.my_international_property")
  public static boolean myInternationalProperty = false;

  @LangKey("my_mod_id.some_other_category")
  public static class MyCategory {

      /* ... */

  }

}
````

!! Important

    Applying this annotation to a category does not alter the language key of properties contained in that category.


Time Specific Properties
-------------------------

Occasionally in order for a property change to take effect, a mod may require either a complete restart of Minecraft/Forge or a restart of the world. This distinction is important, as a property may control whether or not a sub-module is loaded or not, and a sudden change in the value of the property might cause the system to go looking for an unloaded sub-module. Ideally, the sub-module could be loaded on-the-fly, but in the case of a sub-module that adds a block to the game, attempting to load the sub-module would cause an error as blocks can only be added during initialization phases. Consequently, there exists a need as to signal the configuration system as to hold off making a change to the value specific properties in a `@Config` class until either a world reload occurs or a game reload occurs. For this reason, the annotations `@RequiresWorldRestart` and `@RequiresMcRestart` exist.

The `@RequiresWorldRestart` annotation works by holding off applied changes to a configuration file until a world reload occurs, at which point the changes are then applied, and the world reloaded.

The `@RequiresMcRestart` annotation works by saving the configuration change to disk but not updating the field after the initial load of the configuration occurs. In this manner the change will be reflected at the next launch, but will not affect the current run instance.

An example usage of the two aforementioned annotations is as follows:

````Java
@Config(modid = "my_mod_id")
public class MyModConfig {

  @Comment("This property is always changeable!")
  public static boolean myAlwaysChangeableProperty = false;

  @Comment("This property is only changeable on world reloads!")
  @RequiresWorldRestart
  public static boolean myWorldReloadChangeableProperty = false;

  @Comment("This property is only changeable on Minecraft restarts!")
  @RequiresMcRestart
  public static boolean myMcReloadChangeableProperty = false;

}
````

!! Important

    Keep in mind that for installs including more than just one or two other mods can take a great deal of time to restart. As such you should try to make as many properties as possible changeable on the fly.

!! Important

    While this annotation can be applied to categories, it is strongly recommended that you do not, given that the overall goal should be to minimize the frequency of reloads, which take a long time.


The `@Config` Annotation in Detail
-------------------------

| Field         | Manditory     | Description
| ------------- | ------------- | -----------
| `modid`       | Yes           | The id of the mod that this configuration is associated with.
| `name`        | No            | The user-friendly name of the configuration file that this class represents. If this field is not set manually, it will default to the value set in the `modid` field.
| `type`        | No            | The 'type' of this configuration object, currently the only valid value is the default, `Type.INSTANCE`. More configuration types are to be expected in future releases.
| `category`    | No            | The 'root' category for all elements contained in this configuration object. If the field is not set manually, then it will default to `"general"`. Conversely, if the field is set to `""` the root category will be disabled, and all internal elements will need a category to be manually set with a different annotation (not recommended).

!! Important

    Setting `@Config.category = ""` requires that all properties in the class are wrapped in category definitions.
