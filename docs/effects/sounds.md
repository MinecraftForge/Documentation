Sounds
======

Terminology
-----------

| Term | Description |
|----------------|----------------|
|  Sound Events  | Something that triggers a sound effect. Examples include `minecraft:block.anvil.hit` or `botania:spreader_fire`. |
| Sound Category | The category of the sound, for example `player`, `block` or simply `master`. The sliders in the sound settings GUI represent these categories. |
|   Sound File   | The literal file on disk that is played: an .ogg file. |

`sounds.json`
-------------

This JSON defines sound events, and defines which sound files they play, the subtitle, etc. Sound events are identified with [`ResourceLocation`][loc]s. `sounds.json` should be located at the root of a resource namespace (`assets/<namespace>/sounds.json`), and it defines sound events in that namespace (`assets/<namespace>/sounds.json` defines sound events in the namespace `namespace`.).

A full specification is available on the vanilla [wiki][], but this example highlights the important parts:

```json
{
  "open_chest": {
    "subtitle": "mymod.subtitle.open_chest",
    "sounds": [ "mymod:open_chest_sound_file" ]
  },
  "epic_music": {
    "sounds": [
      {
        "name": "mymod:music/epic_music",
        "stream": true
      }
    ]
  }
}
```

Underneath the top-level object, each key corresponds to a sound event. Note that the namespace is not given, as it is taken from the namespace of the JSON itself. Each event specifies a localization key to be shown when subtitles are enabled. Finally, the actual sound files to be played are specified. Note that the value is an array; if multiple sound files are specified, the game will randomly choose one to play whenever the sound event is triggered.

The two examples represent two different ways to specify a sound file. The [wiki][] has precise details, but generally, long sound files such as background music or music discs should use the second form, because the "stream" argument tells Minecraft to not load the entire sound file into memory but to stream it from disk. The second form can also specify the volume, pitch, and weight of a sound file.

In all cases, the path to a sound file for namespace `namespace` and path `path` is `assets/<namespace>/sounds/<path>.ogg`. Therefore `mymod:open_chest_sound_file` points to `assets/mymod/sounds/open_chest_sound_file.ogg`, and `mymod:music/epic_music` points to `assets/mymod/sounds/music/epic_music.ogg`.

Creating Sound Events
---------------------

In order to actually be able to play sounds, a `SoundEvent` corresponding to an entry in `sounds.json` must be created. This `SoundEvent` must then be [registered][registration]. Normally, the location used to create a sound event should be set as it's registry name.

The `SoundEvent` acts as a reference to the sound and is passed around to play them. If a mod has an API, it should expose its `SoundEvent`s in the API.

Playing Sounds
--------------

Vanilla has lots of methods for playing sounds, and it is unclear which to use at times.

Note that each takes a `SoundEvent`, the ones registered above. Additionally, the terms *"Server Behavior"* and *"Client Behavior"* refer to the respective [**logical** side][sides].

### `World`

1. <a name="world-playsound-pbecvp"></a> `playSound(PlayerEntity, BlockPos, SoundEvent, SoundCategory, volume, pitch)`
    - Simply forwards to [overload (2)](#world-playsound-pxyzecvp), adding 0.5 to each coordinate of the `BlockPos` given.

2. <a name="world-playsound-pxyzecvp"></a> `playSound(PlayerEntity, double x, double y, double z, SoundEvent, SoundCategory, volume, pitch)`
    - **Client Behavior**: If the passed in player is *the* client player, plays the sound event to the client player.
    - **Server Behavior**: Plays the sound event to everyone nearby **except** the passed in player. Player can be `null`.
    - **Usage**: The correspondence between the behaviors implies that these two methods are to be called from some player-initiated code that will be run on both logical sides at the same time: the logical client handles playing it to the user, and the logical server handles everyone else hearing it without re-playing it to the original user.
       They can also be used to play any sound in general at any position server-side by calling it on the logical server and passing in a `null` player, thus letting everyone hear it.

3. <a name="world-playsound-xyzecvpd"></a> `playLocalSound(double x, double y, double z, SoundEvent, SoundCategory, volume, pitch, distanceDelay)`
    - **Client Behavior**: Just plays the sound event in the client world. If `distanceDelay` is `true`, then delays the sound based on how far it is from the player.
    - **Server Behavior**: Does nothing.
    - **Usage**: This method only works client-side, and thus is useful for sounds sent in custom packets, or other client-only effect-type sounds. Used for thunder.

### `ClientWorld`

1. <a name="clientworld-playsound-becvpd"></a> `playLocalSound(BlockPos, SoundEvent, SoundCategory, volume, pitch, distanceDelay)`
    - Simply forwards to `World`'s [overload (3)](#world-playsound-xyzecvpd), adding 0.5 to each coordinate of the `BlockPos` given.

### `Entity`

1. <a name="entity-playsound-evp"></a> `playSound(SoundEvent, volume, pitch)`
    - Forwards to `World`'s [overload (2)](#world-playsound-pxyzecvp), passing in `null` as the player.
    - **Client Behavior**: Does nothing.
    - **Server Behavior**: Plays the sound event to everyone at this entity's position.
    - **Usage**: Emitting any sound from any non-player entity server-side.

### `PlayerEntity`

1. <a name="playerentity-playsound-evp"></a> `playSound(SoundEvent, volume, pitch)` (overriding the one in [`Entity`](#entity-playsound-evp))
    - Forwards to `World`'s [overload (2)](#world-playsound-pxyzecvp), passing in `this` as the player.
    - **Client Behavior**: Does nothing, see override in [`ClientPlayerEntity`](#clientplayerentity-playsound-evp).
    - **Server Behavior**: Plays the sound to everyone nearby *except* this player.
    - **Usage**: See [`ClientPlayerEntity`](#clientplayerentity-playsound-evp).

### `ClientPlayerEntity`

1. <a name="clientplayerentity-playsound-evp"></a> `playSound(SoundEvent, volume, pitch)` (overriding the one in [`PlayerEntity`](#playerentity-playsound-evp))
    - Forwards to `World`'s [overload (2)](#world-playsound-pxyzecvp), passing in `this` as the player.
    - **Client Behavior**: Just plays the Sound Event.
    - **Server Behavior**: Method is client-only.
    - **Usage**: Just like the ones in `World`, these two overrides in the player classes seem to be for code that runs together on both sides. The client handles playing the sound to the user, while the server handles everyone else hearing it without re-playing to the original user.

[loc]: ../concepts/resources.md#resourcelocation
[wiki]: https://minecraft.gamepedia.com/Sounds.json
[registration]: ../concepts/registries.md#methods-for-registering
[sides]: ../concepts/sides.md
