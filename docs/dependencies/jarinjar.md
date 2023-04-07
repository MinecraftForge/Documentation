Jar-in-Jar
==========

Jar-in-Jar is a way to load dependencies for mods from within the jars of the mods. To accomplish this, Jar-in-Jar generates a metadata json within `META-INF/jarjar/metadata.json` on build containing the artifacts to load from within the jar.

Jar-in-Jar is a completely optional system which can be enabled using `jarJar#enable` before the `minecraft` block. This will include all dependencies from the `jarJar` configuration into the `jarJar` task. You can configure the task similarly to other jar tasks:

```gradle
// In build.gradle

// Enable the Jar-in-Jar system for your mod
jarJar.enable()


// Configure the 'jarJar' task
// 'all' is the default classifier
tasks.named('jarJar') {
    // ...
}
```

Adding Dependencies
-------------------

You can add dependencies to be included inside your jar using the `jarJar` configuration. As Jar-in-Jar is a negotiation system, all versions should supply a supported range.

```gradle
// In build.gradle
dependencies {
    // Compiles against and includes the highest supported version of examplelib
    //   between 2.0 (inclusive) and 3.0 (exclusive)
    jarJar(group: 'com.example', name: 'examplelib', version: '[2.0,3.0)')
}
```

If you need to specify an exact version to include rather than the highest supported version in the range, you can use `jarJar#pin` within the dependency closure. In these instances, the artifact version will be used during compile time while the pinned version will be bundled inside the mod jar.

```gradle
// In build.gradle
dependencies {
    // Compiles against the highest supported version of examplelib
    //   between 2.0 (inclusive) and 3.0 (exclusive)
    jarJar(group: 'com.example', name: 'examplelib', version: '[2.0,3.0)') {
      // Includes examplelib 2.8.0
      jarJar.pin(it, '2.8.0')
    }
}
```

You can additionally pin a version range while compiling against a specific version instead:

```gradle
// In build.gradle
dependencies {
    // Compiles against examplelib 2.8.0
    jarJar(group: 'com.example', name: 'examplelib', version: '2.8.0') {
      // Includes the highest supported version of examplelib
      //   between 2.0 (inclusive) and 3.0 (exclusive)
      jarJar.pin(it, '[2.0,3.0)')
    }
}
```

### Using Runtime Dependencies

If you would like to include the runtime dependencies of your mod inside your jar, you can invoke `jarJar#fromRuntimeConfiguration` within your buildscript. If you decide to use this option, it is highly suggested to include dependency filters; otherwise, every single dependency -- including Minecraft and Forge -- will be bundled in the jar as well. To support more flexible statements, the `dependency` configuration has been added to the `jarJar` extension and task. Using this, you can specify patterns to include or exclude from the configuration:

```gradle
// In build.gradle

// Add runtime dependencies to jar
jarJar.fromRuntimeConfiguration()

// ...

// Dependencies will be executed on the 'jarJar' task
dependencies {
    // Exclude any dependency which begins with 'com.google.gson.'
    exclude(dependency('com.google.gson.*'))
}
```

!!! tip
    It is generally recommended to set at least one `include` filter when using `#fromRuntimeConfiguration`.

Publishing a Jar-in-Jar to Maven
--------------------------------

For archival reasons, ForgeGradle supports publishing Jar-in-Jar artifacts to a maven of choice, similar to how the [Shadow plugin][shadow] handles it. In practices, this is not useful or recommended.

```gradle
// In build.gradle (has 'maven-publish' plugin)

publications {
    mavenJava(MavenPublication) {
        // Add standard java components and Jar-in-Jar artifact
        from components.java
        jarJar.component(it)

        // ...
    }
}
```


[shadow]: https://imperceptiblethoughts.com/shadow/getting-started/
