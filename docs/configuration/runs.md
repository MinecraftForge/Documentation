Run Configurations
==================

Run configurations define how an instance of the game is going to run. This includes arguments, working directories, task names, etc. Run configurations are defined within the `minecraft.runs` block. While no runs are configured by default, [Forge][userdev] does provide the configurations `client`, `server`, `data`, or `gameTestServer`.

```gradle
minecraft {
    // ...
    runs {
        // Configure runs here
    }
}
```

Run configurations can be added similar to any `NamedDomainObjectContainer` using closures.

```gradle
// Inside the minecraft block
runs {
    // Creates or configures the run configuration named 'client'
    client {
        // Configure run
    }
}
```

The following configurations properties are available:

```gradle 
// Inside the runs block
client {
    // The name of the Gradle run tasks,
    // Defaults to 'runX' where X is the container name
    taskName 'runThing'

    // Sets the entrypoint of the program to launch
    // Forge sets userdev main to be 'cpw.mods.bootstraplauncher.BootstrapLauncher'
    main 'com.example.Main'

    // Sets the working directory of the config
    // Defaults to './run'
    workingDirectory 'run'

    // Sets the name of the module for IntelliJ IDEA to configure for its runs
    // Defaults to '<project_name>.main'
    ideaModule 'example.main'

    // Sets the name of the folder that the run configuration should be added to
    // Defaults to the name of the project
    folderName 'example'

    // Sets whether this should run a Minecraft client
    // If not specified, checks the following
    // - Is there an environment property 'thing' that contains 'client'
    // - Does the configuration name contain 'client'
    // - Is main set to 'mcp.client.Start'
    // - Is main set to 'net.minecraft.client.main.Main'
    client true

    // Set the parent of this configuration to inherit from
    parent runs.example

    // Sets the children of this configuration
    children runs.child

    // Merges this configuration and specifies whether to overwrite existing properties
    merge runs.server, true

    // If not false, will merge the arguments of the parent with this configuration
    inheritArgs false

    // If not false, will merge the JVM arguments of the parent with this configuration
    inheritJvmArgs false

    // Adds a sourceset to the classpath
    // If none is specified, adds sourceSet.main
    source sourceSets.api

    // Sets an environment property for the run
    // Value will be interpreted as a file or a string
    environment 'envKey', 'value'

    // Sets a system property
    // Value will be interpreted as a file or a string
    property 'propKey', 'value'

    // Sets an argument to be passed into the application
    // Can specify multiple with 'args'
    arg 'hello'

    // Sets a JVM argument
    // Can specify multiple with 'jvmArgs'
    jvmArg '-Xmx2G'

    // Sets a token
    // Currently, the following tokens are being used:
    // - runtime_classpath
    // - minecraft_classpath
    token 'tokenKey', 'value'

    // Sets a token that's lazily initialized
    // Should usually be used instead of 'token', for example when the token resolves Gradle configurations
    lazyToken('lazyTokenKey') {
      'value'
    }

    // If not false, Gradle will stop once the process has finished
    forceExit true

    // If true, compile all projects instead of for the current task
    // This is only used by IntelliJ IDEA
    buildAllProjects false
}
```

!!! tip
    You can see a list of all configured userdev properties within the [MinecraftForge buildscript][buildscript].

Mod Configurations
------------------

A mod in the current environment can be added using the `mods` block within a Run configuration. Mod blocks are also `NamedDomainObjectContainer`s.

```gradle
// Inside the runs block
client {
    // ...

    mods {
        other_mod {
            // ...
        }

        // Configures the 'example' mod
        example {
            // Add a source set to a mod's sources
            source sourceSets.main

            // Merges this configuration and specifies whether to overwrite existing properties
            merge mods.other_mod, true
        }
    }
}
```

[userdev]: https://github.com/MinecraftForge/MinecraftForge/blob/42115d37d6a46856e3dc914b54a1ce6d33b9872a/build.gradle#L374-L430
[buildscript]: https://github.com/MinecraftForge/MinecraftForge/blob/d4836bc769da003528b6cebc7e677a5aa23a8228/build.gradle#L434-L470
