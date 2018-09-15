Getting Started with Forge
==========================

This is a simple guide to get you from nothing to a basic mod. The rest of this documentation is about where to go from here.

From Zero to Modding
--------------------

1. Obtain a source distribution from forge's [files][] site. (Look for the Mdk file type, or Src in older 1.8/1.7 versions).
2. Extract the downloaded source distribution to an empty directory. You should see a bunch of files, and an example mod is placed in `src/main/java` for you to look at. Only a few of these files are strictly necessary for mod development, and you may reuse these files for all your projects These files are:
    * `build.gradle`
    * `gradlew.bat`
    * `gradlew`
    * the `gradle` folder
3. Move the files listed above to a new folder, this will be your mod project folder.
4. Open up a command prompt in the folder you created in step (3), then run `gradlew setupDecompWorkspace`. This will download a bunch of artifacts from the internet needed to decompile and build Minecraft and forge. This might take some time, as it will download stuff and then decompile Minecraft. Note that, in general, these things will only need to be downloaded and decompiled once, unless you delete the gradle artifact cache.
5. Choose your IDE: Forge explicitly supports developing with Eclipse or IntelliJ environments, but any environment, from Netbeans to vi/emacs, can be made to work.
    * For Eclipse, you should run `gradlew eclipse` - this will download some more artifacts for building eclipse projects and then place the eclipse project artifacts in your current directory.
    * For IntelliJ, simply import the build.gradle file.
6. Load your project into your IDE.
    * For Eclipse, create a workspace anywhere (though the easiest location is one level above your project folder). Then simply import your project folder as a project, everything will be done automatically.
    * For IntelliJ, you only need to create run configs. You can run `gradlew genIntellijRuns` to do this.

!!! note

    In case you will receive an error while running the task `:decompileMC` ( the fourth step )

    ```
    Execution failed for task ':decompileMc'.
    GC overhead limit exceeded
    ```

    assign more RAM into gradle by adding `org.gradle.jvmargs=-Xmx2G` into the file `~/.gradle/gradle.properties` (create file if doesn't exist). The `~` sign means it's a user's [home directory][]    .


[home directory]: https://en.wikipedia.org/wiki/Home_directory#Default_home_directory_per_operating_system "Default user's home folder location for different operation systems"
[files]: https://files.minecraftforge.net "Forge Files distribution site"

Terminal-free IntelliJ IDEA configuration
------------------------------------------

These instructions assume that you have created the project folder as described in the steps 1 to 3 of the section above. Because of that, the numbering starts at 4.

4. Launch IDEA and choose to open/import the `build.gradle` file, using the default gradle wrapper choice. While you wait for this process to finish, you can open the gradle panel, which will get filled with the gradle tasks once importing is completed.
5. Run the `setupDecompWorkspace` task (inside the `forgegradle` task group). It will take a few minutes, and use quite a bit of RAM. If it fails, you can add `-Xmx3G` to the `Gradle VM options` in IDEA's gradle settings window, or edit your global gradle properties.
6. Once the setup task is done, you will want to run the `genIntellijRuns` task, which will configure the project's run/debug targets. 
7. After it's done, you should click the blue refresh icon **on the gradle panel** (there's another refresh icon on the main toolbar, but that's not it). This will re-synchronize the IDEA project with the Gradle data, making sure that all the dependencies and settings are up to date.
8. Finally, assuming you use IDEA 2016 or newer, you will have to fix the classpath module. Go to `Edit configurations` and in both `Minecraft Client` and `Minecraft Server`, change `Use classpath of module` to point to the task with a name like `<project>_main`.

If all the steps worked correctly, you should now be able to choose the Minecraft run tasks from the dropdown, and then click the Run/Debug buttons to test your setup.

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
3. You can also run a dedicated server using the server run config, or `gradlew runServer`. This will launch the Minecraft server with it's GUI.

!!! note

    It is always advisable to test your mod in a dedicated server environment if it is intended to run there.
