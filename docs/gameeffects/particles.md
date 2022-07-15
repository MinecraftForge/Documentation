Particles
=========

Particles are an effect within the game used as polish to better improve immersion. Their usefulness also requires great caution because of their methods of creation and reference.

Creating a Particle
-------------------

Particles are broken up between its [**client only**][sides] implementation to display the particle and its common implementation to reference the particle or sync data from the server.

| Class            | Side   | Description |
| :---             | :---:  |     :---    |
| ParticleType     | BOTH   | The registry object of a particle's type definition used to reference the particle on either side |
| ParticleOptions    | BOTH   | A data holder used to sync information from the network or a command to the associated client(s) |
| ParticleProvider | CLIENT | A factory registered by the `ParticleType` used to construct a `Particle` from the associated `ParticleOptions`.
| Particle         | CLIENT | The renderable logic to display on the associated client(s) |

### ParticleType

A `ParticleType` is the registry object defining what a particular particle type is and provides an available reference to the specific particle on both sides. As such, every `ParticleType` must be [registered][registration].

Each `ParticleType` takes in two parameters: an `overrideLimiter` which determines whether the particle renders regardless of distance, and a `ParticleOptions$Deserializer` which is used to read the sent `ParticleOptions` on the client. As the base `ParticleType` is abstract, a single method needs to be implemented: `#codec`. This represents how to encode and decode the associated `ParticleOptions` of the type.

!!! note
    `ParticleType#codec` is only used within the biome codec for vanilla implementations.

In most cases, there is no need to have any particle data sent to the client. For these instances, it is easier to create a new instance of `SimpleParticleType`: an implementation of `ParticleType` and `ParticleOptions` which does not send any custom data to the client besides the type. Most vanilla implementations use `SimpleParticleType` besides redstone dust for coloring and block/item dependent particles.

!!! important
    A `ParticleType` is not needed to make a particle spawn if only referenced on the client. However, it is necessary to use any of the prebuilt logic within `ParticleEngine` or spawn a particle from the server.

### ParticleOptions

An `ParticleOptions` represents the data that each particle takes in. It is also used to send data from particles spawned via the server. All particle spawning methods take in a `ParticleOptions` such that it knows the type of the particle and the data associated with spawning one.

`ParticleOptions` is broken down into three methods:

| Method         | Description |
| :---           | :---        |
| getType        | Gets the type definition of the particle, or the `ParticleType`
| writeToNetwork | Writes the particle data to a buffer on the server to send to the client
| writeToString  | Writes the particle data to a string

These objects are either constructed on the fly as needed, or they are singletons as a result of being a `SimpleParticleType`.

#### ParticleOptions$Deserializer

To receive the `ParticleOptions` on the client, or to reference the data within a command, the particle data must be deserialized via `ParticleOptions$Deserializer`. Each method within `ParticleOptions$Deserializer` has a parity encoding method within `ParticleOptions`:

| Method      | ParticleOptions Encoder | Description |
| :---        | :---:                 | :---        |
| fromCommand | writeToString         | Decodes a particle data from a string, usually from a command. |
| fromNetwork | writeToNetwork        | Decodes a particle data from a buffer on the client. |

This object, when needing to send custom particle data, is passed into the constructor of the `ParticleType`.

### Particle

A `Particle` provides the rendering logic needed to draw said data onto the screen. To create any `Particle`, two methods must be implemented:

| Method        | Description |
| :---          | :---        |
| render        | Renders the particle onto the screen. |
| getRenderType | Gets the render type of the particle. |

A common subclass of `Particle` to render textures is `TextureSheetParticle`. While `#getRenderType` needs to be implemented, whatever the texture sprite is set will be rendered at the particle's location.

#### ParticleRenderType

`ParticleRenderType` is a variation on `RenderType` which constructs the startup and teardown phase for every particle of that type and then renders them all at once via the `Tesselator`. There are six different render types a particle can be in.

| Render Type                | Description |
| :---                       | :---        |
| TERRAIN_SHEET              | Renders a particle whose texture is located within the available blocks. |
| PARTICLE_SHEET_OPAQUE      | Renders a particle whose texture is opaque and located within the available particles. |
| PARTICLE_SHEET_TRANSLUCENT | Renders a particle whose texture is translucent and located within the available particles. |
| PARTICLE_SHEET_LIT         | Same as `PARTICLE_SHEET_OPAQUE` except without using the particle shader. |
| CUSTOM                     | Provides setup for blending and depth mask but provides no rendering functionality as that would be implemented within `Particle#render`. |
| NO_RENDER                  | The particle will never render. |

Implementing a custom render type will be left as an exercise to the reader.

### ParticleProvider

Finally, a particle is usually created via an `ParticleProvider`. A factory has a single method `#createParticle` which is used to create a particle given the particle data, client level, position, and movement delta. Since a `Particle` is not beholden to any particular `ParticleType`, it can be reused in different factories as necessary.

An `ParticleProvider` must be registered by subscribing to the `RegisterParticleProvidersEvent` on the **mod event bus**. Within the event, the factory can be registered via `#register` by supplying an instance of the factory to the method.

!!! important
    `RegisterParticleProvidersEvent` should only be called on the client and thus sided off in some isolated client class, referenced by either `DistExecutor` or `@EventBusSubscriber`.

#### ParticleDescription, SpriteSet, and SpriteParticleRegistration

There are three particle render types that cannot use the above method of registration: `PARTICLE_SHEET_OPAQUE`, `PARTICLE_SHEET_TRANSLUCENT`, and `PARTICLE_SHEET_LIT`. This is because all three of these particle render types use a sprite set that is loaded by the `ParticleEngine` directly. As such, the textures supplied must be obtained and registered through a different method. This will assume your particle is a subtype of `TextureSheetParticle` as that is the only vanilla implementation for this logic.

To add a texture to a particle, a new JSON file must be added to `assets/<modid>/particles`. This is known as the `ParticleDescription`. The name of this file will represent the registry name of the `ParticleType` the factory is being attached to. Each particle JSON is an object. The object stores a single key `textures` which holds an array of `ResourceLocation`s. Any `<modid>:<path>` texture represented here will point to a texture at `assets/<modid>/textures/particle/<path>.png`.

```js
{
  "textures": [
    // Will point to a texture located in
    // assets/mymod/textures/particle/particle_texture.png
    "mymod:particle_texture",
    // Textures should by ordered by drawing order
    // e.g. particle_texture will render first, then particle_texture2
    //      after some time
    "mymod:particle_texture2"
  ]
}
```

To reference a particle texture, the subtype of `TextureSheetParticle` should either take in an `SpriteSet` or a `TextureAtlasSprite` obtained from `SpriteSet`. `SpriteSet` holds a list of textures which refer to the sprites as defined by our `ParticleDescription`. `SpriteSet` has two methods, both of which grab a `TextureAtlasSprite` in different methods. The first method takes in two integers. The backing implementation allows the sprite to have a texture change as it ages. The second method takes in a `Random` instance to get a random texture from the sprite set. The sprite can be set within `TextureSheetParticle` by using one of the helper methods that takes in the `SpriteSet`: `#pickSprite` which uses the random method of picking a texture, and `#setSpriteFromAge` which uses the percentage method of two integers to pick the texture.

To register these particle textures, a `SpriteParticleRegistration` needs to be supplied to the `RegisterParticleProvidersEvent#register` method. This method takes in an `SpriteSet` holding the associated sprite set for the particle and creates an `ParticleProvider` to create the particle. The simplest method of implementation can be done by implementing `ParticleProvider` on some class and having the constructor take in an `SpriteSet`. Then the `SpriteSet` can be passed to the particle as normal.

Spawning a Particle
-------------------

Particles can be spawned from either level instance. However, each side has a specific way to spawn a particle. If on the `ClientLevel`, `#addParticle` can be called to spawn a particle or `#addAlwaysVisibleParticle` can be called to spawn a particle that is visible from any distance. If on the `ServerLevel`, `#sendParticles` can be called to send a packet to the client to spawn the particle. Calling the two `ClientLevel` methods on the server will result in nothing.

[sides]: ../concepts/sides.md
[registration]: ../concepts/registries.md#methods-for-registering
