Intro to Models
===============

The model system is Minecraft's way of giving blocks and items their shapes. Through the model system, blocks and items are mapped to their models, which define how they look. One of the main goals of the model system is to allow not only textures but the entire shape of a block/item to be changed by resource packs. Indeed, any mod that adds items or blocks also contains a mini-resource pack for their blocks and items.

In order to link code to models and textures on disk, there exists the class `ResourceLocation` (RL). One may recognize them from the registry system, however their original purpose was to identify files on disk; they just happened to be useful as unique identifiers as well. An RL is a very simple object composed of 2 `String`s: a domain and a path. When an RL is represented as a plain string, it looks like `domain:path`. When an RL is being created and a domain isn't explicitly given, the domain defaults to `minecraft`. However, it is good practice to include the domain anyway.

The domain of an RL in the model system represents a directory directly underneath `assets/`. Usually, the domain is the same as the modid (e.g. in vanilla Minecraft the domain is always `minecraft`). The path portion of an RL represents a context-sensitive path to file underneath the domain. What the path exactly means and where exactly it points depends on what's using it. For example, when refering to a model, the path is normally resolved under `models`, but when refering to a texture it's under `textures`. Therefore `mod:file` means `assets/mod/models/file` in one context but `assets/mod/textures/file` in another. When something is described as requiring an RL, it will be defined what exactly the path means.

All strings related to the model system (especially RLs) should be in snake case (meaning_all_lowercase_and_underscore_separated_words_like_this). This will be enforced in Minecraft 1.11.
