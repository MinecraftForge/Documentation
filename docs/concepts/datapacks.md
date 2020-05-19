Datapacks
=========
In 1.13, Mojang [added datapacks](https://minecraft.gamepedia.com/Data_pack) to the base game. They allow for the modification of the files placed under resources/data.
This includes advancements, loot_tables, structures, recipes and tags. 
Forge, and your mod probably, are also in a way datapacks. Any user can therefore modify all the recipes and loot tables (and other stuff) of a mod.

Therefore, there is little sense in having configurable recipes or mob drops. Any user can modify them to any value (even from other mods).

### Dev environment
In your project, you have a folder "resources" that has to contain a folder "data". This folder will be your datapacks. 
Your mod can have multiple, since you can add or modify already existing datapacks,like vanilla's, forge's and another mod's.
In the data folder, you must first have a folder with the mod id of the datapack you want. For your it is your own mod id. For vanilla it is "minecraft" and for forge it is "forge".

### Mod user
For a mod user to modify your datapack, they must know your mod id and the id of your item/mob/advancement. These can be found while launching your mod, but providing it for users in a simpler way can be helpful (also using github will allow users to navigate your current datapack).
They can then follow the steps found [here](https://minecraft.gamepedia.com/Tutorials/Creating_a_data_pack) to create any datapack.