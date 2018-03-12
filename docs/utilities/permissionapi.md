PermissionAPI
=============

The PermissionAPI is a very basic implementation of a permission system.

Its default implementation doesn't add an advanced permission handling (like we know it for example from PEX), 

but instead it has 3 permission levels, (ALL = all players, OP = operators, NONE = neither normal players or operators).

This behaviour can be changed by mods which implement an own PermissionHandler.

How to use the PermissionAPI
-----------------------------

For basic support you just need to call `PermissionAPI.hasPermission(EntityPlayer player, String  node)`,

though by default this is going to return always false, as the default implementation uses the permission level `NONE`

So if we want that all players, or just OP's to be able to use this  we also need to register our permission node.

Achieving this is as simple as checking for permissions: `PermissionAPI.registerNode(String node, DefaultPermissionLevel level, String description)`, 

though this has to be done in Init or Later.

!!! note
    The PermissionAPI isn't restricted to be used for commands, you could also use it for other things, like restricting access to a GUI.
    You do also need to check if your CommandSender is a player if you use it in combination with commands!

DefaultPermissionLevel
--------------

The DefaultPermissionLevel has 3 Values:

Permission node
---------------------------------------

While there are theoretically no rules for the permission nodes, the best practice for them is to be `modid.subgroup.permission_id`

It is recommended to use this naming scheme as other implementations may have stricter rules.

Making an own Implementation of the PermissionHandler
--------------------------------------

By default the PermissionHandler is very basic, which is usually enough for most users, 

but you might want more controll over the permissions for things like a big server.

 This can be achieved  by creating an own PermissionHandler, though it is up to you what it will be capable of,
 
 you can for example make a file to set permissions per player, or make it as advanced as PEX having database support.

!!! note
    Not every mod that want's to use the PermissionAPI should change the PermissionHandler as there can be just 1 at the same time!

First off, how you implement your own PermissionHandler is completly up to you, you can use files, a database or whatever you want.

All you need to do is create an own instance of the interface `IPermissionHandler` and overwriting it's methods,

after that is done, you also need to register it, this is done by calling `PermissionAPI.setPermissionHandler(IPermissionHandler handler)`

!!! note
    You've got to set the Handler during PreInit!
    It is also recommended to check if it wasn't already replaced by another mod.
