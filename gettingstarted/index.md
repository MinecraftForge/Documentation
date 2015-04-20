# Getting started with Forge

## From Zero to modding
1. Obtain a source distribution from files.minecraftforge.net.
2. Extract the source distribution to an empty directory. You should see a bunch of files, and an example mod is placed in src/main/java for you to look at.
3. Run gradlew setupDecompWorkspace. This will download a bunch of artifacts from the internet needed to decompile and build minecraft and forge. This might take some time, as it will download stuff and then decompile minecraft. Note that, in general, these things will only need to be downloaded and decompiled once, unless you delete the gradle artifact cache.
4. Choose your IDE: Forge supports developing with eclipse or Intellij environments (though you can import artifacts into other environments as well, and can certainly edit your mod code however you wish - from cat >>mymodfile to vi to emacs).
  1. For eclipse, you should run gradlew eclipse - this will download some more artifacts for building eclipse projects and then place the eclipse project artifacts in your current directory.
  2. For IntelliJ, you should run gradlew idea - this will download artifacts for building intellij IDEA projects, and place an IntelliJ project in the current directory.
5. Load your project into your IDE.
  1. For Eclipse, use Import | Existing Projects into Workspace and import from the directory you ran gradlew eclipse in.
  2. For IntelliJ do something else...
6. Edit the sample code, or import your existing mod code, or create your new mod.

## Customizing your mod information
Edit the build.gradle file to customize how your mod is built (the file names, versions, and other things). DO NOT edit the "buildscript {}" section of the build.gradle file - this is special. Almost anything underneath "apply project: forge" and "#EDIT BELOW HERE" marker can be changed, many things can be removed and customized. There is a whole site dedicated to editing the forge build.gradle files.

###Simple customizations
These customizations are highly recommended for all projects

* To change the name of the file you build - edit "archivesBaseName" to suit.
* To change your "maven coordinates" - edit your "group" as well. 
* To change the version number - edit the "version" value.

## Building and testing your mod
1. To build your mod, run gradlew build. This will output a file in "build/libs" with the name "<archivesBaseName>-<version>.jar". This should load into a forge-enabled minecraft setup.
2. To test run with your mod, run gradlew runClient. This will launch minecraft from the current directory, including your mod code.
3. You can also run minecraft from within your IDE environment.
