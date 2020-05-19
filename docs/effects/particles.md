Particles
=========

Terminology
-----------
| Term | Description |
|----------------|----------------|
| Particle | What is responsible for the rendering logic. |
| ParticleType<?> | What is registered using a unique name. |
| IParticleData | What contains extra data that needs to be saved. |
| IParticleFactory | The factory takes in an IParticleData and return a Particle. <br> It will be registered using a unique ParticleType. |

Different Particles
-------------------
There are 4 abstract particle classes: Particle, TexturedParticle,  SpriteTexturedParticle and SimpleAnimatedParticle.
Each inherit from the previous and your new Particle has to extend one of these.
If you need the same particle effect/style but with different parameters (color, speed, texture) this can be accomplished using only [one implementation](#IParticleFactory) of Particle.

For example, if you were to have an item that cleanse a certain magical element like fire, you could create a CleansingParticle. Then, the same Particle class could do the same effect for air but with different colors.

ParticleTypes
-------------
#### Vanilla Implementation
While there are a lot of Particle implementation in vanilla, in almost all cases vanilla uses BasicParticleType, a basic implementation of ParticleType and IParticleData. <br>
The only vanilla particles that do not use BasicParticleType are for redstone dust and for block/item texture dependent particles.
Meaning in most cases, BasicParticleType will suit your needs.

#### Registering
ParticleType<?> is a ForgeRegistryEntry, so it is [registered normally][registration]. 
A ParticleType should be created for each variant of your Particle that you need. 
Referring to the earlier example, for 4 cleansing effect (fire, water, earth, air), 4 ParticleType need to be registered.

IParticleFactory
----------------
To tie up everything, you need to implement an IParticleFactory. One factory needs to be registered for every ParticleType you register. 
In the factory's constructor, you could add a parameter to have different effects, like color. That way, instead of having data in IParticleData, it will be in the constructor directly.
IParticleFactory has one method, makeParticle, which returns a Particle. You then return an instance of your particle. If you are using a BasicParticleType, that field will be unused.

#### Registering
Factories need to be added to the ParticleManager. The ParticleFactoryRegisterEvent is fired when you should do so, then use: ``` Minecraft#getInstance()#particles#registerFactory()```
to register your factory. It needs a unique ParticleType (from it, it will get the registry name) and an instance of your IParticleFactory.

!!! Important

  IParticleFactory is [**client only**][sides]. A way of dealing with this is using a handler class and the EventBusSubscriber annotation with a dist value.

[registration]: ../concepts/registries.md#registering-things
[sides]: ../concepts/sides.md