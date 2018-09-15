Networking
==========

Communication between servers and clients is the backbone of a successful mod implementation.

Read an [overview][] of why networking matters and the basic strategies in thinking about networking.

[overview]: overview.md "Overview of networking"

There are a variety of techniques provided by Forge to facilitate communication - mostly built on top of [netty][].

The simplest, for a new mod, would be [SimpleImpl][], where most of the complexity of the netty system is
abstracted away. It uses a message and handler style system.

[netty]: https://netty.io "Netty website"
[SimpleImpl]: simpleimpl.md "SimpleImpl in detail"
