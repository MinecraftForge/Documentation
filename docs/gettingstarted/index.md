Getting Started with Forge
==========================

If you have never made a Forge mod before, this section will provide the minimum amount of information needed to setup a Forge development environment. The rest of the documentation is about where to go from here.

Prerequisites
-------------

* An installation of the Java 17 Development Kit (JDK) and 64-bit Java Virtual Machine (JVM). Forge recommends and officially supports [Eclipse Temurin][jdk].

    !!! warning
        Make sure you are using a 64-bit JVM. One way of checking is to run `java -version` in a terminal. Using a 32-bit JVM will cause some problems when using [ForgeGradle].

* Familiarity with an Integrated Development Environment (IDE).
    * It is recommended to use an IDE with Gradle integration.

From Zero to Modding
--------------------

1. Download the Mod Developer Kit (MDK) from the [Forge file site][files] by clicking 'Mdk' followed by the 'Skip' button in the top right after waiting for a period of time. It is recommended to download the latest version of Forge whenever possible.
1. Extract the downloaded MDK into an empty directory. This will be your mod's directory, which should now contain some gradle files and a `src` subdirectory containing the example mod.

    !!! note
        A number of files can be reused across different mods. These files are:

        * the `gradle` subdirectory
        * `build.gradle`
        * `gradlew`
        * `gradlew.bat`
        * `settings.gradle`

        The `src` subdirectory does not need to be copied across workspaces; however, you may need to refresh the Gradle project if the java (`src/main/java`) and resource (`src/main/resources`) are created later.

1. Open your selected IDE:
    * Forge only explicitly supports development on Eclipse and IntelliJ IDEA, but there are additional run configurations for Visual Studio Code. Regardless, any environment, from Apache NetBeans to Vim / Emacs, can be used.
    * Eclipse and IntelliJ IDEA's Gradle integration, both installed and enabled by default, will handle the rest of the initial workspace setup on import or open. This includes downloading the necessary packages from Mojang, MinecraftForge, etc. The 'Gradle for Java' plugin is needed for Visual Studio Code to do the same.
    * Gradle will need to be invoked to re-evaluate the project for almost all changes to its associated files (e.g., `build.gradle`, `settings.gradle`, etc.). Some IDEs come with 'Refresh' buttons to do this; however, it can be done through the terminal via `gradlew`.
1. Generate run configurations for your selected IDE:
    * **Eclipse**: Run the `genEclipseRuns` task.
    * **IntelliJ IDEA**: Run the `genIntellijRuns` task. If a "module not specified" error occurs, set the [`ideaModule` property][config] to your 'main' module (typically `${project.name}.main`).
    * **Visual Studio Code**: Run the `getVSCodeRuns` task.
    * **Other IDEs**: You can run the configurations directly using `gradle run*` (e.g., `runClient`, `runServer`, `runData`, `runGameTestServer`). These can also be used with the supported IDEs.

Customizing Your Mod Information
--------------------------------

Edit the `build.gradle` file to customize how your mod is built (e.g., file name, artifact version, etc.).

!!! important
    Do **not** edit the `settings.gradle` unless you know what you are doing. The file specifies the repository that [ForgeGradle] is uploaded to.

### Recommended `build.gradle` Customizations

#### Mod Id Replacement

Replace all occurrences of `examplemod`, including [`mods.toml` and the main mod file][modfiles] with the mod id of your mod. This also includes changing the name of the file you build by setting `base.archivesName` (this is typically set to your mod id).

```gradle
// In some build.gradle
base.archivesName = 'mymod'
```

!!! note
    The Forge MDK currently uses `archivesBaseName` to set the artifact name instead of `base.archivesName`. We recommend using `base.archivesName` instead as `archivesBaseName` is deprecated for removal in Gradle 9, which a future version of ForgeGradle will support.

    You can still use `archivesBaseName` by setting the following:

    ```gradle
    // In some build.gradle
    base.archivesName = 'mymod'
    ```

#### Group Id

The `group` property should be set to your [top-level package][packaging], which should either be a domain you own or your email address:

Type      | Value             | Top-Level Package
:---:     | :---:             | :---
Domain    | example.com       | `com.example`
Subdomain | example.github.io | `io.github.example`
Email     | example@gmail.com | `com.gmail.example`

```gradle
// In some build.gradle
group = 'com.example'
```

The packages within your java source (`src/main/java`) should also now conform to this structure, with an inner package representing the mod id:

```text
com
- example (top-level package specified in group property)
  - mymod (the mod id)
    - MyMod.java (renamed ExampleMod.java)
```

#### Version

Set the `version` property to the current version of your mod. We recommend using a [variation of Maven versioning][mvnver].

```gradle
// In some build.gradle
version = '1.19.4-1.0.0.0'
```

### Additional Configurations

Additional configurations can be found on the [ForgeGradle] docs.

Building and Testing Your Mod
-----------------------------

1. To build your mod, run `gradlew build`. This will output a file in `build/libs` with the name `[archivesBaseName]-[version].jar`, by default. This file can be placed in the `mods` folder of a Forge-enabled Minecraft setup or distributed.
1. To run your mod in a test environment, you can either use the generated run configurations or use the associated tasks (e.g. `gradlew runClient`). This will launch Minecraft from the run directory (default 'run') along with any source sets specified. The default MDK includes the `main` source set, so any code written in `src/main/java` will be applied.
1. If you are running a dedicated server, whether through the run configuration or `gradlew runServer`, the server will initially shut down immediately. You will need to accept the Minecraft EULA by editing the `eula.txt` file in the run directory. Once accepted, the server will load, which can then be accessed via a direct connect to `localhost`.

!!! note
    You should always test your mod in a dedicated server environment. This includes [client-only mods][client] as they should not do anything when loaded on the server.

[jdk]: https://adoptium.net/temurin/releases?version=17 "Eclipse Temurin 17 Prebuilt Binaries"
[ForgeGradle]: https://docs.minecraftforge.net/en/fg-5.x

[files]: https://files.minecraftforge.net "Forge Files distribution site"
[config]: https://docs.minecraftforge.net/en/fg-5.x/configuration/runs/

[modfiles]: ./modfiles.md
[packaging]: ./structuring.md#packaging
[mvnver]: ./versioning.md
[client]: ../concepts/sides.md#writing-one-sided-mods
