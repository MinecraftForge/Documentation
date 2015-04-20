# Networking

Communication between servers and clients is the backbone of a successful mod implementation.

Forge supports a variety of techniques to implement this communication - mostly built on top of [netty][]. 
The simplest, for a new mod, would be [SimpleImpl][], where most of the complexity of the netty system is
abstracted away. It uses a message style system.
[netty]: http://netty.io "Netty website"
[SimpleImpl]: simpleimpl.md "SimpleImpl in detail"
