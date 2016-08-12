Introduction to Blockstate JSONs
================================

Blockstate JSONs tell the game which model it should use depending on the values of the block's [blockstate properties][blockstate].
A simple block with no properties only has a "*normal*" blockstate which is its default.
A more complex block that can be displayed in different ways has so called *variants*.

As an example, let's take a look at the vanilla `oak_log.json`:

```json
{
  "variants": {
    "axis=y":  { "model": "oak_log" },
    "axis=z":   { "model": "oak_log_side" },
    "axis=x":   { "model": "oak_log_side", "y": 90 },
    "axis=none":   { "model": "oak_bark" }
  }
}
```

As you can see there is no normal state, only different variants depending on the value of "axis". Depending on which axis the log is aligned it will use either a model of the upright log, a model of the sideways log (rotated by 90° or not) or, should the block not have any axis set, it'll display the bark model which has the bark on all 6 sides.

The log only has one property: axis. A blockstate always has to be defined for all of its properties. In 1.8, you had to specify the entire variant string, for each and every variant string. This would lead to a very large number of variants, as each and every combination of properties must be defined. The [Forge blockstate format][Forge blockstate] allows you to keep this under control. 1.9 also introduces the "multipart" blockstate format, which has certain advantages and disadvantages compared to Forge's. You can find a description of 1.9's format on the [wiki].

[blockstate]: ../../blocks/states.md
[Forge blockstate]: forgeBlockstates.md
[wiki]: http://minecraft.gamepedia.com/Model#Block_states
