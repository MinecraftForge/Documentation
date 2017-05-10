Intro to the Animation API
===============================

The Forge Animation API lets you animate json (and B3D) models.
Before you start reading this, you should know how vanilla JSON models are created, and should have 
read the documentation on blockstates


First, some terms:

| Term | Description |
| --- | --------- |
| Model File | Your JSON file to be animated |
| Armature File | The JSON file which defines the joints and clips of a model |
| Clip | A collection of variables to apply to certain joints. Sort of an "animation group" |
| Joint | A name for a json cube |
| ASM File | Defines how to use the armature file to animate the model |
| Parameter | Some value that is used to control what part of a clip we are on |
| State | A state for the animation to be in, controls what clips are active |
| Transitions | Controls which states go into what other states |
| Event | An event caused by animation, readable by the thing being animated |
 
 
Location Conventions
-----------------------
 
 ASM Files are normally stored in the `asms/block` for blocks or `asms/item` for items and so on.
 
 Armature files must be stored in the `armatures` folder, and should be in the `blocks` subfolder for blocks and so on.

