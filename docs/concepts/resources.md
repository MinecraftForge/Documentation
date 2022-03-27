Resources
=========

A resource is extra data used by the game, and is stored in a data file, instead of being in the code. 
Minecraft has two primary resource systems active: one on the logical client used for visuals such as models, textures, and localization called `assets`, and one on the logical server used for gameplay such as recipes and loot tables called `data`.
[Resource packs][respack] control the former, while [Datapacks][datapack] control the latter.

In the default mod development kit, assets and data directories are located under the `src/main/resources` directory of the project. 

When multiple resource packs or data packs are enabled, they are merged. Generally, files from packs at the top of the stack override those below; however, for certain files, such as localization files and tags, data is actually merged contentwise. Mods define resource and data packs in their `resources` directories, but they are seen as subsets of the "Mod Resources" pack. Mod resource packs cannot be disabled, but they can be overridden by other resource packs. Mod datapacks can be disabled with the vanilla `/datapack` command.

All resources should have snake case paths and filenames (lowercase, using "_" for word boundaries), which is enforced in 1.11 and above.

`ResourceLocation`
------------------

Minecraft identifies resources using `ResourceLocation`s. A `ResourceLocation` contains two parts: a namespace and a path. It generally points to the resource at `assets/<namespace>/<ctx>/<path>`, where `ctx` is a context-specific path fragment that depends on how the `ResourceLocation` is being used. When a `ResourceLocation` is written/read as from a string, it is seen as `<namespace>:<path>`. If the namespace and the colon are left out, then when the string is read into an `ResourceLocation` the namespace will always default to `"minecraft"`. A mod should put its resources into a namespace with the same name as its modid (e.g. a mod with id `examplemod` should place its resources in `assets/examplemod` and `data/examplemod` respectively, and `ResourceLocation`s pointing to those files would look like `examplemod:<path>`.). This is not a requirement, and in some cases it can be desirable to use a different (or even more than one) namespace. `ResourceLocation`s are used outside the resource system, too, as they happen to be a great way to uniquely identify objects (e.g. [registries][]).

[respack]: ../resources/client/index.md
[datapack]: ../resources/server/index.md
[registries]: ./registries.md
