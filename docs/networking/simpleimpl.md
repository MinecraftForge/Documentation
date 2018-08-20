SimpleImpl
==========

SimpleImpl is the name given to the packet system that revolves around the `SimpleNetworkWrapper` class. Using this system is by far the easiest way to send custom data between clients and the server.

Getting Started
---------------

First you need to create your `SimpleNetworkWrapper` object. We recommend that you do this in a separate class, possibly something like `ModidPacketHandler`. Create your `SimpleNetworkWrapper` as a static field in this class, like so:

```java
public static final SimpleNetworkWrapper INSTANCE = NetworkRegistry.INSTANCE.newSimpleChannel("mymodid");
```

Where `"mymodid"` is a short identifier for your packet channel, typically just your mod ID, unless that is unusually long.

Making Packets
--------------

### IMessage

A packet is defined by using the `IMessage` interface. This interface defines 2 methods, `toBytes` and `fromBytes`. These methods, respectively, write and read the data in your packet to and from a `ByteBuf` object, which is an object used to hold a stream (array) of bytes which are sent through the network.

For an example, let's define a small packet that is designed to send a single int over the network:

```java
public class MyMessage implements IMessage {
  // A default constructor is always required
  public MyMessage(){}

  private int toSend;
  public MyMessage(int toSend) {
    this.toSend = toSend;
  }

  @Override public void toBytes(ByteBuf buf) {
    // Writes the int into the buf
    buf.writeInt(toSend);
  }

  @Override public void fromBytes(ByteBuf buf) {
    // Reads the int back from the buf. Note that if you have multiple values, you must read in the same order you wrote.
    toSend = buf.readInt();
  }
}
```

### IMessageHandler

Now, how can we use this packet? Well, first we must have a class that can *handle* this packet. This is created with the `IMessageHandler` interface. Say we wanted to use this integer we sent to give the player that many diamonds on the server. Let's make this handler:

```java
// The params of the IMessageHandler are <REQ, REPLY>
// This means that the first param is the packet you are receiving, and the second is the packet you are returning.
// The returned packet can be used as a "response" from a sent packet.
public class MyMessageHandler implements IMessageHandler<MyMessage, IMessage> {
  // Do note that the default constructor is required, but implicitly defined in this case

  @Override public IMessage onMessage(MyMessage message, MessageContext ctx) {
    // This is the player the packet was sent to the server from
    EntityPlayerMP serverPlayer = ctx.getServerHandler().playerEntity;
    // The value that was sent
    int amount = message.toSend;
    // Execute the action on the main server thread by adding it as a scheduled task
    serverPlayer.getServerWorld().addScheduledTask(() -> {
      serverPlayer.inventory.addItemStackToInventory(new ItemStack(Items.DIAMOND, amount));
    });
    // No response packet
    return null;
  }
}
```

It is recommended (but not required) that for organization's sake, this class is an inner class to your MyMessage class. If this is done, note that the class must also be declared `static`.

!!! warning

    As of Minecraft 1.8 packets are by default handled on the network thread.

    That means that your `IMessageHandler` can _not_ interact with most game objects directly.
    Minecraft provides a convenient way to make your code execute on the main thread instead using `IThreadListener.addScheduledTask`.

    The way to obtain an `IThreadListener` is using either the `Minecraft` instance (client side) or a `WorldServer` instance (server side). The code above shows an example of this by getting a `WorldServer` instance from an `EntityPlayerMP`.

!!! warning

    Be defensive when handling packets on the server. A client could attempt to exploit the packet handling by sending unexpected data.

    A common problem is vulnerability to **arbitrary chunk generation**. This typically happens when the server is trusting a block position sent by a client to access blocks and tile entities. When accessing blocks and tile entities in unloaded areas of the world, the server will either generate or load this area from disk, then promply write it to disk. This can be exploited to cause **catastrophic damage** to a server's performance and storage space without leaving a trace.

    To avoid this problem, a general rule of thumb is to only access blocks and tile entities if `world.isBlockLoaded(pos)` is true.

Registering Packets
-------------------

So now we have a packet, and a handler for this packet. But the `SimpleNetworkWrapper` needs one more thing to function! For it to use a packet, the packet must be registered with an *discriminator*, which is just an integer used to map packet types between server and client. To do this, call `INSTANCE.registerMessage(MyMessageHandler.class, MyMessage.class, 0, Side.Server);` where `INSTANCE` is the `SimpleNetworkWrapper` we defined earlier.

This is quite a complex method, so lets break it down a bit.

- The first parameter is `messageHandler`, which is the class that handles your packet. This class must always have a default constructor, and should have type bound REQ that matches the next argument.
- The second parameter is `requestMessageType` which is the actual packet class. This class must also have a default constructor and match the REQ type bound of the previous param.
- The third parameter is the discriminator for the packet. This is a per-channel unique ID for the packet. We recommend you use a static variable to hold the ID, and then call registerMessage using `id++`. This will guarantee 100% unique IDs.
- The fourth and final parameter is the side that your packet will be ***received*** on. If you are planning to send the packet to both sides, it must be registered twice, once to each side. Discriminators can be the same between sides, but are not required to be.


Using Packets
-------------

When sending packets, make sure that there is a handler registered *on the receiving side* for said packet. If there is not, the packet will be sent across the network and then thrown away, resulting in a "leaked" packet. This is harmless other than needless network usage, but should still be fixed.

### Sending to the Server

There is but one way to send a packet to the server. This is because there is only ever *one* server, and only *one* way to send to that server, of course. To do so, we must again use that `SimpleNetworkWrapper` that was defined earlier. Simply call `INSTANCE.sendToServer(new MyMessage(toSend))`. The message will be sent to the `Side.SERVER` `IMessageHandler` for its type, if one exists.

### Sending to Clients


There are four different methods of sending packets to clients:

1. `sendToAll` - Calling `INSTANCE.sendToAll` will send the packet once to every single player on the current server, no matter what location or dimension they are in.
2. `sendToDimension` - `INSTANCE.sendToDimension` takes two arguments, an `IMessage` and an integer. The integer is the dimension ID to send to, which can be gotten with `world.provider.dimensionID`. The packet will be sent to all players currently in the given dimension.
3. `sendToAllAround` - `INSTANCE.sendToAllAround` requires an `IMessage` and a `NetworkRegistry.TargetPoint` object. All players within the `TargetPoint` will have the packet sent to them. A TargetPoint requires a dimension (see #2), x/y/z coordinates, and a range. It represents a cube in a world.
4. `sendTo` - Finally, there is the option to send to a single client using `INSTANCE.sendTo`. This requires an `IMessage` and an `EntityPlayerMP` to which to send the packet. Note that though this is not the more generic `EntityPlayer`, as long as you are on the server you can safely cast any `EntityPlayer` to `EntityPlayerMP`.
