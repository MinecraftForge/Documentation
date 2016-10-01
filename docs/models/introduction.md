Intro to Models
===============

The model system is Minecraft's way of giving blocks and items their shapes. Through the model system, blocks and items are mapped to their models, which define how they look. One of the main goals of the model system is to allow not only textures but the entire shape of a block/item to be changed by resource packs. Indeed, when you create a mod, you are also creating a mini-resource pack for your own blocks and items.

In order to link code to models and textures on disk, there exists the class `ResourceLocation` (RL). You may recognize them from the registry system, however their original vanilla purpose was to identify files on disk; they just happened to be useful as unique identifiers in Forge. An RL is a very simple object composed of 2 `String`s, a domain and a path. When an RL is represented as a plain string, it looks like `domain:path`. Normally, if an RL is being read from a string that doesn't have a domain, the domain defaults to `minecraft`.

The domain of an RL represents a directory directly underneath `assets/`. Usually, the domain is the same as the modid. (E.g. in vanilla Minecraft the domain is always `minecraft`). The path portion of an RL represents a context-sensitive path to file underneath the domain. What the path exactly means and where exactly it points depends on what's using it. (E.g. in a JSON model, the parent model is resolved against `models`, but textures are resolved against `textures`. Therefore `mod:surprise/file` means `assets/mod/models/surprise/file` in one context but `assets/mod/textures/surprise/file` in another.)

All strings related to the model system (especially RLs) should be in snake case. (meaning_all_lowercase_and_underscore_separated_words_like_this) This will be enforced in Minecraft 1.11.
