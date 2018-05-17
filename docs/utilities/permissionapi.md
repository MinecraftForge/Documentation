PermissionAPI
=============

The PermissionAPI is a very basic implementation of a permission system.
Its default implementation doesn't add an advanced permission handling (like we know it for example from PEX), 
but instead it has 3 permission levels, (ALL = all players, OP = operators, NONE = neither normal players nor operators).
This behaviour can be changed by mods which implement their own PermissionHandler.

How to use the PermissionAPI
-----------------------------

For basic support you just need to call `PermissionAPI.hasPermission(EntityPlayer player, String  node)`,
though by default this is going to return always false, as the default implementation uses the permission level `NONE`
So if we want that all players, or just OP's to be able to use this  we also need to register our permission node.
Achieving this is as simple as checking for permissions: `PermissionAPI.registerNode(String node, DefaultPermissionLevel level, String description)`, 
though this has to be done in Init or Later.

!!! note
    The PermissionAPI isn't restricted to be used for commands, you could also use it for other things, like restricting access to a GUI.
   Also, you need to check if your `ICommandSender` is a player if you use it in combination with commands!

`DefaultPermissionLevel`
--------------

The `DefaultPermissionLevel` has 3 Values:
* ALL =all players got this permission
* OP = only operators got this permission
* NONE = neither normal players nor operators got this permission

Permission node
---------------------------------------

While there are technically no rules for the permission nodes, the best practice is to be of the form `modid.subgroup.permission_id`
It is recommended to use this naming scheme as other implementations may have stricter rules.

Making your own implementation of the `PermissionHandler`
--------------------------------------

By default the PermissionHandler is very basic, which is usually enough for most users, 
but you might want more control over the permissions for things like a big server.
This can be achieved  by creating a custom `PermissionHandler`.

How it works and what is capable of, is totally up to you, for example you could make a simple implementation just saving a file per player.
Or you could make it as advanced as PEX, having database support and many other functions.

!!! note
    Not every mod that wants to use the PermissionAPI should change the PermissionHandler as there can be only 1 at the same time!

First off, how you implement your own PermissionHandler is completely up to you, you can use files, a database or whatever you want.
All you need to do is create your own implementation of the interface `IPermissionHandler`.
After that is done, you also need to register it using:  `PermissionAPI.setPermissionHandler(IPermissionHandler handler)`

!!! note
    You've got to set the Handler during PreInit!
    It is also recommended to check if it wasn't already replaced by another mod.