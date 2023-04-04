Run Configurations
==================

Run configurations define how an instance of the game is going to run. This includes arguments, working directories, task names, etc. Run configurations are defined within the `minecraft.runs` block. While no runs are configured by default, ForgeGradle does provide some assumptions for the configurations `client`, `server`, `data`, or `gameTestServer` on their entry points.

```gradle
minecraft {
    // ...
    runs {
        // Add runs here
    }
}
```

Run configurations can be added similar to any `NamedDomainObjectContainer` using closures.

```gradle
// Inside the minecraft block
runs {
    // Adds the run configuration named 'client'
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
    // Should be used in most cases compared to 'token'
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
        // Configures the 'example' mod
        example {
            // Sets the location of the mod's classes
            classes sourceSets.api.output

            // Sets the location of the mod's resources
            resources files('./my_resources')

            // Add a source set to a mod's sources
            source sourceSets.main
        }
    }
}
```

[buildscript]: https://github.com/MinecraftForge/MinecraftForge/blob/d4836bc769da003528b6cebc7e677a5aa23a8228/build.gradle#L434-L470
