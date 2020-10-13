Particles
=========

Terminology
-----------

| Term | Description |
|----------------|----------------|
| `Particle` | What is responsible for the rendering logic. |
| `ParticleType<?>` | What is registered using a unique name. |
| `IParticleData` | What contains server data that needs to be transferred to the client. |
| `IParticleFactory` | The factory takes in an `IParticleData` and returns a `Particle`. It will be registered using a unique `ParticleType<?>`. |

Different Particles
-------------------

You will need to have your own implementation of the `Particle` class, which will handle the rendering of the particle. Vanilla examples will help you on how to handle rendering, this guide will not get into that and only discuss the logic part of particles.

### Sidedness
The `Particle` class is [**client only**][sides], it does not exist on the server. This means that creating a fixed parameter particle (no context information needed) is somewhat simpler, more on that later. However, if the particle has a parameter with dynamic values, server information is required. For example, breaking blocks create a particle effect based on the broken block's texture. This information obviously depends on the `Blockstate` of the block, which is taken from the server.

To make a particle appear, use either `ClientWorld#addParticle` or
`ServerWorld#spawnParticle`. `ServerWorld#addParticle` will simply do nothing, without throwing any errors.

### Does your particle need server data?
Taking as an example a mod which adds some spells to the game: If there's 8 type of spells added with each one specific color, there is no need for server information. Each spell will have a distinct registered `ParticleType`. 
However, if these spells can have modifiers that can affect the color in multiple ways (add/subtract red/green/blue data) then having a registry object for each combination will be tedious. In that case, server information will be required when spawning the particle, to calculate the color to use.

ParticleTypes
-------------

#### Vanilla Implementation
While there are a lot of different particles in vanilla, in almost all cases vanilla uses `BasicParticleType`, a basic implementation of `ParticleType` and `IParticleData`. This implementation is used for anything that does not require [server data][servdat]. The only vanilla particles that do not use `BasicParticleType` are redstone dust and block/item texture dependent particles. When requiring server data, a direct implementation of `IParticleData` is needed. 

The `ParticleTypes` class is very helpful to check out vanilla implementations. Seeing how vanilla implemented each particle will help better evaluate what you need.

#### Registering
`ParticleType<?>` is a `ForgeRegistryEntry`, so it is [registered normally][registration]. A `ParticleType` needs to be registered for each distinct `Particle`. When using server information, only one `ParticleType` needs to be registered, since it will cover all cases. When opting for covering all discrete cases, multiple `ParticleType`s are registered all using `BasicParticleType`. The difference will come in registering the `IParticleFactory`.

IParticleFactory
----------------

To tie up everything, you need to implement an `IParticleFactory`. One factory needs to be registered for every `ParticleType` you register. 
When covering discrete cases, you can specify a parameter in the constructor, to be able to differentiate the cases.
```java
public static class Factory implements IParticleFactory<BasicParticleType> {
  private final Color color;
  public Factory(Color color) {
    this.color = color;
  }

  @Nullable
  @Override
  public Particle makeParticle(BasicParticleType typeIn, World worldIn, double x, double y, double z, double xSpeed, double ySpeed, double zSpeed) {
    return new SHParticle(worldIn, this.color, x, y, z, xSpeed, ySpeed, zSpeed);
  }
}
```
In the example above, a `Color` can be specified during registration. The downside is the colors are "hardcoded" and can't be changed using the /particle command. However, adding a new distinct case is easy, there only needs to be a new `ParticleType` and the associated factory. Finally, `IParticleFactory` has one method, `#makeParticle`, which returns a `Particle`. You can then return a new instance of your particle as shown above. If you are using a `BasicParticleType`, that parameter will be unused.

#### Registering
Factories need to be added to the `ParticleManager`. The `ParticleFactoryRegisterEvent` is fired when you should do so. At that point use: `Minecraft.getInstance()#particles#registerFactory()` to register your factory. It needs a `ParticleType` (from it, it will get the registry name) and an instance of your `IParticleFactory`. When registering discrete valued particles, the factory will contain the discrete information, like so pertaining to the previous example:
```java 
Minecraft.getInstance().particles.registerFactory(DeferredRegistration.HEART_CRYSTAL_PARTICLE.get(), new SHParticle.Factory(Color.FIREBRICK));
Minecraft.getInstance().particles.registerFactory(DeferredRegistration.POWER_CRYSTAL_PARTICLE.get(), new SHParticle.Factory(Color.ROYALBLUE));
```
The interest in doing this is to avoid having to deal with `IParticleData` and not create multiple `Particle` implementations for each color.

!!! important

  `IParticleFactory` is [**client only**][sides], like the `Particle` class. A way of dealing with this is using a handler class and the `EventBusSubscriber` annotation with a dist value.

[registration]: ../concepts/registries.md#registering-things
[sides]: ../concepts/sides.md
[servdat]: #does-your-particle-need-server-data
