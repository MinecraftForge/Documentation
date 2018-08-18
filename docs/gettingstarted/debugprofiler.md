# Debug Profiler

Minecraft provides a Debug Profiler that can be used to find time consuming code. Specially considering things like `TickEvents` and Ticking `TileEntities` this can be very useful for modders and server owners that want to find a lag source.

## Using the Debug Profiler

The Debug Profiler is very simple to use. It requires two commands `/debug start`, which starts the profiling process, and `/debug stop`, which ends it.
The important part here is that the more time you give it to collect the data the better the results will be.
It is recommended to at least let it collect data for a minute.

!!! note
  Naturally, you can only profile code paths that are actually being reached. Entities and TileEntities that you want to profile must exist in the world to show up in the results.

After you've stopped the debugger it will create a new file, it can be found within the `debug` subdirectory in your run directory.
The file name will be formatted with the date and time as `profile-results-yyyy-mm-dd_hh.mi.ss.txt`

## Reading a Profiling result

At the top it first tells you how long in milliseconds it was running and how many ticks ran in that time.

Below that, you will find information similar to the snippet below:
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

| [02]                     | tick                  | 99.31%       | 95.81%       |
| :----------------------- | :---------------------- | :----------- | :----------- |
| The Depth of the section | The Name of the Section | The percentage of time it took in relation to it's parent. For Layer 0 it's the percentage of the time a tick takes, while for Layer 1 it's the percentage of the time its parent takes | The second Percentage tells you how much Time it took from the entire tick.

## Profiling your own code

The Debug Profiler has basic support for `Entity` and `TileEntity`. If you would like to profile something else, you may need to manually create your sections like so:
```JAVA
  Profiler#startSection(yourSectionName : String);
  //The code you want to profile
  Profiler#endSection();
```
You can obtain the the `Profiler` instance from a `World`, `MinecraftServer`, or `Minecraft` instance.
Now you just need to search the File for your section name.
