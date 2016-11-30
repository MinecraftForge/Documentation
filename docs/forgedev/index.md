Getting Started
===============

If you've decided to contribute to Forge, you'll have to take some special steps to get started with developing. A simple mod development environment won't suffice to work with Forge's codebase directly. Instead, you can use the following guide to help you with your setup and get you started with improving Forge!

Forking and Cloning the Repository
----------------------------------

Like most major open source projects you'll find, Forge is hosted on [https://www.github.com](GitHub). If you've contributed to another project before, you'll know this process already and you can skip right ahead to the next section.

For those who are beginners when it comes to collaboration via Git, here are only two easy to steps to get you started.

!!! Note
    This guide assumes that you already have a GitHub account set up. If you don't, visit their [https://www.github.com/join](registration page) to create an account. Furthermore, this guide is not a tutorial for git's usage, please consult different sources first if you're struggling with getting it working.

### Forking

First of all, you have to "fork" the [https://www.github.com/MinecraftForge/MinecraftForge](MinecraftForge repository) by clicking the "Fork" button in the upper right hand corner. If you are in an organization, select the account you want your fork to be hosted on.

Forking the repository is necessary since not every GitHub user can have free access to every repository. Instead, you create a copy of the original repository to later contribute your changes via a so called Pull Request, which you will learn more about later.

### Cloning

After forking the repository, it is time to get local access to it and to actually make some changes. For this, you need to clone the repository onto your local machine.

Using your favourite git client, simply clone your fork into a directory of your choice. As general example, here is a command line snippet that should work on all correctly configured systems and clones the repository into a directory called "Forge" under the current directory (note that you have to replace `<User>` with your username):

```git clone https://github.com/<User>/MinecraftForge Forge```

# Checking out the Correct Branch

Forking and cloning the repository are the only mandatory steps to develop for Forge. However, to ease the process of creating Pull Requests for you, it is best to work with branches.

It is recommended to create and check out a branch for each PR you plan to submit. This way, you can always keep around the latest changes of Forge for new PRs while you still work on older patches.

After completing this step, you're ready to go and set up your development environment.

Setting up the environment
--------------------------

Depending on your favourite IDE, there is a different set of recommended steps you have to follow to successfully set up a development environment.

### IntelliJ IDEA

JetBrains' flagship IDE comes with great integrated support for [https://www.gradle.org](Gradle), Forge's build system of choice. Due to some peculiarities of Minecraft mod development, however, there are some additional steps required to get everything to work properly.

If you're more of a visual person, our community's very own cpw has uploaded [https://www.youtube.com/watch?v=yanCpy8p2ZE](a video) explaining very similar steps which will also lead to a working setup.

!!! Note
    These steps will only work reliably from IDEA version 2016 onwards. Older versions didn't have the appropriate Gradle support and did not support Forge development workspaces.

 1. Import Forge's `build.gradle` as an IDEA project. For this, simply click `File -> Open`, then navigate to your fork's clone and select the `build.gradle` file.
    If a dialog pops up, select "Open as Project".
 2. In the wizard that follows, make sure that "Create separate module per source set" is checked and that the "Use default gradle wrapper" option is active. Confirm the dialog.
 3. After IDEA is done importing the project and indexing the files, open the Gradle sidebar on the right hand side of your screen
 4. Open the "forge" project tree, select "Tasks", then "forgegradle" and right click the "Create Forge [setup]" option
 5. Once the configuration dialog shows up, edit the "tasks" field to contain `clean setup` and add `-Xmx3G -Xms3G` to "VM Options". The latter option ensures that the resource intensive decompilation process has enough memory.
 6. Click "Okay" and run your newly created run configuration. This may take a while.
 7. After the setup task has completed, go once again to the Gradle sidebar and click the "Attach Gradle project" button (the plus icon) at the top
 8. Navigate to your clone's directory, then open the `projects` directory and double click the `build.gradle` file in there. Select "Use gradle wrapper task configuration" in the following dialog and confirm it.
 9. Import all modules IDEA suggests
 10. To get access to the project's run configurations, open the `projects` directory in your file explorer and navigate to the `.idea` directory (might be hidden depending on your system). Copy the `runConfigurations` directory into `.idea` under your fork's root directory
 11. Once IDEA recognizes the added configurations, complete the following steps for each one
     * Change the configuration's module to `<Config>_main` where `<Config>` is the first part of the configuration's name
     * Change the run directory to `<clone>/projects/run`

That's all there is to creating a Forge development environment in IntelliJ IDEA. However, you won't be able to run the tests and debug mods included in Forge straight away. This takes some extra effort.

#### Enabling test mods

TODO: This section xD

Making Changes and Pull Requests
--------------------------------

Once you've set up your development environment, it's time to make some changes to Forge's codebase. There are, however, some pitfalls you have to avoid when editing the project's code.

The most important thing to note is that if you wish to edit Minecraft source code, you must only do so in the "Forge" sub-project. Any changes in the "Clean" project will mess with ForgeGradle and generating the patches. This can have disastrous consequences and might render your environment completely useless. If you wish to have a flawless experience, make sure you only edit code in the "Forge" project!

### Generating Patches

After you've made changes to the code base and once you've tested them thoroughly, you may go ahead and generate patches. This is only necessary if you work on the Minecraft code base (i.e. in the "Forge" project), but this step is vital for your changes to work elsewhere. Forge works by injecting only changed things into Vanilla Minecraft and hence needs those changes available in an appopriate format. Thankfully, ForgeGradle is capable of generating the changeset for you and all you have to do is commit it.

To initiate the patch generation, simply run the `genPatches` Gradle task from your IDE or the command line. After its completion, you can commit all your changes (make sure you do not add any unnecessary files) and submit your Pull Request!

### Pull Requests

The last step before your contribution is added to Forge is a Pull Request (PR in short). This is a formal request to incorporate your fork's changes into the live code base. Creating a PR is easy, simply go to [https://github.com/MinecraftForge/MinecraftForge/compare](this GitHub page) and follow the proposed steps. It is now that a good setup with branches pays off, since you're able to select precisely the changes you want to submit.

!!! Note
    Pull Requests are bound to rules, not every request will blindly be accepted. Follow [https://github.com/MinecraftForge/MinecraftForge/blob/1.10.x/CONTRIBUTING.md](this document) to get further information and to ensure the best quality of your PR!