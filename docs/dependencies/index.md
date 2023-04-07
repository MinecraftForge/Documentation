Dependencies
============

Dependencies are not only used to develop interoperability between mods or add additional libraries to the game, but it also determines what version of Minecraft to develop for. This will provide a quick overview on how to modify the `repositories` and `dependencies` block to add dependencies to your development environment.

> This will not explain Gradle concepts in depth. It is highly recommended to read the [Gradle Dependency Management guide][guide] before continuing.

`minecraft`
-----------

The `minecraft` dependency specifies the version of Minecraft to use and must be included in the `dependencies` block. Any artifact, except artifacts which have the group `net.minecraft`, will apply any patches provided with the dependency. This typically only specifies the `net.minecraftforge:forge` artifact.

```gradle
dependencies {
    // Version of artifact is in the form '<mc_version>-<forge_version>'
    // 'mc_version' is the version of Minecraft to load (e.g., 1.19.4)
    // 'forge_version' is the version of Forge wanted for that Minecraft version (e.g., 45.0.23)
    minecraft 'net.minecraftforge:forge:1.19.4-45.0.23'
}
```

Mod Dependencies
----------------

In a typical development environment, Minecraft is deobfuscated to intermediate mappings, used in production, and then transformed into whatever [human-readable mappings][mappings] the modder specified. Mod artifacts, when built, are obfuscated to production mappings (SRG), and as such, are unable to be used directly as a Gradle dependency.

As such, all mod dependencies need to be wrapped with `fg.deobf` before being added to the intended configuration.

```gradle
dependencies {
    // Assume we have already specified the 'minecraft' dependency

    // Assume we have some artifact 'examplemod' that can be obtained from a specified repository
    implementation fg.deobf('com.example:examplemod:1.0')
}
```

### Local Mod Dependencies

If the mod you are trying to depend on is not available on a maven repository (e.g., [Maven Central][central], [CurseMaven], [Modrinth]), you can add a mod dependency using a [flat directory] instead:

```gradle
repositories {
    // Adds the 'libs' folder in the project directory as a flat directory
    flatDir {
        dir 'libs'
    }
}

dependencies {
    // ...

    // Given some <group>:<name>:<version>:<classifier (default None)>
    //   with an extension <ext (default jar)>
    // Artifacts in flat directories will be resolved in the following order:
    // - <name>-<version>.<ext>
    // - <name>-<version>-<classifier>.<ext>
    // - <name>.<ext>
    // - <name>-<classifier>.<ext>

    // This will search for a file in the following order:
    // - examplemod-1.0.jar
    // - examplemod-1.0-api.jar
    // - examplemod.jar
    // - examplemod-api.jar
    implementation fg.deobf('com.example:examplemod:1.0:api')
}
```

!!! note
    The group name can be anything but must not be empty for flat directory entries as they are not checked when resolving the artifact file.

Non-Minecraft Dependencies
--------------------------

Non-Minecraft dependencies are not loaded by Forge by default in the development environment. To get Forge to recognize the non-Minecraft dependency, they must be added to the `minecraftLibrary` configuration. `minecraftLibrary` works similarly to the `implementation` configuration within Gradle, being applied during compile time and runtime.

```gradle
dependencies {
    // ...

    // Assume there is some non-Minecraft library 'dummy-lib'
    minecraftLibrary 'com.dummy:dummy-lib:1.0'
}
```

> Non-Minecraft dependencies added to the development environment will not be included in built artifact by default! You must use [Jar-In-Jar][jij] to include the dependencies within the artifact on build.

[guide]: https://docs.gradle.org/7.6/userguide/dependency_management.html
[mappings]: ../configuration/index.md#human-readable-mappings

[central]: https://central.sonatype.com/
[CurseMaven]: https://cursemaven.com/
[Modrinth]: https://docs.modrinth.com/docs/tutorials/maven/

[flat]: https://docs.gradle.org/7.6/userguide/declaring_repositories.html#sub:flat_dir_resolver

[jij]: ./jarinjar.md
