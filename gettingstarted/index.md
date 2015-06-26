Getting Started with Forge
==========================

This is a simple guide to get you from nothing to a basic mod. The rest of this documentation is about where to go from here.

From Zero to modding
--------------------
1. Obtain a source distribution from forge's [files][] site. (Look for the Src file type).
[files]: http://files.minecraftforge.net "Forge Files distribution site"
2. Extract the downloaded source distribution to an empty directory. You should see a bunch of files, and an example mod is placed in `src/main/java` for you to look at.
3. Run `gradlew setupDecompWorkspace`. This will download a bunch of artifacts from the internet needed to decompile and build minecraft and forge. This might take some time, as it will download stuff and then decompile minecraft.
      Note that, in general, these things will only need to be downloaded and decompiled once, unless you delete the gradle artifact cache.
4. Choose your IDE: Forge supports developing with Eclipse or IntelliJ environments (though you can import artifacts into other environments as well, and can certainly edit your mod code however you wish - from `cat >>mymodfile` to vi to emacs).
    * For Eclipse, you should run `gradlew eclipse` - this will download some more artifacts for building eclipse projects and then place the eclipse project artifacts in your current directory.
    * For IntelliJ, you should run `gradlew idea` - this will download artifacts for building intellij IDEA projects, and place an IntelliJ project in the current directory.
5. Load your project into your IDE.
    * For Eclipse, use `Import | Existing Projects into Workspace` and import from the directory you extracted to.
    * For IntelliJ, do `File | Open` and open the .ipr file in the directory you extracted to.
6. Edit the sample code, or import your existing mod code, or create your new mod.

Customizing your mod information
--------------------------------
Edit the `build.gradle` file to customize how your mod is built (the file names, versions, and other things).

!!! important

    DO NOT edit the `buildscript {}` section of the build.gradle file - this is special.**

Almost anything underneath `apply project: forge` and the `// EDITS GO BELOW HERE` marker can be changed, many things can be removed and customized there as well.

There is a whole site dedicated to customizing the forge `build.gradle` files - the [ForgeGradle cookbook][]. Once you're comfortable with your mod setup, you'll find many useful recipes there.
[forgegradle cookbook]: https://forgegradle.readthedocs.org/en/latest/cookbook/ "The ForgeGradle cookbook"

###Simple `build.gradle` customizations
These customizations are highly recommended for all projects.

* To change the name of the file you build - edit the value of `archivesBaseName` to suit.
* To change your "maven coordinates" - edit the value of `group` as well.
* To change the version number - edit the value of `version`.

Building and testing your mod
-----------------------------
1. To build your mod, run `gradlew build`. This will output a file in `build/libs` with the name `<archivesBaseName>-<version>.jar`. This file can be placed in the `mods` folder of a forge enabled minecraft setup, and distributed.
2. To test run with your mod, run `gradlew runClient`. This will launch minecraft from the `<runDir>` location, including your mod code. There are various customizations to this command. Consult the [ForgeGradle cookbook][] for more information.
3. You can also run a dedicated server with `gradlew runServer`. This will launch the minecraft server with it's GUI. *It is always adviseable to test your mod in a dedicated server environment if it is intended to run there*.
4. You can also run minecraft from within your IDE environment:...
