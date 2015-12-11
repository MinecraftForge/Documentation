Getting Started with Forge
==========================

This is a simple guide to get you from nothing to a basic mod. The rest of this documentation is about where to go from here.

From Zero to modding
--------------------

1. Obtain a source distribution from forge's [files][] site. (Look for the Mdk file type, or Src in older 1.8/1.7 versions).
2. Extract the downloaded source distribution to an empty directory. You should see a bunch of files, and an example mod is placed in `src/main/java` for you to look at. Only a few of these files are strictly necessary for mod development:
    * `build.gradle`
    * `gradlew` (both `.bat` and `.sh`)
    * The `gradle` folder
    * You may reuse these files for all your projects.
3. Move the files listed above to a new folder, this will be your mod project folder.
4. Open up a command prompt in the folder you created in step (3), then run `gradlew setupDecompWorkspace`. This will download a bunch of artifacts from the internet needed to decompile and build Minecraft and forge. This might take some time, as it will download stuff and then decompile Minecraft.
      Note that, in general, these things will only need to be downloaded and decompiled once, unless you delete the gradle artifact cache.
5. Choose your IDE: Forge explicitly supports developing with Eclipse or IntelliJ environments, but any environment, from Netbeans to vi/emacs, can be made to work.
    * For Eclipse, you should run `gradlew eclipse` - this will download some more artifacts for building eclipse projects and then place the eclipse project artifacts in your current directory.
    * For IntelliJ, simply import the build.gradle file.
6. Load your project into your IDE.
    * For Eclipse, point your workspace to the `eclipse` folder that was created when you ran `gradle eclipse`.
    * For IntelliJ, you only need to create run configs. You can run `gradlew genIntellijRuns` to do this.

[files]: http://files.minecraftforge.net "Forge Files distribution site"

Customizing your mod information
--------------------------------
Edit the `build.gradle` file to customize how your mod is built (the file names, versions, and other things).

!!! important

    DO NOT edit the `buildscript {}` section of the build.gradle file, its default text is necessary for ForgeGradle to function.

Almost anything underneath `apply project: forge` and the `// EDITS GO BELOW HERE` marker can be changed, many things can be removed and customized there as well.

There is a whole site dedicated to customizing the forge `build.gradle` files - the [ForgeGradle cookbook][]. Once you're comfortable with your mod setup, you'll find many useful recipes there.
[forgegradle cookbook]: https://forgegradle.readthedocs.org/en/latest/cookbook/ "The ForgeGradle cookbook"

### Simple `build.gradle` customizations
These customizations are highly recommended for all projects.

* To change the name of the file you build - edit the value of `archivesBaseName` to suit.
* To change your "maven coordinates" - edit the value of `group` as well.
* To change the version number - edit the value of `version`.

Building and testing your mod
-----------------------------
1. To build your mod, run `gradlew build`. This will output a file in `build/libs` with the name `[archivesBaseName]-[version].jar`. This file can be placed in the `mods` folder of a forge enabled Minecraft setup, and distributed.
2. To test run with your mod, the easist way is to use the run configs that were generated when you set up your project. Otherwise, you can run `gradlew runClient`. This will launch Minecraft from the `<runDir>` location, including your mod code. There are various customizations to this command. Consult the [ForgeGradle cookbook][] for more information.
3. You can also run a dedicated server using the server run config, or `gradlew runServer`. This will launch the Minecraft server with it's GUI.

!!! note

    It is always adviseable to test your mod in a dedicated server environment if it is intended to run there.
