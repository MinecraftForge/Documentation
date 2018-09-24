Intro to the Animation API
===============================

The Forge Animation API lets you animate JSON (and B3D) models.
Before you start reading this, you should know how vanilla JSON models are created, and should have 
read the documentation on blockstates.

!!! note
    
    Although you can use B3D models with the Animation API, most of this documentation will assume you
    are using JSON files. (TODO) See the page on using B3D models for more information

The Animation API is made up of two main components: armature files and animation state machine (ASM) files.
Armature files define joints and clips for JSON files. Joints are names for cubes in the model file with weights (see the [page on armatures][arm] for more info), while
clips are a set of transformations to apply to joints over time (think of a clip from a movie for example). ASM files define the various states an animation can be in, as well as what
transitions exist between those states. They also define the parameters for an animation (functions which return a floating point number), which are generally used as inputs to clips, but can also
trigger events. Events are essentially a way to receive in-code notifications when the animation reaches a certain point or to trigger transitions.

Filesystem Structure Conventions
-----------------------
 
 ASM Files are normally stored in the `asms/block` for blocks or `asms/item` for items and so on. You specify where to load
 them from, so their location is really up to you.
 
 Armature files _must_ be stored in the `armatures` folder. They are looked up by taking the path to your model file, removing `models/` and taking whats left and prepending
 `armatures/`, so a model in `models/block/test.json` becomes `armatures/block/test.json`.

[arm]: armature.md
