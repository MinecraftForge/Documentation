Getting Started with Forge
==========================

This is a simple guide to get you from nothing to a basic mod. The rest of this documentation is about where to go from here.

From Zero to Modding
--------------------

1. Obtain a Java 8 Development Kit (JDK) and a 64-bit Java Virtual Machine (JVM). Minecraft and MinecraftForge both compile against Java 8 and as such should be used for development. Using a 32-bit JVM will result in some problems when running the below gradle tasks. You can obtain one from [AdoptOpenJDK][jdk].
2. Obtain the Mod Development Kit (MDK) from Forge's [files][] site.
3. Extract the downloaded MDK into an empty directory. You should see a bunch of files along with an example mod placed in `src/main/java` for you to look at. Only a few of these files are strictly necessary for mod development, and you may reuse these files for all your projects. These files are:
    * `build.gradle`
    * `gradlew.bat`
    * `gradlew`
    * the `gradle` folder
4. Move the files listed above to a new folder. This will be your mod project folder.
5. Choose your IDE:
    * Forge only explicitly supports developing with Eclipse, but there are additional run tasks for IntelliJ IDEA or Visual Studio Code environments. However, any environment, from Netbeans to vim/emacs, can be made to work.
    * For both Intellij IDEA and Eclipse, their Gradle integration will handle the rest of the initial workspace setup. This includes downloading packages from Mojang, MinecraftForge, and a few other software sharing sites. For VSCode, the 'Gradle Tasks' plugin can be used to handle the initial workspace setup.
    * For most, if not all, changes to the build.gradle file to take effect, Gradle will need to be invoked to re-evaluate the project. This can be done through 'Refresh' buttons in the Gradle panels of both of the previously mentioned IDEs.
6. Generating IDE Launch/Run Configurations:
    * For Eclipse, run the `genEclipseRuns` gradle task (`gradlew genEclipseRuns`). This will generate the Launch Configurations and download any required assets for the game to run. After this has finished, refresh your project.
    * For IntelliJ, run the `genIntellijRuns` gradle task (`gradlew genIntellijRuns`). This will generate the Run Configurations and download any required assets for the game to run. If you encounter an error saying "module not specified", you can either edit the configuration to select your "main" module or specify it through the `ideaModule` property.
    * For VSCode, run the `genVSCodeRuns` gradle task (`gradlew genVSCodeRuns`). This will generate the Launch Configurations and download any required assets for the game to run.

[files]: https://files.minecraftforge.net "Forge Files distribution site"
[jdk]: https://adoptopenjdk.net/?variant=openjdk8&jvmVariant=hotspot "AdoptOpenJdk 8 Prebuilt Binaries"

Customizing Your Mod Information
--------------------------------

Edit the `build.gradle` file to customize how your mod is built (the file names, versions, and other things).

!!! important

    **Do not** edit the `buildscript {}` section of the build.gradle file, its default text is necessary for ForgeGradle to function.

Almost anything underneath `apply project: forge` and the `// EDITS GO BELOW HERE` marker can be changed, many things can be removed and customized there as well.

There is a whole site dedicated to customizing the forge `build.gradle` files - the [ForgeGradle cookbook][]. Once you're comfortable with your mod setup, you'll find many useful recipes there.

[forgegradle cookbook]: https://forgegradle.readthedocs.org/en/latest/cookbook/ "The ForgeGradle cookbook"

### Simple `build.gradle` Customizations

These customizations are highly recommended for all projects.

* To change the name of the file you build - edit the value of `archivesBaseName` to suit.
* To change your "maven coordinates" - edit the value of `group` as well.
* To change the version number - edit the value of `version`.

Building and Testing Your Mod
-----------------------------

1. To build your mod, run `gradlew build`. This will output a file in `build/libs` with the name `[archivesBaseName]-[version].jar`. This file can be placed in the `mods` folder of a forge enabled Minecraft setup, and distributed.
2. To test run with your mod, the easiest way is to use the run configs that were generated when you set up your project. Otherwise, you can run `gradlew runClient`. This will launch Minecraft from the `<runDir>` location, including your mod code. There are various customizations to this command. Consult the [ForgeGradle cookbook][] for more information.
3. You can also run a dedicated server using the server run config, or `gradlew runServer`. This will launch the Minecraft server with its GUI.

!!! note

    It is always advisable to test your mod in a dedicated server environment if it is intended to run there.
