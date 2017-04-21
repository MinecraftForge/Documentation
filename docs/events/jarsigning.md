Signing a JAR
=============

Forge allows Mods to sign their jar files with a signature. However, these signatures are not used
as security and shouldn't be used this way. Signatures are used as sanity checks, so that Modders
are able to check if he is running his own un-edited code.

!!! note

	If someone really wants to get around this system, they can. This system is not one hundred percent effective. This system is event based, meaning that an invalid key will cause an event to be executed.
	
Creating a keystore
-------------------
A **keystore** is a private database file which holds the required information to successfully sign the jar.
To sign a jar, you need both a public and a private key. The public key will be later used to check if the
jar is correctly signed.

To generate a key, execute the following command and follow the instructions given by the keytool.
The key should be **SHA-1 encoded**.
```java
keytool -genkey -alias signFiles -keystore examplestore.jks
```
The `keytool` is part of the Java Development Kit and can be found in the underlying `bin` directory.
The `alias signFiles` indicates that the alias should be used in future to refer to the keystore entry and
`-keystore examplestore.jks` means that the keystore will be saved to the file `examplestore.jks`.

!!! note

	A correct setup of the Java Development Kit is required!

### Get the public key
To gather the public key required by Forge, execute the following command:
```java
keytool -list -alias signFiles -keystore examplestore.jks
```
Now copy the public key and remove all colons and change all uppercase letters to lowercase to ensure
that FML can work with the key.

### Checking at runtime
To allow FML to compare the keys, add the public key to the `certificateFingerprint` argument in the `@Mod` annotation.

```java
    @Mod.EventHandler
    public void onFingerprintViolation(FMLFingerprintViolationEvent event) {
        
    }
```
When FML detects that the keys don't match it will automatically execute the following event. How to handle this
key mismatch is up the Modder.

- `event.isDirectory()` - Returns true when the Mod runs in development environment.
- `event.getSource()` - Returns the file with the key mismatch.
- `event.getExpectedFingerprint()` - Returns the public key.
- `event.getFingerprints()` - Returns all public keys found.

!!! note

	The event is fired in mods that are already loaded and runs before any of the Mods code is executed.

Buildscript setup
-----------------
To finally let Gradle sign the jar file with the generated key pair, a new task in the
buildscript `build.gradle` is required.

```java
    task signJar(type: SignJar, dependsOn: reobfJar) {
        inputFile = jar.archivePath
        outputFile = jar.archivePath
    }
    
    build.dependsOn signJar
```

- `dependsOn: reobfJar` - This line is important because Gradle has to sign the jar **after** ForgeGradle has reobfuscated the jar.
- `jar.archivePath` - The path where the archive (jar) is constructed.
- `build.dependsOn signJar` - This line tells Gradle that this task is part of the build task started by `gradlew build`.

This task should define a few properties so Gradle knows everything required to sign the jar.

- `keyStore` - The location of the keystore which was created at the beginning. 
- `alias` - The alias defined by creating the keystore.
- `storePass` - The password defined by creating the keystore.
- `keyPass` - The password of the key itself defined by creating the keystore.
