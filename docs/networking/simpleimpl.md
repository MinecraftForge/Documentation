SimpleImpl
==========

SimpleImpl is the name given to the packet system that revolves around the `SimpleChannel` class. Using this system is by far the easiest way to send custom data between clients and the server.

Getting Started
---------------

First you need to create your `SimpleChannel` object. We recommend that you do this in a separate class, possibly something like `ModidPacketHandler`. Create your `SimpleChannel` as a static field in this class, like so:

```java
private static final int PROTOCOL_VERSION = 1;
public static final SimpleChannel INSTANCE = ChannelBuilder.named(new ResourceLocation("mymodid","main"))
            .networkProtocolVersion(PROTOCOL_VERSION).
            .acceptedVersions((status, version) -> PROTOCOL_VERSION==version)
            .simpleChannel();
```
Call the `ChannelBuilder#named(ResourceLocation)` to start a building of `SimpleChannel`.
Call `networkProtocolVersion(int)` to set the version of channel.
`clientAcceptedVersions`, `serverAcceptedVersions` and `acceptedVersions` accept the argument of `VersionTest` checking whether an incoming connection protocol version is network-compatible with the client , server or both, respectively.Here, we simply compare with the `PROTOCOL_VERSION` field directly, meaning that the client and server `PROTOCOL_VERSION`s must always match or FML will deny login.If you do not call any one, channel will be required it's version is equal.
Then call `simpleCannel` to get a registered `SimpleChannel`.

The Version Checker
-------------------

If your mod does not require the other side to have a specific network channel, or to be a Forge instance at all, you should take care that you properly define your version compatibility checkers (the `Predicate<String>` parameters) to handle additional "meta-versions" (defined in `NetworkRegistry`) that can be received by the version checker. These are:

* `ABSENT` - if this channel is missing on the other endpoint. Note that in this case, the endpoint is still a Forge endpoint, and may have other mods.
* `ACCEPTVANILLA` - if the endpoint is a vanilla (or non-Forge) endpoint.

Returning `false` for both means that this channel must be present on the other endpoint. If you just copy the code above, this is what it does. Note that these values are also used during the list ping compatibility check, which is responsible for showing the green check / red cross in the multiplayer server select screen.

Registering and Handle Packets
-------------------

Next, we must declare the types of messages that we would like to send and receive. This is a example:

```java
private static final int PROTOCOL_VERSION = 1;
public static final SimpleChannel INSTANCE = ChannelBuilder.named(new ResourceLocation("mymodid","main"))
            .networkProtocolVersion(PROTOCOL_VERSION).
            .acceptedVersions((status, version) -> PROTOCOL_VERSION==version)
            .simpleChannel()
            //register messages
            .messageBuilder(MyMessage.class, NetworkDirection.PLAY_TO_SERVER)//The first parameter is the type of the message.The second of the parameter is the direction which will be asserted before any processing of this message occurs.
            .decoder(MyMessage::new)//a `Function<FriendlyByteBuf, MSG>` responsible for decoding the message from the provided `FriendlyByteBuf`.
            .encoder(MyMessage::encode)// a  `BiConsumer<MSG, FriendlyByteBuf>` responsible for encoding the message into the provided `FriendlyByteBuf`.
            .consumerMainThread(MyMessage::handle)//Handle sent message on target side.a `BiConsumer<MSG, CustomPayloadEvent.Context>` responsible for handling the message itself on the main thread.
            /*
            consumerNetworkThread
            The parameter of `consumerMainThread` is a `BiConsumer<MSG, CustomPayloadEvent.Context>` responsible for handling the 
            message itself on the network thread.As of Minecraft 1.8 packets are by default handled on the network thread.
            That means that your handler can _not_ interact with most game objects directly. Forge provides a convenient way to make your code execute on the main thread instead through `consumerMainThread`.
            */
            .add()//return the builder.It means the messages can be chained.
            //Chain another message...
```

Note the presence of `#setPacketHandled`, which is used to tell the network system that the packet has successfully completed handling.

!!! The parameters, BiConsumer<MSG, FriendlyByteBuf>, Function<FriendlyByteBuf, MSG>, BiConsumer<MSG, CustomPayloadEvent.Context>, VersionTest can be method references to either static or instance methods in Java. Remember that an instance method `MSG#encode(FriendlyByteBuf)` still satisfies `BiConsumer<MSG, FriendlyByteBuf>`; the `MSG` simply becomes the implicit first argument.

!!! warning
    Be defensive when handling packets on the server. A client could attempt to exploit the packet handling by sending unexpected data.

    A common problem is vulnerability to **arbitrary chunk generation**. This typically happens when the server is trusting a block position sent by a client to access blocks and block entities. When accessing blocks and block entities in unloaded areas of the level, the server will either generate or load this area from disk, then promptly write it to disk. This can be exploited to cause **catastrophic damage** to a server's performance and storage space without leaving a trace.

    To avoid this problem, a general rule of thumb is to only access blocks and block entities if `Level#hasChunkAt` is true.


Sending Packets
---------------

### Sending to the Server

There is but one way to send a packet to the server. This is because there is only ever *one* server the client can be connected to at once. To do so, we must again use that `SimpleChannel` that was defined earlier. Simply call `INSTANCE.send(new MyMessage(), PacketDistributor.SERVER.noArg())`. The message will be sent to the handler for its type, if one exists.

### Sending to Clients

```java
// Send to one player
INSTANCE.send(new MyMessage(), PacketDistributor.PLAYER.with(serverPlayer));

// Send to all players tracking this level chunk
INSTANCE.send(new MyMessage(), PacketDistributor.TRACKING_CHUNK.with(levelChunk));

// Send to all connected players
INSTANCE.send(new MyMessage(), PacketDistributor.ALL.noArg());
```

There are additional `PacketDistributor` types available; check the documentation on the `PacketDistributor` class for more details.