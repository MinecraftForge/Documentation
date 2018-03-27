Signing a JAR
=============

Java allows developers to sign their jar files with a signature. However, these signatures are not designed 
to be used as security and shouldn't be used this way. Signatures are used as sanity checks, so that developers
are able to check if they are running their own un-edited code.

!!! note

	Once again keep in mind that this system is not intended to be a security measure. With enough malicious intend it can be circumvented.
	
Creating a keystore
-------------------
A **keystore** is a private database file which holds the required information to successfully sign the jar.
To sign a jar, you need both a public and a private key. The public key will be later used to check if the
jar is correctly signed.

To generate a key, execute the following command and follow the instructions given by the keytool.
The key should be **SHA-1 encoded**.
```shell
keytool -genkey -alias signFiles -keystore examplestore.jks
```
* The `keytool` is part of the Java Development Kit and can be found in the underlying `bin` directory.
* The `alias signFiles` indicates that the alias should be used in future to refer to the keystore entry
* `-keystore examplestore.jks` means that the keystore will be saved to the file `examplestore.jks`.

### Get the public key
To gather the public key required by Forge, execute the following command:
```shell
keytool -list -alias signFiles -keystore examplestore.jks
```
Now copy the public key and remove all colons and change all uppercase letters to lowercase to ensure
that FML can work with the key.

### Checking at runtime
To allow FML to compare the keys, add the public key to the `certificateFingerprint` argument in the `@Mod` annotation.

When FML detects that the keys don't match it will fire the mod-lifecycle event `FMLFingerprintViolationEvent` How to 
handle this key mismatch is up to the developer.

- `event.isDirectory()` - Returns true when the mod runs in development environment.
- `event.getSource()` - Returns the file with the key mismatch.
- `event.getExpectedFingerprint()` - Returns the public key.
- `event.getFingerprints()` - Returns all public keys found.

Buildscript setup
-----------------
Finally, to let Gradle sign the jar file with the generated key pair, a new task in the
buildscript `build.gradle` is required.

```groovy
    task signJar(type: SignJar, dependsOn: reobfJar) {
        inputFile = jar.archivePath
        outputFile = jar.archivePath
    }
    
    build.dependsOn signJar
```

- `dependsOn: reobfJar` - This snippet of the line is important because Gradle has to sign the jar **after** ForgeGradle has reobfuscated the jar.
- `jar.archivePath` - The path where the archive (jar) is constructed.
- `build.dependsOn signJar` - This line tells Gradle that this task is part of the build task started by `gradlew build`.

The following values for the `signJar` task must be defined to ensure that Gradle can find the keystore and actually sign the jar.
This has to be done in the `gradle.properties` file.

- `keyStore` - This value tells Gradle where to search for the generated keystore.
- `alias` - The alias which was defined in the above is required in order for Gradle to sign the jar.
- `storePass` - The password which was defined by creating the keystore is required in order for Gradle to access the file.
- `keyPass` - The password of the key which was defined by creating the keystore is required in order for Gradle to gain access to it. This password may be the same as storePass, but can be different.
