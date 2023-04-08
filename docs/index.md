ForgeGradle Documentation
=========================

This is the official documentation for [ForgeGradle], a [Gradle] plugin for developing [MinecraftForge] and mods using MinecraftForge.

This documentation is _only_ for ForgeGradle, **this is not a Java, Groovy, or Gradle tutorial**.

If you would like to contribute to the docs, read [Contributing to the Docs][contributing].

Adding the Plugin
-----------------

ForgeGradle can be added using the `plugins` block by adding the MinecraftForge maven to the available plugin repositories:

```gradle
// In settings.gradle
pluginManagement {
    repositories {
        // ...

        // Add the MinecraftForge maven
        maven { url = 'https://maven.minecraftforge.net/' }
    }
}
```

```gradle
// In build.gradle
plugins {
    // Add the ForgeGradle plugin
    id 'net.minecraftforge.gradle' version '5.1.+'

    // ...
}
```

[ForgeGradle]: https://github.com/MinecraftForge/ForgeGradle
[Gradle]: https://gradle.org/
[MinecraftForge]: https://github.com/MinecraftForge/MinecraftForge
[contributing]: ./contributing.md
