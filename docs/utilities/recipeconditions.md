Recipe Conditions
=================
Recipe conditions allow recipes to be skipped when certain conditions are not met. These conditions are only checked when the recipe is loaded or reloaded. Recipe conditions allow you to do things like disable recipes if an optional mod dependency is not installed. They can also be used for more advanced use cases like checking if a config option is enabled.

Using Recipe Conditions
-----------------------
Recipe conditions will prevent the recipe from loading if the conditions are not met. Recipe conditions are defined using an array named `conditions` in the recipe JSON file. Each element within this array must be a JSON object with a `type` value. The `type` value is used to determine which type of condition you are specifying. Depending on the type additional properties may also be defined.

```json
{
  "conditions": [
    {
      "type": "example:some_type"
    }
  ]
}
```

### Mod Loaded Condition
This condition will only be met when the specified mod is loaded. The mod is specified using the `modid` property which is JSON string.

```json
{
  "type": "forge:mod_loaded",
  "modid": "examplemod"
}
```

### Item Exists Condition
This condition is only met when the specified item exists. The item is defined using the `item` property which is a JSON string with the namespaced ID of the item.

```json
{
  "type": "forge:item_exists",
  "item": "minecraft:stick"
}
```

### Tag Empty Condition
This condition will only be met if the specified item tag is empty. The tag is defined using the `tag` property which is a JSON string with the namespaced ID of the tag.

```json
{
  "type": "forge:tag_empty",
  "tag": "minecraft:coals"
}
```

### And Condition
This condition will be met if all of it's child conditions are also met. The children are defined using the `values` property which is a JSON array of other condition objects.

```json
{
  "type": "forge:and",
  "values": [
    {
      "type": "forge:mod_loaded",
      "modid": "examplemod"
    },
    {
      "type": "forge:item_exists",
      "item": "minecraft:stick"
    }
  ]
}
```

### Not Condition
This condition is met when all of its child conditions are not met. Thes children are defined using the `values` property which is a JSON array of other condition objects.

```json
{
  "type": "forge:not",
  "values": [
    {
      "type": "forge:mod_loaded",
      "modid": "examplemod"
    },
    {
      "type": "forge:item_exists",
      "item": "minecraft:stick"
    }
  ]
}
```

### Or Condition
This condition will be met if one or more of its children are also met. Thes children are defined using the `values` property which is a JSON array of other condition objects.

```json
{
  "type": "forge:or",
  "values": [
    {
      "type": "forge:mod_loaded",
      "modid": "examplemod"
    },
    {
      "type": "forge:item_exists",
      "item": "minecraft:stick"
    }
  ]
}
```

### False Condition
This condition will never be met.

```json
{
  "type": "forge:false"
}
```

### True Condition
This condition will always be met.

```json
{
  "type": "forge:true"
}
```

Conditional Recipe
------------------
Forge also provides a new conditional recipe type that can be used to change the recipe being loaded based on conditions. This recipe type defines an array of potential recipes using the `recipes` property. Each child element is expected to be a JSON object with a `conditions` array. The first element to have its conditions met will be the recipe that is chosen to load. The recipe to load is defined as a standard recipe object using the `recipe` property.


!!! tip

    Each child in the `recipes` array must define a `conditions` array. If you don't want any conditions you can leave the array empty. Empty condition arrays are considered to have their conditions met.

```json
{
  "type": "forge:conditional",
  "recipes": [
    {
      "conditions": [
        {
          "type": "forge:mod_loaded",
          "modid": "examplemod"
        }
      ],
      "recipe": {
        "type": "minecraft:crafting_shapeless",
        "ingredients": [
          {
            "item": "minecraft:dirt"
          }
        ],
        "result": {
          "item": "minecraft:diamond"
        }
      }
    },
    {
      "conditions": [
        {
          "type": "forge:item_exists",
          "item": "minecraft:dirt"
        }
      ],
      "recipe": {
        "type": "minecraft:crafting_shaped",
        "pattern": ["DDD", "DDD", "DDD"],
        "key": {
          "D": {
            "item": "minecraft:dirt"
          }
        },
        "result": {
          "item": "minecraft:diamond"
        }
      }
    }
  ]
}
```

Creating a Condition Type
-------------------------
To create a new recipe condition type you will need to a custom implementation of `ICondition` that can accept potential JSON properties and then test if the environmental conditions are appropriate for loading the recipe. You will also need an `IConditionSerializer`, this is responsible for constructing your `ICondition` from the JSON data. Once you have created implementations of both interfaces you must register the IConditionSerializer with Forge. This is typically done by calling `CraftingHelper#register` in an `RegistryEvent.Register<IRecipeSerializer<?>>` event listener. 

!!! tip

    The Minecraft `JSONUtils` class is very useful when reading from JSON. It provides support for several Minecraft data types in addition to error handling and default/fallback values.
    
### Examples
For further examples see:
- [Forge's ItemExistsCondition](https://github.com/MinecraftForge/MinecraftForge/blob/1.16.x/src/main/java/net/minecraftforge/common/crafting/conditions/ItemExistsCondition.java)
- [Botania's FluxFieldCondition](https://github.com/Vazkii/Botania/blob/master/src/main/java/vazkii/botania/common/crafting/FluxfieldCondition.java)
- [Mekanism's ModVersionLoadedCondition](https://github.com/mekanism/Mekanism/blob/96cb0ef196f116f935d1cb22a38dbd6cafa95e09/src/main/java/mekanism/common/recipe/condition/ModVersionLoadedCondition.java)