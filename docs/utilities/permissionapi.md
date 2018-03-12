PermissionAPI
=============

The PermissionAPI is a very basic implementation of a permission system.

It's default implementation doesn't add propper permission handling though, but instead just has 3 "permission levels", (ALL = all players, OP = operators, NONE = no player).

This behaviour can be changed by mods which utilize the permission node, instead of the "permission level".

How to use the PermissionAPI
-----------------------------

For basic support you just need to call `PermissionAPI.hasPermission(EntityPlayer player, String  node)`,

though in case that there is no mod changing the default behaviour this will always return false.

So if we want that all players, or just OP's are able to use this as default, we also need to register our permission node.

Achieving this is as simple as checking for permissions: `PermissionAPI.registerNode(String node, DefaultPermissionLevel level, String description)`

though this has to be done in Init or Later.

!!! note
    The PermissionAPI isn't restricted to be used for commands, you could also use it for other things, like restricting acces to a GUI.

DefaultPermissionLevel
--------------

The DefaultPermissionLevel is used by the default implementation of the IPermissionHandler, it supports 3 Values:
`ALL = all players, OP = only operators, NONE = neither normal player or operators`

Permission node
---------------------------------------

While there are theoraticly no rules for the permission nodes, the best practice for them is to be `modid.subgroup.permission_id`

It is recommended to use this naming scheme as other implemntations may have stricter rules.

Making an own Implementation of the PermissionHandler
--------------------------------------

By default the PermissionHandler isn't very usefull, but this can be changed with an own instance of the IPermissionHandler.

!!! note
    Not every mod that want's to use the PermissionAPI should change the PermissionHandler as there can be just 1 at the same time!

First of how you want to implement an own PermissionHandler is completly up to you, you can use files, a database or whatever you want.

All you need to do is create an own instance of the interface `IPermissionHandler` and overwriting it's methods,

after that is done, you also need to register it, this is done by calling `PermissionAPI.setPermissionHandler(IPermissionHandler handler)`

!!! note
    You've got to set the Handler during PreInit!
    It is also recommended to check if it wasn't already replaced by another mod.
