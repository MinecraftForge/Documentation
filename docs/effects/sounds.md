Sounds
======

!!!Note
    This guide was written at a time when the latest Forge build was build 1907 for Minecraft 1.9.0. It should be valid for any Forge version that has the new Forge registry system.

Goals
-----

  * Describe a simple way to implement sounds in Forge
  * There are many, many versions of `playSound` in Minecraft. Describe what they all do

Terminology
-----------

  * Sound Event - Something that triggers a sound effect. Examples include "minecraft:block.anvil.hit" or "botania:spreaderFire"
  * Sound Category - The category of the sound, for example "player" or "block" or simply "master". The sliders in the sound settings GUI represent these categories
  * Sound File - The literal file on disk that is played, usually an .ogg file.

Sounds.json
-----------

This json should be located in your base asset directory (src/main/resource/assets/MODID/sounds.json) and indicates to the vanilla resource system what Sound Events you declare and what Sound Files those events use.

A full specification is available [on the wiki], but we highlight the important parts here with an example:

```Json
{
  "openChest": {
    "category": "block",
    "subtitle": "mymod.subtitle.openChest",
    "sounds": [ "mymod:openChestSoundFile" ]
  },
  "epicMusic": {
    "category": "record",
    "sounds": [
      {
        "name": "mymod:music/epicMusic",
        "stream": true
      }
    ]
  }
}
```

Underneath the top-level object, each key we have defined corresponds to a Sound Event we want to tell the game about: "mymod:openChest" and "mymod:epicMusic". Note that they are written in the sounds.json without the modid.

Under each event we specify the category of the Sound Event, then a subtitle localization key to be shown to hard of hearing users when the Sound Event is played. 

Finally, we specify the actual Sound Files to be played. Note that the value is an array - if we specify multiple Sound Files then the game will randomly choose one to play whenever the Sound Event is triggered.

The top and bottom examples represent two different ways to specify a Sound File. The wiki has precise details, but generally, make sure to use the second form for long Sound Files such as BGM or music discs, because the "stream" argument tells Minecraft to not load the entire Sound File into memory but instead stream it from disk. Using the second form also allows you to specify the volume, pitch, and random weight of that Sound File - again, see the vanilla wiki for precise details.

In either case, you specify the path to your Sound File starting from your "sounds" asset directory. Thus, "mymod:openChestSoundFile" corresponds to the path "assets/mymod/sounds/openChestSoundFile.ogg" and "mymod:music/epicMusic" corresponds to the path "assets/mymod/sounds/music/epicMusic.ogg".

Code Registration
-----------------

Simply specifying the Sound Events in JSON isn't enough, however. Due to changes in the sound system in 1.9, we must also register Sound Events in code. This very simple to do: 

```Java
ResourceLocation name = new ResourceLocation("mymod", "openChest");
SoundEvent event = new SoundEvent(name);
GameRegistry.register(event, name);
```

Hold on to the `SoundEvent` object as you'll need it later to play sounds. If you have an API and want addons to be able to play your Sound Events, then put these in your API (Do not register them in your API, just have fields that you assign to in the mod-proper).

Playing Sounds
--------------

Vanilla has lots of methods for playing sounds, and it's unclear which to use at times. I've trawled through all of them and come up with what each one does and a rough idea of when to use it. This information is up-to-date as of Forge 1907, please let someone know if it is out of date!

Note that each takes a `SoundEvent`, the ones that you registered above.

In `World`:
  1. `playSound(EntityPlayer, BlockPos, SoundEvent, SoundCategory, volume, pitch)`
      - Simply forwards to the overload immediately below this one, adding 0.5 to each coordinate of the `BlockPos` given
  2. `playSound(EntityPlayer, double x, double y, double z, SoundEvent, SoundCategory, volume, pitch)`
      - LOGICAL SERVER: Plays the Sound Event to everyone nearby EXCEPT the passed in player. Player can be null.
      - LOGICAL CLIENT: If the passed in player is *the* client player, plays the  Sound Event to the client player
      - USEFUL FOR: The correspondence between the behaviours implies that these two methods are to be called from some player-initiated code that will be run on both logical sides at the same time - the logical client handles playing it to the user and the logical server handles everyone else hearing it without re-playing it to the original user.
      - They can also be used to play any sound in general at any position serverside by calling it on the logical server and passing in a `null` player, thus letting everyone hear it.

  3. `playSound(double x, double y, double z, SoundEvent, SoundCategory, volume, pitch, distanceDelay)`
      - LOGICAL CLIENT: Just plays the Sound Event in the client world. If `distanceDelay` is true, then delays the sound based on how far it is from the player. Used for thunder.
      - LOGICAL SERVER: NO-OP
      - USEFUL FOR: This method only works clientside, and thus is useful for sounds that you send in custom packets, or other client-only effect-type sounds.

In `WorldClient`:
  1. `playSound(BlockPos, SoundEvent, SoundCategory, volume, pitch, distanceDelay)`
      - Simply forwards to the overload immediately above this one, adding 0.5 to each coordinate of the `BlockPos` given

In `Entity`:
  1. `playSound(SoundEvent, volume, pitch)`
      - Forwards to `World`'s overload 2, passing in `null` as the player
      - LOGICAL CLIENT: NO-OP
      - LOGICAL SERVER: Plays the Sound Event to everyone at this entity's position
      - USEFUL FOR: Emitting any sound from any non-player entity serverside

In `EntityPlayer`, overriding the above
  1. `playSound(SoundEvent, volume, pitch)`
      - Forward to `World`'s overload 2, passing in `this` as the player
      - LOGICAL SERVER: Plays the sound to everyone nearby EXCEPT this player
      - LOGICAL CLIENT: N/A, it's overrided again below
      - USEFUL FOR: See next one.

In `EntityPlayerSP`, overriding the above two
  1. `playSound(SoundEvent, volume, pitch)`
      - Forward to `World`'s overload 2, passing in `this` as the player
      - LOGICAL SERVER: N/A
      - LOGICAL CLIENT: Just plays the Sound Event
      - USEFUL FOR: Just like the ones in world, these two overrides in the player classes seem to be for code that runs together on both sides. The client handles playing the sound to the user, while the server handles everyone else hearing it without re-playing to the original user.

[on the wiki]: http://minecraft.gamepedia.com/Sounds.json