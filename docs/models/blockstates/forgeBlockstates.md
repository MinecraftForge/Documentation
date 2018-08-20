Forge's Blockstates
===================

Forge has its own blockstate json format to accommodate for modders needs. It introduces submodels, which allows you to build the final blockstate from different parts.

!!! Attention

    Note that all models and textures referenced are from vanilla minecraft. For your own mod, you have to use the full location! For example: `"mymod:blocks/blockTexture"`.

    You don't have to use Forge's blockstate format at all, you can also use the vanilla format!

General Structure of the Format
-------------------------------

```json
{
  "forge_marker": 1,
  "defaults": {
    "textures": {
      "all": "blocks/dirt"
    },
    "model": "cube_all",
    "uvlock": true
  },
  "variants": {
    "normal": [{}]
  }
}
```

This json declares a simple blockstate that has dirt on each side. Let's go through it step by step.

```json
  "forge_marker": 1,
```

This tells the game that the blockstate json is the one from Forge, not from vanilla Minecraft.
The 1 is the version of the format, which ensures that old blockstate JSONs can be supported should the format ever change. Currently there is only this one.

```json
  "defaults": {
    "textures": {
      "all": "blocks/dirt"
    },
    "model": "cube_all",
    "uvlock": true
  }
```

The defaults section contains the default values for all variants. They can be overwritten by the variants. The defaults section is **optional**! You do not need to define defaults, the block can be omitted altogether.

```json
  "variants": {
    "normal": [{}]
  }
```

This defines all variants for the block. The simple dirt block only has its default, the *normal* variant. It does not contain any additional information in this case. Everything that is defined in defaults could also be defined here. For example:

```json
  "normal": [{
    "textures": {
      "side": "blocks/cobblestone",
      "end": "blocks/dirt"
    },
    "model": "cube_column"
  }]
```

This normal variant would use the *cube_column* model with cobblestone on the sides and dirt on top and bottom.

An entry in the `variants` section either defines a [blockstate][] property or a plain variant. A property definition is of the form:

```json
    "variants": {
      "property_name": {
        "value0": {},
        "value1": {},
        "__comment": "Etc."
      }
   }
```

A given blockstate can have any number of these. When the blockstate is loaded, the values within each property are used to create all possible variants for the block. The above would create two variants, `property_name=value0` and `property_name=value1`. If there were two properties, it would create variants `prop1=value11,prop2=value21`, `prop1=value12,prop2=value21`, `prop1=value11,prop2=value22`, and so on (where the property names are sorted alphabetically). Each such variant is the union of all the variant definitions that went into it. For example, given:

```json
{
  "forge_marker": 1,
  "variants": {
    "shiny": {
      "true":  { "textures": { "all": "some:shiny_texture" } },
      "false": { "textures": { "all": "some:flat_texture"  } }
    },
    "broken": {
      "true":  { "model": "some:broken_model" },
      "false": { "model": "some:intact_model" }
    }
 }
}
```

The variant "broken=false,shiny=true" takes the "some:intact_model" from `variants.broken.true.model`, and the `some:shiny_texture` from `variants.shiny.true.textures`.

An entry can also be a plain variant, like:

```json
    "variants": {
      "normal": { "model": "some:model" }
    }
```

This kind of definition defines a variant "normal" directly, without forming combinations with those listed in the property-value format. It still inherits from a "defaults" block, if present, and if the property-value formatted variants generate a variant with the same name, the directly defined variant combines with and overrides values from it. If the variant is defined as a list, then each element is a variant definition, and the one that will be used is random:

```json
    "defaults": { "model": "some:model" }
    "variants": {
      "__comment": "When used, the model will have a 75% chance of being rotated.",
      "normal": [{ "y": 0 }, { "y": 90 }, { "y": 180 }, { "y": 270 }]
    }
```

A property definition is disambiguated from a straight variant by the type of the first entry. If the first entry of `variants.<something>` is an object, then it is a property definition. If it is anything else, it is a straight variant. In order to avoid mixups, it is recommended to wrap straight variants in a list with one element:

```json
   "variants": {
     "simple": [{
       "custom": {},
       "model": "some:model",
       "__comment": "Without the list, the custom: {} would make Forge think this was a property definition."
     }]
   }
```

Sub-Models
----------

To show the use of submodels we will create a model that has different variants. Each variant will use submodels to create a different model.
The model will be a pressure plate, and depending on its state it will have parts added to it.

```json
{
  "forge_marker": 1,
  "defaults": {
    "textures": {
      "texture": "blocks/planks_oak",
      "wall": "blocks/planks_oak"
    },
    "model": "pressure_plate_up",
    "uvlock": true
  },
  "variants": {
    "__comment": "mossy is a boolean property.",
    "mossy": {
      "true": {
        "__comment": "If true it changes the pressure plate from oak planks to mossy cobble.",
        "textures": {
          "texture": "blocks/cobblestone_mossy"
        }
      },
      "false": {
        "__comment": "Change nothing. The entry has to be here so the Forge blockstate loader knows to generate this variant."
      }
    },
    "__comment": "pillarcount is a property that determines how many pillar submodels we have. Ranges from 0 to 2.",
    "pillarcount": {
      "0": {
        "__comment": "No pillar. Remember, this empty definition has to be here."
      },
      "1": {
        "__comment": "If it is true, it will add the wall model and combine it with the pressure plate.",
        "submodel": "wall_n"
      },
      "2": {
        "textures": {
          "wall": "blocks/cobblestone"
        },
        "submodel": {
          "pillar1": { "model": "wall_n" },
          "pillar2": { "model": "wall_n", "y": 90 }
        }
      }
    }
  }
}
```

The comments already explain the details on the separate parts, but here's how it works overall: The block definition in code has two properties. One boolean property named `mossy` and one integer property named `pillarCount`.

!!! note
    Notice here that the string used in the json is **lowercase**. It has to be lowercase or it won't be found.

Instead of defining "this combination of properties gives model X" we say "**this** value for this property has **that** impact on the model". In this example it's quite straight forward:

* If `mossy` is `true`, the pressure plate uses the mossy cobblestone texture
* If `pillarCount` is `1` it will add one wall with connection facing north. The default texture for the wall is oak-planks.
* If `pillarCount` is `2` it will add two walls, both facing north. However the second wall will be rotated by 90 degree. This showcases that you do not need separate model with Forge's system. You only need once and rotate it around the Y axis. Additionally the texture of the walls is changed to cobblestone.
* If `pillarCount` is `0` no walls will be added.

And here is the result of our work:

![The model in different variations](example.png)

[blockstate]: ../../blocks/states.md
