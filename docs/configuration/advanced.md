Advanced Configurations
=======================

ForgeGradle contains a few specific or nuanced configuration techniques depending on the complexity of your build project.

Reobfuscating Source Sets
-------------------------

By default, the `reobf*` abd `rename*` tasks only contain files on the main source set's classpath. To reobfuscate files on a different classpath, they need to be added to the `libraries` property within the task.

```gradle
// Adds another source set's classpath to 'reobf' task.
tasks.withType('reobfJar') {
    libraries.from sourceSets.api.classpath
}
```
