Networking
==========

Communication between servers and clients is the backbone of a successful mod implementation.

There are two primary goals in network communication:

1. Making sure the client view is "in sync" with the server view
    - The flower at coordinates (X, Y, Z) just grew
2. Giving the client a way to tell the server that something has changed about the player
    - the player pressed a key

The most common way to accomplish these goals is to pass messages between the client and the server. These messages will usually be structured, containing data in a particular arrangement, for easy sending and receiving.

There are a variety of techniques provided by Forge to facilitate communication mostly built on top of [netty][].

The simplest, for a new mod, would be [SimpleImpl][channel], where most of the complexity of the netty system is abstracted away. It uses a message and handler style system.

[netty]: https://netty.io "Netty Website"
[channel]: ./simpleimpl.md "SimpleImpl in Detail"
