# Debug Profiler

Minecraft provides a Debug Profiler that can be used to find time consuming code. Specially considering things like `TickEvents` and Ticking `TileEntities` this can be very usefull for modders and server owners that want to find a lag source.

## Using the Debug Profiler

The Debug Profiler is very simple to use, it requires two commands `/debug start` and `/debug stop`
They are both pretty self explanatory, but you run `/debug start` to start the profiling process and then run `/debug stop` to stop it again.
The important part here is that the more time you give it to collect the data the better the results will be.
It is recommended to at least let it collect data for a minute.

!!! note
  You'll want to add an instance of whatever you want to test into your world.
  For example if you want to test an Entity you need to spawn it.

After you've stopped the debugger it will create a new file, it can be found within the `debug` subdirectory in your run directory.
The file name will be formatted with the date and time as profile-results-yyyy-mm-dd_hh.mi.ss.txt

## Reading a Profiling result

At the top it first tells you how long in milliseconds it was running and how many ticks ran in that time.

After that you will see something like this (this is just a snippet, yours will be longer):
```
[00] levels - 96.70%/96.70%
[01] |   World Name - 99.76%/96.47%
[02] |   |   tick - 99.31%/95.81%
[03] |   |   |   entities - 47.72%/45.72%
[04] |   |   |   |   regular - 98.32%/44.95%
[04] |   |   |   |   blockEntities - 0.90%/0.41%
[05] |   |   |   |   |   unspecified - 64.26%/0.26%
[05] |   |   |   |   |   minecraft:furnace - 33.35%/0.14%
[05] |   |   |   |   |   minecraft:chest - 2.39%/0.01%
```
Here is a small explanation of what each part means

| [00]                     | levels                  | 96.70%/96.70                                              |
| :----------------------- | :---------------------- | :-------------------------------------------------------- |
| The Depth of the section | The Name of the Section | The percentage of time it took in relation to it's parent. For Layer 0 it's the percentage of the time a tick takes, while for Layer 1 it's the percentage of the time its parent takes |

## Profiling your own code

The Debug Profiler has some basic support for Entities and TileEntities,
but in case you have something different like a lot of TickEvents,
you might need to add support on your own.
You can easily do this with this 2 lines of code:
```JAVA
  Profiler#startSection("yourSectionName");
  //The code you want to profile
  Profiler#endSection();
```
You can either obtain the Profiler from a `World` object, `MinecraftServer` or `Minecraft`

In case you do it for a `TickEvent` the result might look like this:
```
[00] levels - 96.70%/96.70%
[01] |   New World - 99.76%/96.47%
[02] |   |   tick - 99.31%/95.81%
[03] |   |   |   yourSectionName - 0.06%/0.06%
```
But the file will differ depending on your setup, and `CTRL+F` will be your friend.
