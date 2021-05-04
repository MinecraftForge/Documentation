Forge Tags
====
Usage
---
Tags are an important element for communication between mods. Let's say, for example, you had rubies in your mod, along with ruby armor and ruby tools. If you want your rubies to be able to be used to make ruby armor and tools from other mods, you should apply the forge:gems/ruby tag to it. You do this by first making a directory in your resources folder: data/forge/tags/gems/. You then insert a JSON file there, called ruby.json. Inside of it, you should write:

```
{
    "replace": false,//this means that you will add to the tag, instead of overriding it completely
    "values": [
      "MODID:ruby"
    ]
  }
```
To add these tags to your own recipes, you should go to the directory data/MODID/recipes. Inside it, create a recipe named ruby_sword.json, and write inside it:
```
{
  "type": "minecraft:crafting_shaped",//this means the crafting will take on a specific pattern
  "pattern": [
      "$",
      "$",
      "#"
  ],
  "key": {//this section tells the game what the symbols from before mean
      "$":{
          "item":"forge:gem/ruby" //the ruby tag
      },
    "#": {
      "tag": "forge:rods/wooden" //an extra tag. it means stick
    }
  },
  "result": {
    "item": "MODID:ruby_sword",
    "count": 1
  }
}
```
Where to find them
---
[Here](https://github.com/MinecraftForge/MinecraftForge/tree/1.16.x/src/generated/resources/data/forge/tags/) you can find most of the tags in Forge.

