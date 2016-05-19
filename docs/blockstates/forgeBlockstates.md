Forge's Blockstates
===================

Forge has its own blockstate json format to accommodate for modders needs. It introduces submodels, which allows you to build the final blockstate from different parts. You can build a models *normal* blockstate from multiple parts as well as create a complex variant depending on the blocks properties.

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
		"normal": [{

		}]
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
		"normal": [{

		}]
	}
```

This defines all variants for the block. The simple dirt block only has its default, the *normal* variant. It does not contain any additional information in this case. Everything that is defined in defaults could also be defined here.
For example:

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
		// mossy is a boolean property.
		"mossy": {
			"true": {
				// if true it changes the pressure plate from oak planks to mossy cobble
				"textures": {
					"texture": "blocks/cobblestone_mossy"
				}
			},
			"false": {
				// change nothing. The entry has to be here to be generated for internal usage by minecraft
			}
		},
		// pillarcount is a property that determines how many pillar submodels we have. Ranges from 0 to 2
		"pillarcount": {
			0: {
				// no pillar. Remember, has to be there.
			},
			1: {
				// if it is true, it will add the wall model and combine it with the pressure plate
				"submodel": "wall_n"
			},
			2: {
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

The comments already explain the details on the separate parts, but here's how it works overall: The block definition in code has two Properties. One boolean property named "mossy" and one integer property named "pillarCount". Notice here that the string used in the json is **lowercase**, however. It has to be lowercase or it wont be found.

Instead of defining "this combination of properties gives model X" we say "**this** value for this property has **that** impact on the model". In this example it's quite straight forward:

* If mossy is true, the pressure plate uses the mossy cobblestone texture
* If pillarCount is 1 it will add one wall with connection facing north. The default texture for the wall is oak-planks.
* If pillarCount is 2 it will add two walls, both facing north. However the second wall will be rotated by 90 degree. This showcases that you do not need separate model with Forge's system. You only need once and rotate it around the Y axis. Additionally the texture of the walls is changed to cobblestone.
* If pillarCount is 0 no walls will be added.

And here is the result of our work:

![The model in different variations](example.png)
