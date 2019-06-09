Getting Started with Forge
==========================

This is a simple guide to get you from nothing to a basic mod. The rest of this documentation is about where to go from here.

From Zero to Modding
--------------------

1. Obtain a source distribution from Forge's [files][] site. (Look for the mdk file type, or src in older 1.8/1.7 versions).
2. Extract the downloaded source distribution to an empty directory. You should see a bunch of files, and an example mod is placed in `src/main/java` for you to look at. Only a few of these files are strictly necessary for mod development, and you may reuse these files for all your projects. These files are:
    * `build.gradle`
    * `gradlew.bat`
    * `gradlew`
    * the `gradle` folder
3. Move the files listed above to a new folder, this will be your mod project folder.
4. Choose your IDE: Forge explicitly supports developing with Eclipse or IntelliJ environments, but any environment, from Netbeans to vi/emacs, can be made to work.
    * For Eclipse or IntelliJ, follow the next configuration guides for your respective IDE:

[files]: https://files.minecraftforge.net "Forge Files distribution site"

The following configuration guides assume that you have created the project folder, as described in the steps 1 to 3 of the section above, and have selected to use either Eclipse or IntelliJ as your chosen IDE (step 4). Because of that, the numbering starts at 5.

### IntelliJ IDEA Configuration

5. Launch IntelliJ and choose to open/import the `build.gradle` file, using the default gradle wrapper choice. While you wait for this process to finish, you can open the gradle panel, which will get filled with the gradle tasks once importing, and indexing, is completed.
6. You can now generate the IntelliJ specific run configurations, based on the `runs` section in the `build.gradle`, for launching the Minecraft client and server. This can be done in either of the following ways:
    * Using IntelliJ's built-in gradle features - simply to right of the screen `Gradle > <Project Name> > Tasks > fg_runs > genIntellijRuns`.
    * Open up a terminal, Command Prompt or PowerShell in Windows, making sure the current working directory is the folder created in step 3, and running the `gradlew genIntellijRuns` command.

### Eclipse Configuration

5. Open up a terminal, Command Prompt or PowerShell in Windows, and make sure the current working directory is the folder created in step 3.
6. Run the `gradlew eclipse` command - this will download the required artifacts for building eclipse projects.
7. Run the `gradlew genEclipseRuns` command - this will generate the Eclipse specific run configurations, based on the `runs` section in the `build.gradle`, for launching the Minecraft client and server.
8. You are now ready to launch Eclipse and import the folder as an existing project.

If all the steps worked correctly, you should now be able to choose the Minecraft run tasks from the dropdown, and then click the Run/Debug buttons to test your setup.

Customizing Your Mod Information
--------------------------------

Edit the `build.gradle` file to customize how your mod is built (the file names, versions, and other things).

!!! Important

    **Do not** edit the `buildscript {}` section of the build.gradle file, its default text is necessary for ForgeGradle to function.

Almost anything underneath `apply plugin: 'net.minecraftforge.gradle'`, and the `// Only edit below this line` marker, can be changed; many things can be removed and customized there as well.

There is a whole site dedicated to customizing the forge `build.gradle` files - the [ForgeGradle CookBook][]. Once you're comfortable with your mod setup, you'll find many useful recipes there.

[forgegradle cookbook]: https://forgegradle.readthedocs.org/en/latest/cookbook/ "The ForgeGradle CookBook"

### Simple `build.gradle` Customizations

These customizations are highly recommended for all projects.

* To change the name of the file you build - edit the value of `archivesBaseName` to suit.
* To change your "maven coordinates" - edit the value of `group` as well.
* To change the version number - edit the value of `version`.

Building and Testing Your Mod
-----------------------------

1. To build your mod, run `gradlew build`. This will output a file in `build/libs` with the name `[archivesBaseName]-[version].jar`. This file can be placed in the `mods` folder of a forge enabled Minecraft setup, and distributed.
2. To test run with your mod, the easiest way is to use the run configs that were generated when you set up your project. Otherwise, you can run `gradlew runClient` to launch the Minecraft client, or `gradlew runServer` to launch the Minecraft server. To adjust the setup for these runs, or to create additional, consult the [ForgeGradle CookBook][] for more information.

!!! Note

    It is always advisable to test your mod in a dedicated server environment if it is intended to run there.
