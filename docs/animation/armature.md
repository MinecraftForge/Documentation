Armature Files
==============

Armature Files define joints and clips for animating a model.

File Structure
----------------

An example armature file, taken from the forge debug mod (requires #3875)
```json
{
  "joints": {
    "stick": {"2": [1.0]},
    "cube": {"3": [1.0]}
  },
  "clips": {
    "default": {
      "loop": true,
      "joint_clips": {
        "stick": [
          {
            "variable": "offset_x",
            "type": "uniform",
            "interpolation": "linear",
            "samples": [0, 0.6875, 0]
          }
        ],
        "cube": [
          {
            "variable": "offset_x",
            "type": "uniform",
            "interpolation": "linear",
            "samples": [0, 0.6875, 0]
          },
          {
            "variable": "axis_z",
            "type": "uniform",
            "interpolation": "nearest",
            "samples": [ 1 ]
          },
          {
            "variable": "origin_x",
            "type": "uniform",
            "interpolation": "nearest",
            "samples": [ 0.15625 ]
          },
          {
            "variable": "origin_y",
            "type": "uniform",
            "interpolation": "nearest",
            "samples": [ 0.40625 ]
          },
          {
            "variable": "angle",
            "type": "uniform",
            "interpolation": "linear",
            "samples": [0, 120, 240, 0, 120, 240]
          }
        ]
      },
      "events": {}
    }
  }
}

```

The file is organized in two sections, joints and clips.

Joints
--------
Each joint defines a connection to the model file. A joint can animate any number of elements in the model file, but they are all animated with the same input value and transforms

The format is like this:
```javascript
 {
    "joints": {
        <joint>, ...
    }
}
    
---

<joint> ::= {
    <string>: {  // joint name
        <joint_definition>, ...
    }
}

<joint_definition> ::= {
    <string>: [ <float> ] // index_model, joint_weight
}

```

- `joint_name` is the name of the joint
- `index_model` is a 0-indexed number denoting a model element this joint controls. Must be a string (see example)
- `joint_weight` is a weight (0-1) of how much this element will animate. The transformation matrix caused by a clip animating this element will be multiplied by this number.

!!! note
    
    In most cases, `joint_weight` should be set to 1.0, unless you really have a reason otherwise

Not all elements need to have a joint, only the ones you are animating.


Clips
-------

Clips are essentially instructions on how to use a value to animate some collection of joints.
They also include events to fire at certain points.

They are formatted like this:
```javascript

{
    "clips": {
        "clip_name": {
            "loop": <true/false>,
            "joint_clips": {
                <joint_clip_list>, ...
            },
            "events": {
                <event> ...
            }
            
        }
    }
}

-------

<joint_clip_list> ::= {
    "joint_name": [
        <joint_clip>, ...
    ]
}

<joint_clip> ::= {
    "variable": <variable>,
    "type": "uniform",
    "interpolation": <interpolation>,
    "samples": [ float, ... ]
}


```

- loop: whether or not the parameter value can continue increasing and the animation loops, or if it stops at the ending state

### Joint Clips
Each `joint_clip` is a set of variables to change for a joint. The `type` attribute is currently ignored, but must be `"uniform"`.

`samples` defines what value the animation will take on, and its interpretation depends on the value of `interpolation`.

`interpolation` can be one of the following:
  - nearest - if value < 0.5 use the first sample, else the second sample. Useful for static variables if only given one value
  - linear - linearly interpolate between samples

`variable` can be one of the following:

- offset_x, offset_y, offset_z - translation
- scale - uniform scaling
- scale_x, scale_y, scale_x - scaling on certain axes
- axis_x, axis_y, axis_z - rotation axes
- angle - rotation angle

and if PR #3875 is merged, there will be:

- origin_x, origin_y, origin_z - rotation origin

### Events

Each clip can fire events, formatted like this:
```javascript
<event> :: {
    <event_time>: "event_text"
}
```
For more information about events and what `event_text` means, see the page on ASMs.

`event_time` is a value denoting when to fire the event. When the parameter controlling this clip reaches a point equal to or greater than the `event_time`, the event is fired
