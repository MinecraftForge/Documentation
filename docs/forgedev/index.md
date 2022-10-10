Getting Started
===============

If you have decided to contribute to Forge, you will have to take some special steps to get started with developing. A simple mod development environment will not suffice to work with Forge's codebase directly. Instead, you can use the following guide to help you with your setup and get you started with improving Forge!

Forking and Cloning the Repository
----------------------------------

Like most major open source projects you will find, Forge is hosted on [GitHub][github]. If you have contributed to another project before, you will know this process already and can skip right ahead to the next section.

For those who are beginners when it comes to collaboration via Git, here are two easy steps to get you started.

!!! note
    This guide assumes that you already have a GitHub account set up. If you do not, visit their [registration page][register] to create an account. Furthermore, this guide is not a tutorial for git's usage. Please consult different sources first if you are struggling to get it working.

### Forking

First of all, you have to "fork" the [MinecraftForge repository][forgerepo] by clicking the "Fork" button in the upper right hand corner. If you are in an organization, select the account you want your fork to be hosted on.

Forking the repository is necessary since not every GitHub user can have free access to every repository. Instead, you create a copy of the original repository to later contribute your changes via a so called Pull Request, which you will learn more about later.

### Cloning

After forking the repository, it is time to get local access to actually make some changes. For this, you need to clone the repository onto your local machine.

Using your favorite git client, simply clone your fork into a directory of your choice. As general example, here is a command line snippet that should work on all correctly configured systems and clones the repository into a directory called "MinecraftForge" under the current directory (note that you have to replace `<User>` with your username):

```git clone https://github.com/<User>/MinecraftForge```

# Checking out the Correct Branch

Forking and cloning the repository are the only mandatory steps to develop for Forge. However, to ease the process of creating Pull Requests for you, it is best to work with branches.

It is recommended to create and check out a branch for each PR you plan to submit. This way, you can always keep around the latest changes of Forge for new PRs while you still work on older patches.

After completing this step, you are ready to go and set up your development environment.

Setting Up the Environment
--------------------------

Depending on your favorite IDE, there is a different set of recommended steps you have to follow to successfully set up a development environment.

### Eclipse

Due to the way Eclipse workspaces work, ForgeGradle can do most of the work involved to get you started with a Forge workspace.

1. Open a terminal/command prompt and navigate to the directory of your cloned fork.
2. Type `./gradlew setup` and hit enter. Wait until ForgeGradle is done.
3. Type `./gradlew genEclipseRuns` and hit enter. Once again, wait until ForgeGradle is done.
4. Open your Eclipse workspace and go to `File -> Import -> General -> Existing Gradle Project`.
5. Browse to the repo directory for the "Project root directory" option in the dialog that opens.
6. Complete the import by clicking the "Finish" button.

That is all it takes to get you up and running with Eclipse. There is no extra steps required to get the test mods running. Simply hit "Run" like in any other project and select the appropriate run configuration.

### IntelliJ IDEA

JetBrains' flagship IDE comes with great integrated support for [Gradle][gradle]: Forge's build system of choice. Due to some peculiarities of Minecraft mod development, however, there are additional steps required to get everything to work properly.

#### IDEA 2021 onwards
1. Start IntelliJ IDEA 2021.
    - If you already have another project open, close the project with the File -> Close project option.
2. In the projects tab of the "Welcome to IntelliJ IDEA" window, click the "Open" button on the top right and select the MinecraftForge folder you cloned earlier.
3. Click "Trust Project" if prompted.
4. After IDEA is done importing the project and indexing its files, run the Gradle setup task. You can do this by:
    - Open the Gradle sidebar on the right hand side of your screen, then open the forge project tree, select Tasks, then other and double-click the `setup` task (may also appear as `MinecraftForge[Setup]`) found in Forge -> Tasks -> other -> `setup`.
5. Generate the run configurations:
    - Open the Gradle sidebar on the right hand side of your screen, then open the forge project tree, select Tasks, then other and double-click the `genIntellijRuns` task (may also appear as `MinecraftForge[genIntellijRuns]`) found in Forge -> Tasks -> forgegradle runs -> `genIntellijRuns`.
- If you get a licensing error during build before making any changes, running the `updateLicenses` task may help. This task is found in Forge -> Tasks -> other as well.

#### IDEA 2019-2020
There are a few minor differences between IDEA 2021 and these versions for setup.

1. Import Forge's `build.gradle` as an IDEA project. For this, simply click `Import Project` from the `Welcome to IntelliJ IDEA` splash screen, then select the `build.gradle` file.
1. After IDEA is done importing the project and indexing the files, run the Gradle setup task. Either:
    1. Open the Gradle sidebar on the right hand side of your screen, then open the `forge` project tree, select `Tasks`, then `other` and double-click the `setup` task (may also appear as `MinecraftForge[Setup]`. Or alternatively:
    1. Tap the CTRL key twice, and type `gradle setup` in the `Run` command window that pops up.

You can then run Forge using the `forge_client` gradle task (`Tasks -> fg_runs -> forge_client`): right-click the task and select either `Run` or `Debug` as desired.

You should now be able to work with your mod using the changes you introduce to the Forge and Vanilla codebase.

Making Changes and Pull Requests
--------------------------------

Once you have set up your development environment, it is time to make some changes to Forge's codebase. There are, however, some pitfalls you have to avoid when editing the project's code.

The most important thing to note is that if you wish to edit Minecraft source code, you must only do so in the "Forge" sub-project. Any changes in the "Clean" project will mess with ForgeGradle and generating the patches. This can have disastrous consequences and might render your environment completely useless. If you wish to have a flawless experience, make sure you only edit code in the "Forge" project!

### Generating Patches

After you have made changes to the code base and tested them thoroughly, you may go ahead and generate patches. This is only necessary if you work on the Minecraft code base (i.e. in the "Forge" project), but this step is vital for your changes to work elsewhere. Forge works by injecting only changed things into Vanilla Minecraft and hence needs those changes available in an appropriate format. Thankfully, ForgeGradle is capable of generating the changeset for you to commit it.

To initiate the patch generation, simply run the `genPatches` Gradle task from your IDE or the command line. After its completion, you can commit all your changes (make sure you do not add any unnecessary files) and submit your Pull Request!

### Pull Requests

The last step before your contribution is added to Forge is a Pull Request (PR in short). This is a formal request to incorporate your fork's changes into the live code base. Creating a PR is easy. Simply go to [this GitHub page][submitpr] and follow the proposed steps. It is now that a good setup with branches pays off, since you are able to select precisely the changes you want to submit.

!!! note
    Pull Requests are bound to rules; not every request will blindly be accepted. Follow [this document][contribute] to get further information and to ensure the best quality of your PR! If you want to maximize the chances of your PR getting accepted, follow these [PR guidelines][guidelines]!

[github]: https://www.github.com
[register]: https://www.github.com/join
[forgerepo]: https://www.github.com/MinecraftForge/MinecraftForge
[gradle]: https://www.gradle.org
[submitpr]: https://github.com/MinecraftForge/MinecraftForge/compare
[contribute]: https://github.com/MinecraftForge/MinecraftForge/blob/1.13.x/CONTRIBUTING.md
[guidelines]: ./prguidelines.md
