Particles
=========

Terminology
-----------

| Term | Description |
|----------------|----------------|
| `Particle` | What is responsible for the rendering logic. |
| `ParticleType<?>` | What is registered using a unique name. |
| `ParticleOptions` | What contains server data that needs to be transferred to the client. |
| `ParticleProvider` | The factory takes in an `ParticleOptions` and returns a `Particle`. It will be registered using a unique `ParticleType<?>`. |

Different Particles
-------------------

You will need to have your own implementation of the `Particle` class which will handle the rendering of the particle. Vanilla examples will help you on how to handle rendering. This guide will not get into that and instead only discuss the logic part.

### Sidedness
The `Particle` class is [**client only**][sides]; it does not exist on the server. This means that creating a fixed parameter particle is somewhat simpler, more on that later. However, if the particle has a parameter with dynamic values, server information is required. For example, breaking blocks create a particle effect based on the broken block's texture. This information obviously depends on the `BlockState` of the block, which is taken from the server.

To make a particle appear, use either `ClientLevel#addParticle`, `ClientLevel#addAlwaysVisibleParticle`, or
`ServerLevel#sendParticles`. `ServerLevel#addParticle` and `ServerLevel#addAlwaysVisibleParticle` will simply do nothing without throwing any errors.

### Does your particle need server data?
Taking as an example a mod which adds some spells to the game: If there are 8 types of spells added with each one specific color, there is no need for server information. Each spell will have a distinct, registered `ParticleType`. 
However, if these spells can have modifiers that can affect the color in multiple ways (add/subtract red/green/blue data), then having a registry object for each combination will be tedious. In that case, server information will be required when spawning the particle to calculate the color to use.

ParticleTypes
-------------

#### Vanilla Implementation
While there are a lot of different particles in vanilla, in almost all cases vanilla uses `SimpleParticleType`, a basic implementation of `ParticleType` and `ParticleOptions`. This implementation is used for anything that does not require [server data][servdat]. The only vanilla particles that do not use `SimpleParticleType` are redstone dust and block/item texture dependent particles. When requiring server data, a direct implementation of `ParticleOptions` is needed. 

The `ParticleTypes` class is very helpful to check out vanilla implementations. Seeing how vanilla implemented each particle will help better evaluate what you need.

#### Registering
`ParticleType<?>` is a `ForgeRegistryEntry`, so it is [registered normally][registration]. A `ParticleType` needs to be registered for each distinct `Particle`. When using server information, only one `ParticleType` needs to be registered, since it will cover all cases. When opting for covering all discrete cases, multiple `ParticleType`s are registered all using `SimpleParticleType`. The difference will come in registering the `ParticleProvider`.

ParticleProvider
----------------

To tie up everything, you need to implement an `ParticleProvider`. One factory needs to be registered for every `ParticleType` you register. 
When covering discrete cases, you can specify a parameter in the constructor to be able to differentiate the cases.
```java
public static class Provider implements ParticleProvider<SimpleParticleType> {
  private final Color color;
  public Provider(Color color) {
    this.color = color;
  }

  @Nullable
  @Override
  public Particle createParticle(SimpleParticleType typeIn, ClientLevel level, double x, double y, double z, double xSpeed, double ySpeed, double zSpeed) {
    return new SHParticle(level, this.color, x, y, z, xSpeed, ySpeed, zSpeed);
  }
}
```
In the example above, a `Color` can be specified during registration. The downside is the colors are "hardcoded" and can't be changed using the `/particle` command. However, adding a new distinct case is easy, there only needs to be a new `ParticleType` and the associated factory. Finally, `ParticleProvider` has one method, `#createParticle`, which returns a `Particle`. You can then return a new instance of your particle as shown above. If you are using a `SimpleParticleType`, that parameter will be unused.

#### Registering
Factories need to be added to the `ParticleEngine` using the `ParticleFactoryRegisterEvent`. At that point use: `ParticleEngine#register` to register your factory. It needs a `ParticleType` (from it, it will get the registry name) and an instance of your `ParticleProvider`. When registering discrete valued particles, the factory will contain the discrete information, like so pertaining to the previous example:
```java 
Minecraft.getInstance().particleEngine.register(DeferredRegistration.HEART_CRYSTAL_PARTICLE.get(), new SHParticle.Provider(Color.FIREBRICK));
Minecraft.getInstance().particleEngine.register(DeferredRegistration.POWER_CRYSTAL_PARTICLE.get(), new SHParticle.Provider(Color.ROYALBLUE));
```
The interest in doing this is to avoid having to deal with `ParticleOptions` and not create multiple `Particle` implementations for each color.

!!! warning

  If you are using an animated sprite set for your `Particle` with its associated JSON, you will need to register an `ParticleEngine$SpriteParticleRegistration` instead. Otherwise, you will throw an `IllegalStateException`.

!!! important

  `ParticleProvider` is [**client only**][sides], like the `Particle` class. A way of dealing with this is using a handler class and the `EventBusSubscriber` annotation with a dist value.

[sides]: ../concepts/sides.md
[servdat]: #does-your-particle-need-server-data
[registration]: ../concepts/registries.md#registering-things
