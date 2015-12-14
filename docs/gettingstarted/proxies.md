Using SidedProxies
===================

This page will go through all the benefits of using proxies and in what circumstance to use them in.

What are sided proxies
----------------------
Sided proxies are a way to introduce side-specific things into your mod's code base in such a way that the other side will not crash when referencing classes intended for the other side.

An example of this would be a piece of code meant to register item models for rendering:

```
ModelLoader.setCustomModelResourceLocation(yourItem, 0, new ModelResourceLocation("modid:model_name", "inventory"));
```

While in your @Mod file you may want to just check for an appropriate side in one of the lifecycle events, it still won't help as the will still run in the server-side, where ModelResourceLocation cannot be found, causing an error.
The solution is to use a proxy class, which only gets loaded on client, thus making sure that the above code is called on the right place.

Using sided proxies
-------------------

The main meat of using proxies is an Forge-added annotation called @SidedProxy. You give the annotation two strings as paths to your proxy classes, both client and server.
This annotation belongs above a field, whose type is a common superclass shared by both server proxy and client proxy classes.

For example:

```
@SidedProxy(clientSide = "com.yourmod.client.ClientProxy", serverSide = "com.yourmod.server.ServerProxy")
public static CommonProxy proxy;
```

Now you can use the proxy-field to refer and use your proxy's methods in order to any side-specific stuff, like registering renderers.

To go back to the above example, here is an example proxy implementation that registers the item model at appropriate time:

#### The common proxy (Notice that the method inside is abstract)
```
package com.yourmod.common;

public abstract class CommonProxy {
  public abstract void registerItemModels();
}
```

#### The client proxy (Notice how this is a subclass of the CommonProxy)
```
package com.yourmod.client;

import com.yourmod.common.CommonProxy;

import net.minecraft.client.resources.model.ModelResourceLocation;
import net.minecraftforge.client.model.ModelLoader;

public class ClientProxy extends CommonProxy {

  @Override
  public void registerItemModels() {
    ModelLoader.setCustomModelResourceLocation(yourItem, 0, new ModelResourceLocation("modid:model_name", "inventory"));
  }

}
```

#### The server proxy (Notice how the registerItemModels is still implemented, but empty)
```
package com.yourmod.server;

import com.yourmod.common.CommonProxy;

public class ServerProxy extends CommonProxy {

  @Override
  public void registerItemModels() {
    // You can put whatever here, for instance a comment to explain why this is empty.
    // The important part is that this is present.
  }

}
```

Now in your mod's preInit method you can call ```proxy.registerItemModels();``` and it won't crash with a ClassNotFoundException when you try to use your mod on a dedicated server, as Forge makes sure that the ClientProxy is never refered there, therefor eliminating any change of accidentially using that client side method implementation on server.

Uses for SidedProxies
---------------------

* Client proxy
  1. Registering renderers
  2. Registering models
  3. Registering client-specific events such as KeyboardEvent or MouseEvent
  4. Registering keybindings
* Server proxy
  1. Registering chat commands only usable on dedicated multiplayer server
