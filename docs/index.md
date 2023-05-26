ForgeGradle Documentation
=========================

This is the official documentation for [ForgeGradle], a [Gradle] plugin for developing [MinecraftForge] and mods using MinecraftForge.

This documentation is _only_ for ForgeGradle, **this is not a Java, Groovy, or Gradle tutorial**.

If you would like to contribute to the docs, read [Contributing to the Docs][contributing].

Adding the Plugin
-----------------

ForgeGradle uses Gradle 8; it can be added using the `plugins` block in the `build.gradle` by adding the following information to the `settings.gradle`:

```gradle
// In settings.gradle
pluginManagement {
    repositories {
        // ...

        // Add the MinecraftForge maven
        maven { url = 'https://maven.minecraftforge.net/' }
    }
}

plugins {
    // Add toolchain resolver
    id 'org.gradle.toolchains.foojay-resolver-convention' version '0.5.0'
}
```

```gradle
// In build.gradle
plugins {
    // Add the ForgeGradle plugin
    id 'net.minecraftforge.gradle' version '[6.0,6.2)'

    // ...
}
```

[ForgeGradle]: https://github.com/MinecraftForge/ForgeGradle
[Gradle]: https://gradle.org/
[MinecraftForge]: https://github.com/MinecraftForge/MinecraftForge
[contributing]: ./contributing.md
