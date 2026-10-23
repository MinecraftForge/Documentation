Jar-in-Jar&colon; Internal Format
===========================

When using Jar-in-Jar, ForgeGradle:

1. inserts your JARs into the final JAR,
1. generates the `META-INF/jarjar/metadata.json` file.<br/>

That metadata file contains the following information:

- list of Jar-in-Jared JARs:
  - path of Jar-in-Jar,
  - identifier of Jar-In-Jar *(**group** and **artifact**)*,
  - version information:
    - the contained version of the Jar-in-Jar,
    - the required version range of the Jar-in-Jar;
  - whether the Jar-in-Jar is obfuscated.

Here's an example of the spicy `metadata.json` file:

```js
{
  "jars": [
    {
      "identifier": {
        "group": "com.example",
        "artifact": "mod_service"
      },
      "version": {
        "range": "[2.0,)",
        "artifactVersion": "1.0"
      },
      "path": "service.jar",
      "isObfuscated": false
    }
  ]
}
```

Identifiers
-----------

You may have thought, *what's the point?* Well, I've got the answer just for you.
So, multiple mods may Jar-in-Jar the same dependency. But classes cannot load on twice on Forge.

To resolve this problem, FML first iterates through all Jar-in-Jars of all mods and detects duplicates by looking at the **provided identifiers**.
How does it pick which one to use? Look at the next section - *Versions*.

Versions
--------
FML first iterates through the Jar-in-Jars *(look at the Identifiers section)* with the same identifier, and then picks the one with the newest **artifactVersion**.

However, there's also another field - `range`! What does it do? Well, it's meant to specify whether the mod containing that Jar-in-Jar is actually compatible with another version of that Jar-in-Jar.
For example, you might be compatible with 1.0 and all versions lower than 2.0 of a Jar-in-Jar *(if the dependency you're Jar-in-Jaring uses [semantic versioning](https://semver.org/), then this means 2.0 had incompatible changes)*.

!!! important
    Forge uses [Maven version ranges][cmpver] to compare version strings, which is not fully compatible with the Semantic Versioning 2.0.0 spec, such as the 'prerelease' tag.

[cmpver]: https://maven.apache.org/ref/3.5.2/maven-artifact/apidocs/org/apache/maven/artifact/versioning/ComparableVersion.html
