Particles
=========

Terminology
-----------
| Term | Description |
|----------------|----------------|
| Particle | What is responsible for the rendering logic. |
| ParticleType<?> | What is registered using a unique name. |
| IParticleData | What contains server data that needs to be transferred to the client. |
| IParticleFactory | The factory takes in an IParticleData and returns a Particle. <br> It will be registered using a unique ParticleType. |

Different Particles
-------------------
There are 4 abstract particle classes: Particle, TexturedParticle,  SpriteTexturedParticle and SimpleAnimatedParticle. Each inherit from the previous and your own Particle has to extend one of these.
In it, the rendering of the Particle is handled. I suggest looking at vanilla examples on how to handle rendering, this guide will not get into that, only the logic part of Particles.

### Sidedness

The Particle class is [**client only**][sides], it does not exist on the server.
This means that creating a fixed parameter particle (no context information needed) is somewhat simpler, more on that later. 
However, if the particle has a parameter with continuous values, server information is required. For example, breaking blocks create a particle effect based on the broken block's texture.
This information obviously depends on the BlockState of the block, which is taken from the server. <br>
When adding a particle on the client, use ClientWorld#addParticle, but on the server it is ServerWorld#spawnParticle. ServerWorld#addParticle will simply do nothing (careful, one overload of the method in World is ClientOnly). 

### Does your particle need server data?
Say you want to emit a particle on spell use. If you have 8 type of spells with each one specific color no need for server information. Each spell will have a distinct registered ParticleType. 
However, if these spells can have modifiers that can affect the color in multiple ways (add/subtract red/green/blue data) then having a registry object for each combination will be fastidious. 
In that case, server information will be required.
Meaning when spawning the particle you calculate the color to pass in instead of spawning a specific particle based on which spell was used.

ParticleTypes
-------------
#### Vanilla Implementation
While there are a lot of different Particles in vanilla, in almost all cases vanilla uses BasicParticleType, a basic implementation of ParticleType and IParticleData. 
This implementation is used for anything that does not require [server data][servdat]. 
The only vanilla particles that do not use BasicParticleType are redstone dust and block/item texture dependent particles.
When requiring server data, a direct implementation of IParticleData is needed. I suggest looking over the ParticleTypes class to see all the vanilla ones.
You can then explore how vanilla implemented each particle to better evaluate what you need.

#### Registering
ParticleType<?> is a ForgeRegistryEntry, so it is [registered normally][registration]. 
A ParticleType needs to be registered for each distinct Particle. When using server information, only one ParticleType needs to be registered, since it will cover all cases.
When opting for covering all discrete cases, multiple ParticleType are registered all using BasicParticleType. The difference will come in registering the IParticleFactory.

IParticleFactory
----------------
To tie up everything, you need to implement an IParticleFactory. One factory needs to be registered for every ParticleType you register. 
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
In the example above, I have my own Color class that can be specified during registration. The downside is the colors are "hardcoded" and can't be changed using the /particle command.
However, adding a new distinct case is easy, there only needs to be a new ParticleType and the associated factory.

Finally, IParticleFactory has one method, makeParticle, which returns a Particle. You can then return an instance of your particle as shown above. If you are using a BasicParticleType, that parameter will be unused.

#### Registering
Factories need to be added to the ParticleManager. The ParticleFactoryRegisterEvent is fired when you should do so. At that point use: `Minecraft.getInstance()#particles#registerFactory()`
to register your factory. It needs a ParticleType (from it, it will get the registry name) and an instance of your IParticleFactory.
When registering discrete valued Particles, the factory will contain the discrete information, like so pertaining to my previous example:
```java 
Minecraft.getInstance().particles.registerFactory(DeferredRegistration.HEART_CRYSTAL_PARTICLE.get(), new SHParticle.Factory(Color.FIREBRICK));
Minecraft.getInstance().particles.registerFactory(DeferredRegistration.POWER_CRYSTAL_PARTICLE.get(), new SHParticle.Factory(Color.ROYALBLUE));
```
The interest in doing this is to avoid having to deal with IParticleData and not create multiple Particle implementations for each color.

!!! important

  IParticleFactory is [**client only**][sides], like the Particle class. A way of dealing with this is using a handler class and the EventBusSubscriber annotation with a dist value.

[registration]: registries.md#registering-things
[sides]: sides.md
[servdat]: #does-your-particle-need-server-data
