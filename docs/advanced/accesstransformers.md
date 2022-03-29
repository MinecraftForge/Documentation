Access Transformers
===================

Access Transformers (ATs for short) allow for widening the visibility and modifying the `final` flags of classes, methods, and fields. They allow modders to access and modify otherwise inaccessible members in classes outside their control.

The [specification document][specs] can be viewed on the Minecraft Forge GitHub.

Adding ATs
----------

Adding an Access Transformer to your mod project is as simple as adding a single line into your `build.gradle`:

```groovy
// This block is where your mappings version is also specified
minecraft {
  accessTransformer = file('src/main/resources/META-INF/accesstransformer.cfg')
}
```

After adding or modifying the Access Transformer, the gradle project must be refreshed for the transformations to take effect.

During development, the AT file can be anywhere specified by the line above. However, when loading in a non-development environment, Forge will only search for the exact path of `META-INF/accesstransformer.cfg` in your JAR file.

Comments
--------

All text after a `#` until the end of the line will be treated as a comment and will not be parsed.

Access Modifiers
----------------

Access modifiers specify to what new member visibility the given target will be transformed to. In decreasing order of visibility:

* `public` - visible to all classes inside and outside its package
* `protected` - visible only to classes inside the package and subclasses
* `default` - visible only to classes inside the package
* `private` - visible only to inside the class

A special modifier `+f` and `-f` can be appended to the aforementioned modifiers to either add or remove respectively the `final` modifier, which prevents subclassing, method overriding, or field modification when applied.

!!! warning
    Directives only modify the method they directly reference; any overriding methods will not be access-transformed. It is advised to ensure transformed methods do not have non-transformed overrides that restrict the visibility, which will result in the JVM throwing an error.
    
    Examples of methods that can be safely transformed are `private` methods, `final` methods (or methods in `final` classes), and `static` methods.

Targets and Directives
----------------------

!!! important
    When using Access Transformers on Minecraft classes, the SRG name must be used for fields and methods.

### Classes
To target classes:
```
<access modifier> <fully qualified class name>
```
Inner classes are denoted by combining the fully qualified name of the outer class and the name of the inner class with a `$` as separator.

### Fields
To target fields:
```
<access modifier> <fully qualified class name> <field name>
```

### Methods
Targeting methods require a special syntax to denote the method parameters and return type:
```
<access modifier> <fully qualified class name> <method name>(<parameter types>)<return type>
```

#### Specifying Types

Also called "descriptors": see the [Java Virtual Machine Specification, SE 8, sections 4.3.2 and 4.3.3][jvmdescriptors] for more technical details.

* `B` - `byte`, a signed byte
* `C` - `char`, a Unicode character code point in UTF-16
* `D` - `double`, a double-precision floating-point value
* `F` - `float`, a single-precision floating-point value
* `I` - `integer`, a 32-bit integer
* `J` - `long`, a 64-bit integer
* `S` - `short`, a signed short
* `Z` - `boolean`, a `true` or `false` value
* `[` - references one dimension of an array
  * Example: `[[S` refers to `short[][]`
* `L<class name>;` - references a reference type
  * Example: `Ljava/lang/String;` refers to `java.lang.String` reference type _(note the use of slashes instead of periods)_
* `(` - references a method descriptor, parameters should be supplied here or nothing if no parameters are present
 * Example: `<method>(I)Z` refers to a method that requires an integer argument and returns a boolean
* `V` - indicates a method returns no value, can only be used at the end of a method descriptor
  * Example: `<method>()V` refers to a method that has no arguments and returns nothing

Examples
--------

```
# Makes public the ScreenConstructor class in MenuScreens
public net.minecraft.client.gui.screens.MenuScreens$ScreenConstructor

# Makes protected and removes the final modifier from 'random' in MinecraftServer
protected-f net.minecraft.server.MinecraftServer f_129758_ #random

# Makes public the 'makeExecutor' method in Util,
# accepting a String and returns an ExecutorService
public net.minecraft.Util m_137477_(Ljava/lang/String;)Ljava/util/concurrent/ExecutorService; #makeExecutor

# Makes public the 'leastMostToIntArray' method in SerializableUUID,
# accepting two longs and returning an int[]
public net.minecraft.core.SerializableUUID m_123274_(JJ)[I #leastMostToIntArray
```

[specs]: https://github.com/MinecraftForge/AccessTransformers/blob/master/FMLAT.md
[jvmdescriptors]: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.3.2
