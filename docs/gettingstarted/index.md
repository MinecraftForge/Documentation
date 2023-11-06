Getting Started with Forge
==========================

This is a simple guide to get you from nothing to a basic mod. The rest of this documentation is about where to go from here.

From Zero to Modding
--------------------

1. Obtain a source distribution from forge's [files][] site. (Look for the MDK file type)
2. Extract the downloaded source distribution to an empty directory. You should see a bunch of files, and an example mod is placed in `src/main/java` for you to look at. Only a few of these files are strictly necessary for mod development, and you may reuse these files for all your projects These files are:
    * `build.gradle`
    * `gradlew.bat`
    * `gradlew`
    * the `gradle` folder
3. Move the files listed above to a new folder, this will be your mod project folder.
4. Choose your IDE:
* For both Intellij IDEA and Eclipse their Gradle integration will handle the rest of the initial workspace setup, this includes downloading packages from Mojang, MinecraftForge, and a few other software sharing sites.
    * For most, if not all, changes to the build.gradle file to take effect Gradle will need to be invoked to re-evaluate the project, this can be done through Refresh buttons in the Gradle panels of both the previously mentioned IDEs.

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


