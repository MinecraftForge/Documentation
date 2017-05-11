Intro to the Animation API
===============================

The Forge Animation API lets you animate json (and B3D) models.
Before you start reading this, you should know how vanilla JSON models are created, and should have 
read the documentation on blockstates.

!!! note
    
    Although you can use B3D models with the Animation API, most of this documentation will assume you
    are using JSON files. (TODO) See the page on using B3D models for more information

The Animation API is made up of two main components: armature files and animation state machine (ASM) files.
Armature files define joints and clips for JSON files. Joints are names for cubes in the model file with weights, while
clips are a set of transformations to apply to joints. ASM files define the various states an animation can be in, as well as what
transitions exist between those states. They also define the parameters for an animation, generally used as inputs to clips, but can also
trigger events. Events are essentially a way to recieve in-code notifications when the animation reaches a certain point, but can also trigger
a transition.
 
Location Conventions
-----------------------
 
 ASM Files are normally stored in the `asms/block` for blocks or `asms/item` for items and so on.
 
 Armature files must be stored in the `armatures` folder, and should be in the `blocks` subfolder for blocks and so on.

