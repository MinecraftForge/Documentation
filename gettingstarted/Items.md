# Structuring Sidenote
For any item that does something, e.g. right click functionality, stored metadata, gui, etc, you will need to create your own class that extends `Item` and use that class for everything with that item (more on that later). Some people prefer to declare everything for their item in its own class, others prefer to declare all items in one class, which is more commonly used -- slightly less code and more likely to be used in tutorials. Just note that you may see others put everything together.
#Making an Item
Any item, modded or vanilla, added to the minecraft world is an extension of the `Items` class from Minecraft. Start by declaring a variable of type Item, setting it as `new Item()`, thus telling minecraft that this will be an item. If you need help with (or don't know) proper naming schemes/conventions, see the Structuring documentation. The next step is to add/set an unlocalized name for your item. Unlocalized names are the strings Minecraft uses to identify each unique item/block instead of the numerical id system as of 1.7. Unlocalized names are set on an item with the `.setUnlocalizedName(String)` function of the Item class; If you have a creative tab, you can put that declaration here as well (`.setCreativeTab()`).

If your item is ever going to have functionality other than as a crafting component (see above note in Structuring), you will need to make your own class extending `Item` and then use that class in place of `Item()` when making the item. e.g. `testItem = new Item()` becomes `testItem = new testItemClass()`. More on extended Item classes below.

Registering Items and Item Renders:

In order for Minecraft to add your item to the game, you need to register it with the GameRegistry using `GameRegistry.registerItem(itemVariable, itemVariable's unlocalized name)`

Once you do that, you need to register the item's texture with the game. You will just need to pass your item variable (itemVariable) to `Minecraft.getMinecraft().getRenderItem().getItemModelMesher().register(itemVariable, 0, new ModelResourceLocation(Reference.MOD_ID + ":" + itemVariable.getUnlocalizedName().substring(5), "inventory"));`. The first half up until `.register()` is getting to the correct register function, and after that, you pass your item, the metadata of the item (usually 0), and then the location of your item's json files and png textures.

#Custom Item Classes
When it occurs to you that some of your items may need to do stuff. make a class that `extends Item`. As stated above, you will want to use this class instead of `Item()` when declaring your item so that the class is actually used. It is in this class that you will override  all of your functions you need from Item(). The most notable and used functions are `onItemRightClick()` and `onItemUse()`, uses being quite obvious (I hope).
