Advancements Display
====================

How To Make Advancements Look Like You Want
-------------------------------------------
The display object in your advancement's `.json` is where you change how an advancement looks. Here is a table of what each tag in the display object does:

|         Tag Name | Tag Value | Default | Tag Description                                                                 |
|-----------------:|:---------:|:-------:|---------------------------------------------------------------------------------|
|             icon |  `object` |   N/A   | The data for the icon                                                           |
|            title |  `string` |   N/A   | The raw title for an advancement                                                |
|            title |  `object` |   N/A   | A translate tag for using a lang file entry                                     |
|      description |  `string` |   N/A   | The raw description for an advancement                                          |
|      description |  `object` |   N/A   | A translate tag for using a lang file entry                                     |
|            frame |  `string` |  `task` | A specifier for the frame; `challenge`, `goal` or `task`.                       |
|       show_toast | `boolean` |  `true` | Shows a toast pop-up upon completion                                            |
| announce_to_chat | `boolean` |  `true` | Chat message announcing completion                                              |
|           hidden | `boolean` | `false` | Hides this advancement and children on the advancements screen until completion |

Advancement Icon
----------------
In your advancement `.json`, you describe the `icon` object using either an `item` string, or both and `item` string and an `nbt` string. The `item` string is the id of the item such as `minecraft:cobblestone`, and the `nbt` string describes an nbt tag such as `{Potion:luck}`.

Advancement Title and Description
---------------------------------
In your advancement `.json`, you have 2 choices for describing it's `title` or `description`, that is you can either just provide a string: `"title": "My Advancement"` or you can give a translate key: `"title": {"translate":"advancements.mod.category.myadv.title"}`. 

Advancement Frame
-----------------
In your advancement `.json`, you can change the `frame` to be different from the default of `task`, to do this specify either `goal` or `challenge`. The table below shows the different frames types.
| Frame Name |                     Frame Regular Icon                     |                     Frame Completed Icon                     |
|-----------:|:----------------------------------------------------------:|:------------------------------------------------------------:|
|       task |    ![Task Regular Icon](https://i.imgur.com/ZUvJ4jc.png)   |    ![Task Completed Icon](https://i.imgur.com/3gfBrNb.png)   |
|       goal |    ![Goal Regular Icon](https://i.imgur.com/6coVFqT.png)   |    ![Goal Completed Icon](https://i.imgur.com/gFfJLYO.png)   |
|  challenge | ![Challenge Regular Icon](https://i.imgur.com/feUoc2M.png) | ![Challenge Completed Icon](https://i.imgur.com/IDsuroK.png) |