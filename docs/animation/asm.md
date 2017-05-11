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

All parameters take an input, almost always the current game time in ticks as a float. Different parameters do different things with this input.

Each parameter can either be defined in the ASM or at load-time. Load-time parameters are usually of the type `VariableValue`, which returns a value changeable in-code, ignoring its input.
Other kinds are `SimpleExprValue`, allowing you to do calculations on its input, `IdentityValue`, which just returns its input, `ConstValue` which returns a constant, `CompositionValue`, which chains parameters together and `ParameterValue`, which returns whatever anoter parameter _would_ return.
A parameter is an input to a clip, telling it how far into the animation to animate.


### Clips

!!! note
    
    Clips can either be ASM-clips, ones that are defined in the ASM, or armature-clips, ones that are defined in the armature file.
    For the rest of this page, "clips" will refer to ASM-clips unless otherwise stated

A clip takes in an input, usually the time and does something to the model with it. Differnet types of clips do different things with the input, the easiest to use being the `TimeClip` and `ModelClip`. A `TimeClip` animates a given clip by a given parameter, usually that clip is a
`ModelClip`, a reference to an armature-clip defined in an armature file.
Other kinds include the `IdentityClip`, which does nothing, the `ClipReference`, which just does the same as another clip,
the `SlerpClip`, which blends between two clips, useful for transitions, and the `TriggerClip`, used to both animate a clip and fire an event when its parameter goes positive.

### Events

Various things can trigger events in the ASM, but these are _not_ forge events. ASM events are simply strings. Events can be of two types, normal events and special events.
Special events' text is formatted like this: `!event_type:event_value`. Right now there is only one kind of `event_type`, `transition`. This tries to transition to whatever state
is defined in the `event_value`. Normal events can be _any other string_ and can be used from the `pastEvents` callback, but more information about that is on the implemting page, as
that callback is in different places depending on what is being animated.


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

Using an ASM instance, you can get the current state with `.currentState()` and transition to another state with `.transition(nextState)`
 
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

As stated above, the files have parameters, clips, states and transitions, as well as the starting state.
All of these tags are required, even if they are empty.

### Parameters

```javascript
{
    "name": <parameter_definition>
}
```

Different types of parameters have different formats for `<parameter_definition>`, and the simple ones are:

- `IdentityValue`: the string `#identity`
- `ParameterValue`: the parameter to reference, prefixed with `#`, e.g. `#my_awesome_parameter`
- `ConstValue`: a number to use as the constant to return

Other kinds are a bit more complicated

#### `SimpleExprValue`

Format: `[ regex("[+\\-*/mMrRfF]+"), <parameter_definition>, ... ]`

##### Examples:
```json
[ "+", 4 ]
[ "/+", 5, 1]
[ "++", 2, "#other" ]
[ "++", "#other", [ "compose", "#cycle", 3] ]
```

##### Explanation

`SimpleExprValue` takes its input and applies operations to it.
The first value in the list are the operations to apply. Each operation is applied in order to the input.
Each following value is another parameter definition which is evaluated with the unmodified input value.

##### Operations (case-sensitive):

- `+`: output = input + arg
- `-`: output = input - arg
- `*`: output = input * arg;
- `/`: output = input / arg;
- `m`: output = min(input, arg);
- `M`: output = max(input, arg);
- `r`: output = floor(input / arg) * arg;
- `R`: output = ceil(input / arg) * arg;
- `f`: output = input - floor(input / arg) * arg;
- `F`: output = ceil(input / arg) * arg - input;

##### Example explanations:
- input + 4
- (input / 5) + 1
- input + 2 + value of parameter other
- input + value of parameter other + value of parameter cycle given input 3

As you can see, the `SimpleExprValue` allows for some complicated expressions, despite its name

#### `CompositionValue`

Format: `[ "compose", <parameter_definition>, <parameter_definition> ]`

##### Examples:
```json
[ "compose", "#cycle", 3]
[ "compose", "#test", "#other"]
[ "compose", [ "+", 3], "#other"]
[ "compose", [ "compose", "#other2", "#other3"], "#other"]
```
##### Explanation

`CompositionValue` takes two parameter definitions as inputs, and does `value1(value2(input))`. In other words, it chains
the two inputs, calling the second one with the given input, and the first one with the output of the second one.

##### Example explanations:
- value of parameter cycle when given input 3
- value of parameter test when given the output of parameter other when called with the current input
- 3 + the output of other with the current input
- other2(other3(other(input))) because value1 = other2(other3(input)) and value2 = other(input)

### Clips

```javascript
{
    "name": <clip_definition>
}
```

As with parameters, different kinds of clips have different formats for `<clip_definition>`, but the simple ones are:

- `IdentityClip`: the string `#identity`
- `ClipReference`: the clip name prefixed with `#`, e.g. `#my_amazing_clip`
- `ModelClip`: a model resource location + `@` + the name of the armature-clip, e.g. `mymod:block/test@default` or `mymod:block/test#facing=east@moving`

#### `TimeClip`

Format: `[ "apply", <clip_definition>, <parameter_definition> ]`

##### Examples:
```json
["apply", "mymod:block/animated_thing@moving", "#cycle_time"]
["apply", [ "apply", "mymod:block/animated_thing@moving", [ "+", 3 ] ], "#cycle"]
```

##### Explanation

The `TimeClip` takes another clip and applies it using a custom parameter instead of the current time. Usually used to apply a `ModelClip` with
a parameter instead of the current time.

##### Example explanations:

- apply the armature-clip for model mymod:block/animated_thing named moving with the output of the parameter cycle_time
- apply the armature-clip for model mymod:block/animated_thing named moving with 3 + the output of the parameter cycle

#### `TriggerClip`

Format: `[ "trigger_positive", <clip_definition>, <parameter_definition>, "event_text"]`

TODO