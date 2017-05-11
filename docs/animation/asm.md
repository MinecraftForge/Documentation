ASM Files
===========

ASM Files are the meat of the animation API. These define how the animation is carried out and how to use the clips defined in the armature file.

Concepts
----------

The ASM contains _parameters_, _clips_, _states_, and _transitions_. The simplest ones to explain are states and transitions, so I'll start with those

### States

The Animation _State_ Machine can be in many different _states_. You define which states there are in the states section.
Each _clip_ implements a state, telling the ASM how to animate it.

### Transitions

Right now, the only uses for transitions are to define which states can go to which other states, no way to make a transition-only
clip exists. In the code, the only uses for the `transitions` member of AnimationStateMachine is to verify that you said a transition
can occur between the current state and the desired next state.

### Parameters

!!! note
    
    Parameters are called `TimeValues` in the code

Each parameter can either be defined in the ASM or at load-time. Load-time parameters are usually of the type `VariableValue`, allowing you to set them from within your code.
Other kinds are `SimpleExprValue`, allowing you to do calculations relative to the current game time, `CompositionValue`, allowing you to chain parameters together, `ParameterValue`, allowing you to reference other parameters, and
`SlerpClip`, allowing you to blend between two clips.
A parameter is an input to a clip, telling it how far into the animation to animate.


### Clips

!!! note
    
    Clips can either be ASM-clips, ones that are defined in the ASM, or armature-clips, ones that are defined in the armature file.
    For the rest of this page, "clips" will refer to ASM-clips unless otherwise stated

A clip controls what a state will do. They can be one of many types, the easiest to use being the `TimeClip`. These animate a given clip by a given parameter.
Other kinds include the `IdentityClip`, which does nothing, the `ClipReference`, and just does the same as another clip,
the `SlerpClip`, which blends between two clips, useful for transitions, and the `TriggerClip`, used to both animate a clip and fire an event when its parameter goes positive.

Code API
----------

!!! warning

    The ASM code API can only be used _client side_. When storing ASMs in code, use the side-irrelevant `IAnimationStateMachine` interface.
   

ASMs can be loaded by calling `ModelLoaderRegistry.loadASM`. It takes two parameters, first being a `ResourceLocation` denoting 
where the ASM is stored, and second an ImmutableMap of load-time defined parameters.

An example:
```java
@Nullable
private final IAnimationStateMachine asm;
private final VariableValue cycle = new VariableValue(4);

public Spin() {
    if (FMLCommonHandler.instance().getSide() == Side.CLIENT) {
        asm = ModelLoaderRegistry.loadASM(new ResourceLocation(MODID, "asms/block/rotatest.json"), ImmutableMap.of("cycle_length", cycle));
    }
    else {
        asm = null;
    }
}
```

Here, an asm is loaded with one extra parameter, named `cycle_length`. This parameter is of the type `VariableValue`, so we can
set it from within our code.
 
`VariableValue` parameters can have their value set by calling `.setValue`, but oddly you can not read this value back. There is no need
to inform the ASM of this change, it happens automatically.

File Format
-------------

The ASMs have a slightly strange and confusing file format, but here's how it works.

First, a simple example:
```json
{
  "parameters": {
    "anim_cycle": ["/", "#cycle_length"]
  },
  "clips": {
    "default": ["apply", "forgedebugmodelanimation:block/rotatest@default", "#anim_cycle" ]
  },
  "states": [
    "default"
  ],
  "transitions": {},
  "start_state": "default"
}
```

