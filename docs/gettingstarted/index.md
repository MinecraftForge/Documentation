Getting Started with ForgeGradle
================================

If you have never used ForgeGradle before, here is the minimum amount of information needed to get a development environment setup.

#### Prerequisites

* An installation of the Java Development Kit (JDK)

Minecraft Versions | Java Development Kit Version
:---:              | :---:
1.12 - 1.16        | [JDK 8][jdk8]
1.17               | [JDK 16][jdk16]
1.18 - 1.19        | [JDK 17][jdk17]

* Familiarity with an Integrated Development Environment (IDE)
    * It is preferable to use one with some form of Gradle integration

## Setting Up ForgeGradle

1. First download a copy of the [Modder Development Kit (MDK)][mdk] from MinecraftForge and extract the zip to an empty directory.
1. Open the directory you extracted the MDK to within your IDE of choice. If your IDE integrates with Gradle, import it as a Gradle project.
1. Customize your Gradle buildscript for your mod:
    1. Set `archivesBaseName` to the desired mod id. Additionally, replace all occurrences of `examplemod` with the mod id as well.
    1. Change the `group` to your desired package name. Make sure to follow existing [naming conventions][group].
    1. Change the `version` number to reflect the current version of your mod. It is highly recommended to use [Forge's extension on semantic versioning][semver].


!!! important
    Make sure that any changes to the mod id are reflected in the mods.toml and main mod class. See [Structuring Your Mod][structuring] on the Forge docs for more information.

4. Reload or refresh your Gradle project using your IDE. If your IDE does not have Gradle integration, run the following from a shell in your project's directory:

```sh
./gradlew build --refresh-dependencies
```

5. If your IDE is either Eclipse, IntelliJ IDEA, or Visual Studio Code, you can generate run configurations using one of the following commands, respectively:

#### Eclipse

```sh
./gradlew genEclipseRuns
```

#### IntelliJ IDEA

```sh
./gradlew genIntellijRuns
```

#### Visual Studio Code

```sh
./gradlew genVSCodeRuns
```

You can the run the client, server, etc. using one of the generated run configurations.

!!! tip
    If your IDE is not listed, you can still run the configurations using `./gradlew run*` (e.g., `runClient`, `runServer`, `runData`). You can use these commands with the supported IDEs as well.

Congratulations, now you have a development environment set up!


[jdk8]: https://adoptium.net/temurin/releases/?version=8
[jdk16]: https://adoptium.net/temurin/releases/?version=16
[jdk17]: https://adoptium.net/temurin/releases/?version=17

[mdk]: https://files.minecraftforge.net/
[group]: https://docs.oracle.com/javase/tutorial/java/package/namingpkgs.html
[semver]: https://docs.minecraftforge.net/en/latest/gettingstarted/versioning/
[structuring]: https://docs.minecraftforge.net/en/latest/gettingstarted/structuring/
