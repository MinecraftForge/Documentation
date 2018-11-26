Resources
=========

A resource is extra data used by the game, and is stored in a data file, instead of being in the code. Resources are contained in the `assets` directory on the classpath. In the default mod development kit, this directory is under the `src/main/resources` directory of the project. It includes things such as models, textures, and localization files.

When multiple resource packs are enabled, they are merged. Generally, files from resource packs at the top of the stack override those below; however, for certain files, such as localization files, data is actually merged contentwise. Mods actually define resource packs too, in their `resources` directories, but they are seen as subsets of the "Default" resource pack. Mod resource packs cannot be disabled, but they can be overriden by other resource packs.

All resources should have snake case paths and filenames (lowercase, using "_" for word boundaries), which is enforced in 1.11 and above.

`ResourceLocation`
------------------

Minecraft identifies resources using `ResourceLocation`s. A `ResourceLocation` contains two parts: a namespace and a path. It generally points to the resource at `assets/<namespace>/<ctx>/<path>`, where `ctx` is a context-specific path fragment that depends on how the `ResourceLocation` is being used. When a `ResourceLocation` is written/read as/from a string, it is seen as `<namespace>:<path>`. If the namespace and the colon are left out, then when the string is read into an `ResourceLocation` the namespace will almost always default to `"minecraft"`. A mod should put its resources into a namespace with the same name as its modid (E.g. a mod with id `examplemod` should place its resources in `assets/examplemod`, and `ResourceLocation`s pointing to those files would look like `examplemod:<path>`.). This is not a requirement, and in some cases it can be desirable to use a different (or even more than one) namespace. `ResourceLocation`s are used outside the resource system, too, as they happen to be a great way to uniquely identify objects (e.g. [registries][]).

[registries]: registries.md
