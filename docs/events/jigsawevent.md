Jigsaw Event
============

[Jigsaw blocks][jigsaws] are a complicated yet very useful mechanic to generate complex structures. This guide will not explain how they work and how to create the necessary files for them. It will help to understand how to use the Jigsaw Event to modify jigsaw patterns in a way that is compatible with other mods. 

Firing of the event
-------------------
The event is fired from `JigsawManager.Assembler#tryPlacingChildren` and is fired for each Jigsaw block generated in the world. For villages, that can range from ~200 to ~600 firing of the event per generation. This occurs during worldgen so the event must be processed **as efficiently as possible**. 

Jigsaw Pattern Modification
-----------------
The event allows to modify the pattern of jigsaw pieces that the jigsaw block being placed is referencing. The `pieces` field of the event contains all possible pieces (a lot are duplicates!), from which one will be picked randomly. Vanilla jigsaw patterns for villages are located in their respective `[Biome]VillagePools` class, but are messy to look at. A better formatted version of the plains vilage patterns can be found [here][plainsvillagepoolsgist] for reference. 

### Fallback pieces

There are actually more pieces that are always added to patterns, called fallback pieces. These are mostly empty jigsaw pieces and are **not** available in the event, to prevent potential infinite generation issues.

### Town Center patterns

The only patterns that are **not available** through the event are the town center (or any equivalent for non-villages) patterns, since they are the start of the village and do not come from a jigsaw block. 

Using the event
---------------
The event provides 3 fields to pinpoint which pattern is currently being picked from. 

- `generalType` gets its value from the `STRUCTURE_TYPES` list. The "modded" value is the default value if no other value corresponds, indicating that the pattern is not a vanilla one.
- `specificType` is equal to the rest of the pattern's resource location. Some examples are "houses", "streets", "animals" or "villagers". 
- `isZombie` is true when the structure is the "zombified" version of a village structure.

Adding a custom's villager house is now just :
```java
if(event.specificType.equals("houses"))
    event.pieces.add(new SingleJingsawPiece("namespace:path"));
```
However, as mentioned briefly above, jigsaw patterns contain multiple of the same jigsaw piece so test the frequency of the structure and add more if needed.

Finally, the event also provides the `currentDepth` of the structure's generation. At 0, the event is fired from the towncenter's (or any starting piece) jigsawblocks. The max value can be found in the structure's IFeatureConfig, but is in general 6. This allows for additions/removals to be dependent on the size of the village. 

Potential mistakes
------------------
Adding in a jigsaw piece that is not of the same volume as others in the pattern can *in some cases* lead to strange behaviour. 

It is also possible to take over vanilla generation by adding an identical/similar jigsaw piece, but with jigsaw blocks pointing to different patterns. However, since this completely ends vanilla generation, other mods will not be able to influence/add to those pools. It also increases the amount of generation the mod is responsible for, making bugs more probable.

### Useful debugging tip
The buffet world generation type is helpful to have a single biome and maximize village generation to test frequency and/or debug structure placements.

[jigsaws]: https://minecraft.gamepedia.com/Jigsaw_Block
[plainsvillagepoolsgist]: https://gist.github.com/Cyborgmas/0aea49f1cc940abf06da3443c65e1678