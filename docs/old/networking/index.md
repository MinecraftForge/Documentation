Networking
==========

Communication between servers and clients is the backbone of a successful mod implementation.

Read an [overview][] of why networking matters and the basic strategies in thinking about networking.

There are a variety of techniques provided by Forge to facilitate communication mostly built on top of [netty][].

The simplest, for a new mod, would be [SimpleImpl][channel], where most of the complexity of the netty system is
abstracted away. It uses a message and handler style system.

[overview]: overview.md "Overview of Networking"
[netty]: https://netty.io "Netty Website"
[channel]: simpleimpl.md "SimpleImpl in Detail"
