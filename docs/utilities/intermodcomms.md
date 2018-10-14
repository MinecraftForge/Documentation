Inter-Mod Communications
=============

FML provides a data-driven Inter-Mod Communication system (often called "IMC" for short) for handling mods interoperability without creating hard-dependencies on each other.

The system is based on "message": a message contains a "receiver", a "title", and "payloads". Here, "receiver" is naturally the modid of which is going to receive this IMC message; "title" is essentially a key that tells the receiving mod what is this message about; and the "payloads" are purely data.

Depending on the types of data payloads, there are currently five (5) kinds of IMC messages: `String`, `ItemStack`, `NBTTagCompound`, `ResourceLocation`, and `Function`.

Types of messages
------

### String

A very simple IMC message; it contains a single `String` as its payloads. The exact meaning of payloads is depending on the receiving mod.

### ItemStack

An `ItemStack` message is a message with `ItemStack` as payloads. It is useful for situations where you want your items to be specially treated in another mod.

### NBTTagCompound

`NBTTagCompound` message is capable to convey a single `NBTTagCompound` in its payloads. This is a versatile solution for expressing complex data structure, e.g. recipes of custom processing devices.

### ResourceLocation

Being similar to the `String` message, a `ResourceLocation` message is also a very simple IMC message, but it contains `ResourceLocation` as its name suggests. The meaning of included `ResourceLocation` is also left for mods to define.

### Function

A `Function` message is an IMC message that contains canonical name of a class that implements `java.util.Function`. Receiver mod can utilize this for dependency injection in a reflective manner.


Sending messages
------

Sending a message to another mod is very simple; all you need are:

  - Receiver modid, so that your message goes to right place
  - A proper key, so that receiver mod recognize it
  - Valid payloads, so that receiver mod can process it correctly

In order to know what is a proper key and what are valid payloads, you may need to refer to other mod's documentations. FML does not know anything about the message details, and FML is only responsible for distributing messages to correct places.  
After you have the proper key and payloads, all you need is calling the proper methods before `FMLPostInitializationEvent`:

```java
// Sending a String message
FMLInterModComms.sendMessage(modid, key, stringPayload);

// Sending an ItemStack message
FMLInterModComms.sendMessage(modid, key, itemStackPayload);

// Sending a NBTTagCompound message
FMLInterModComms.sendMessage(modid, key, tagPayload);

// Sending a ResourceLocation message
FMLInterModComms.sendMessage(modid, key, resourceLocationPayload);

// Sending a function message
FMLInterModComms.sendFunctionMessage(modid, key, functionClassCanonicalName);
```

Usually, IMC messages are sent during `FMLInitializationEvent`.

Alternatively, if the receiver mods support so, you may also choose to send a "runtime message":

```java
// Sending a String message
FMLInterModComms.sendRuntimeMessage(modid, key, stringPayload);

// Sending an ItemStack message
FMLInterModComms.sendRuntimeMessage(modid, key, itemStackPayload);

// Sending a NBTTagCompound message
FMLInterModComms.sendRuntimeMessage(modid, key, tagPayload);

// Sending a ResourceLocation message
FMLInterModComms.sendRuntimeMessage(modid, key, resourceLocationPayload);

// Sending a function message
FMLInterModComms.sendRuntimeFunctionMessage(modid, key, functionClassCanonicalName);
```

Under most circumstances, it is unnecessary to check if a mod is present before sending an IMC message.

Receiving message(s)
------

As a mod developer, you may want to expose API in form of IMC messages, so other mods can add supports for your mod by simply sending messages. The key step is to receive those messages; IMC messages are available for retrieving during a special FML event called `FMLInterModComms.IMCEvent`.

```java
@Mod.EventHandler
public void onIMCMessageDistributed(FMLInterModComms.IMCEvent event) {
    List<FMLInterModComms.IMCMessage> messages = event.getMessages();
    for (FMLInterModComms.IMCMessage message : messages) {
        // Processing your messages here
    }
}
```

It is recommended to do sanity check on the actual message type before retrieving the data.

```java
// Check whether the message is a String message
message.isStringMessage();
// Check whether the message is an ItemStack message
message.isItemStackMessage();
// Check whether the message is a NBTTagCompound message
message.isNBTMessage();
// Check whether the message is a ResourceLocation message
message.isResourceLocationMessage();
// Check whether the message is a Function message
message.isFunctionMessage();
```

Alternatively, it is possible to call `message.getMessageType()` which will return a `Class<?>` instance that represents actual type of message payloads.

To retrieve the data, simply call the respective getters. Notice that `Function` message will have its data wrapped in an `Optional<Function<?, ?>>` instance, and you have to pass in the correct input and output `Class` as type reference in order to get desired result.

```java
if (message.isStringMessage()) {
    String stringData = message.getStringValue();
}

if (message.isItemStackMessage()) {
    ItemStack itemStackData = message.getItemStackValue();
}

if (message.isNBTMessage()) {
    NBTTagCompound nbtData = message.getNBTValue();
}

if (message.isResourceLocationMessage()) {
    ResourceLocation resourceLocation = message.getResourceLocationValue();
}

if (message.isFunctionMessage()) {
    Optional<Function<Foo, Bar>> function = message.getFunctionValue(Foo.class, Bar.class);
    if (function.isPresent()) {
        // Do further process after presence check
    }
}
```

The actual processing of payload data is entirely left for your mod to decide.
