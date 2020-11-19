Getting Started with Forge
==========================

This is a simple guide to get you from nothing to a basic mod. The rest of this documentation is about where to go from here.

From Zero to Modding
--------------------

1. Obtain the MCForge Development Kit (MDK) from forge's [files][] site. (Look for the MDK file type)
2. Extract the downloaded MDK an empty directory. You should see a bunch of files, and an example mod is placed in `src/main/java` for you to look at. Only a few of these files are strictly necessary for mod development, and you may reuse these files for all your projects These files are:
    * `build.gradle`
    * `gradlew.bat`
    * `gradlew`
    * the `gradle` folder
3. Move the files listed above to a new folder, this will be your mod project folder.
4. Choose your IDE:
    * Forge explicitly supports developing with Eclipse or IntelliJ environments, but any environment, from Netbeans to vi/emacs, can be made to work.
    * For both Intellij IDEA and Eclipse their Gradle integration will handle the rest of the initial workspace setup, this includes downloading packages from Mojang, MinecraftForge, and a few other software sharing sites.
    * For most, if not all, changes to the build.gradle file to take effect Gradle will need to be invoked to re-evaluate the project, this can be done through Refresh buttons in the Gradle panels of both the previously mentioned IDEs.
5. Generating IDE Launch/Run Configurations:
    * For Eclipse, run the `genEclipseRuns` gradle task (`gradlew genEclipseRuns`). This will generate the Launch Configurations and download any required assets for the game to run. After this has finished refresh your project.
    * For IntelliJ, run the `genIntellijRuns` gradle task (`gradlew genIntellijRuns`). This will generate the Run Configurations and download any required assets for the game to run. After this has finished edit your Configurations to fix the "module not specified" error by changing selecting your "main" module.

Customizing Your Mod Information
--------------------------------

Edit the `build.gradle` file to customize how your mod is built (the file names, versions, and other things).

!!! important

    **Do not** edit the `buildscript {}` section of the build.gradle file, its default text is necessary for ForgeGradle to function.

Almost anything underneath the `// Only edit below this line, the above code adds and enables the necessary things for Forge to be setup.` marker can be changed, many things can be removed and customized there as well.


[files]: https://files.minecraftforge.net "Forge Files distribution site"

### Simple `build.gradle` Customizations

These customizations are highly recommended for all projects.

* To change the name of the file you build - edit the value of `archivesBaseName` to suit.
* To change your "maven coordinates" - edit the value of `group` as well.
* To change the version number - edit the value of `version`.
* To update the run configurations - replace all occurrences of `examplemod` to the mod id of your mod.

Building and Testing Your Mod
-----------------------------

1. To build your mod, run `gradlew build`. This will output a file in `build/libs` with the name `[archivesBaseName]-[version].jar`. This file can be placed in the `mods` folder of a forge enabled Minecraft setup, and distributed.
2. To test run with your mod, the easiest way is to use the run configs that were generated when you set up your project. Otherwise, you can run `gradlew runClient`. This will launch Minecraft from the `<runDir>` location, including your mod code. There are various customizations to this command. Consult the [ForgeGradle cookbook][] for more information.
3. You can also run a dedicated server using the server run config, or `gradlew runServer`. This will launch the Minecraft server with its GUI.

!!! note

    It is always advisable to test your mod in a dedicated server environment if it is intended to run there.
    
