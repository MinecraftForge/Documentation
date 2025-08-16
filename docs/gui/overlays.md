# Overlays
Sometimes, we may want to display information to the user without interrupting their movement or , much in the way that F3 or the scoreboard do. This type of GUI element is called an overlay.  Overlays render underneath any visible [screen] and so will be visibly hidden (though the may still be rendering!) when one is opened.

Rendering using `Gui Graphics` is covered in [screens], and so won't be repeated in this article.

# Context

Previously, Forge included two events. `RenderGuiOverlayEvent` and `RegisterGuiOverlayEvent`. The former would fire each time an overlay was rendered, allowing modders to add their own rendering or cancel as needed. The latter fired once at some time during initialization and allowed modders to, as the name suggests, register their own overlays for their own purposes.

Since 1.20.6, Mojang modified the way overlays are created and rendered, making this system obsolete, moving to the use of the `LayeredDraw` class and `Layer` interface. `LayeredDraw` uses an internal, anonymous list of render functions that adhere to the `Layer` interface. Because they are anonymous, there was no way to be sure which `Layer` in the list corresponded with a particular render method in `Gui`.

The behavior of `RegisterGuiOverlayEvent` has been restored, allowing modders to insert their own render layers into this list in a one time event.

!!! important As of 1.21.6, this system has changed again, removing `Layer` and `LayeredDraw`. As such, `Layer` must be replaced with `ForgeLayer` on versions 1.21.6 and up. However, the rest of this documentation is still applicable.
# Forge Layered Draw
A `LayeredDraw` represents a list of renderable `Layers`. During runtime,`LayeredDraw#render` will be called to execute the render code of the internal `Layer` list. Additionally, `LayeredDraws` may be added into the render list of another `LayeredDraw`, forming a tree of renderable nodes.

Forge extends this implementation with `ForgeLayeredDraw`, giving `ResourceLocations` to both vanilla `LayerdDraws` and `Layers` to allow ordering. To begin adding modded `Layers` and `ForgeLayeredDraws`, listen to `AddGuiOverlayLayersEvent`, which fires on the mod bus.


### Vanilla Draw Order
By default, vanilla contains three `LayeredDraw` instances. The instance provided by the event is `ForgeLayeredDraw#VANILLA_ROOT`. This ForgeLayeredDraw instance will be referred to as the global parent hereon. Its contents is as follows:

Internal Name |      Resource Location       | Type
:--- |:----------------------------:| :---
PRE_SLEEP_STACK | "minecraft:pre_sleep_phase"  | ForgeLayeredDraw
SLEEP_OVERLAY |  "minecraft:sleep_overlay"   | Layer
POST_SLEEP_STACK | "minecraft:post_sleep_phase" | ForgeLayeredDraw

The contents of `ForgeLayeredDraw#PRE_SLEEP_STACK` is made entirely of `Layer` instances and is as follows:

Internal Name |      Resource Location       | Note
:--- |:--- | :---
CAMERA_OVERLAY | "minecraft:camera_overlay"
CROSSHAIR | "minecraft:crosshair"
CHANGE_STRATUM | "stratum_change" | 1.21.6+ Only
HOTBAR | "minecraft:hotbar"
EXPERIENCE | "minecraft:experience"
POTION_EFFECTS | "minecraft:potion_effects"
BOSS_OVERLAY | "minecraft:boss_overlay"

After the sleep overlay is rendered, the contents of `ForgeLayeredDraw#POST_SLEEP_STACK` is rendered, also entirely `Layer` instances:

Internal Name | Resource Location
:--- | :---
DEMO_OVERLAY | "minecraft:demo"
DEBUG_OVERLAY | "minecraft:debug"
SCOREBOARD | "minecraft:scoreboard"
HOTBAR_MESSAGE | "minecraft:hotbar_message"
TITLE_OVERLAY | "minecraft:title"
CHAT_OVERLAY | "minecraft:chat_overlay"
TAB_LIST | "minecraft:tab_list"
SUBTITLE_OVERLAY | "minecraft:subtitle"

!!! important All information above is present in the javadocs for `ForgeLayeredDraw`. If you aren't sure what's included in a layer, check its render code in `Gui`. For 1.21.6+, the vanilla order initialization is also present at `ForgeLayeredDraw#init`.

### A Note About Layer Order

The finalized render order is only computed **after** all event listeners have finished. Attempting to add new layers after the event has passed will not have any effect.  Additionally, because it is possible (but heavily discouraged) to re-order existing layers with `ForgeLayeredDraw#move`, there is no absolute guarantee on where a layer is at any point.

Additionally, layers cannot be moved across `ForgeLayeredDraw` boundaries. Once a layer has a parent, it stays within that parent. If you wish to do such a thing, cancel the original layer, then add a new layer in the desired parent

Finally, if a target (which is to say, the thing being ordered against) is *not* present, an appropriate warning will be emitted and no changes will be made. This is the case for all method calls in `ForgeLayeredDraw`. No call to any method will ever leave the layer order in an invalid state.
### Adding To ForgeLayeredDraws

Several overloads exist for the `ForgeLayeredDraw#add` method. Two are for registering vanilla's layers and should not be used under any circumstances, they are marked as `@Deprecated` for this reason.

Adding `Layers` can look like this:
```java
class MyClass {
    public static void addMyLayers(AddGuiOverlayLayersEvent event) {
        // We aren't specifying any targets,
        // so this will go at the end of VANILLA_ROOT's list.
        event.getLayeredDraw().add(
                ResourceLocation.fromNamespaceAndPath(MY_MODID, "eye_blinder_supreme"),
                (guiGraphics, deltaTracker) -> {
                    // whatever rendering code we want
                }
        );
        event.getLayeredDraw().add(
                ResourceLocation.fromNamespaceAndPath(MY_MODID, "dancing_cat"),
                MyClass::renderMethod
        );
    }

    private static void renderMethod(GuiGraphics guiGraphics, DeltaTracker deltaTracker) {
        // some other render code
    }
}
```
Layer names are not globally unique, they may be re-used between different `ForgeLayeredDraw` instances, but may not be used within the same instance.

```java
// assume above code block has also ran
public static void addMyLayers(AddGuiOverlayLayersEvent event) {
    ResourceLocation rl = ResourceLocation.fromNamespaceAndPath(MY_MODID, "my_cool_layer_list");
    ForgeLayeredDraw myStack = new ForgeLayeredDraw(rl);
    myStack.add( 
            ResourceLocation.fromNamespaceAndPath(MY_MODID, "eye_blinder_supreme"),
            (guiGraphics, deltaTracker) -> {/* ... */}
    );
    // Because this layer lives in a different draw stack,
    // it's okay for the ResourceLocation to get re-used
    event.getLayeredDraw().add(myStack.getName(), myStack, () -> true);
    // The stack condition supplier is mandatory, so to tell it to always* render let it supply true
    // *unless another mod adds another condition. They can be stacked!
}
```

### Cancelling Layers

Previously, a modder would need to use the `RenderGuiOverlayEvent` to cancel an overlay's rendering. Now, modders can simply add a condition to existing `Layers` or entire `ForgeLayeredDraws`

To cancel an existing layer, use `ForgeLayeredDraw#addConditionTo`. Two method overloads are provided if, one for if the target layer exists in the caller (which is to say, the specific instance `addConditionTo` is called on) and one intended to be called on the  global parent. The provided `BooleanSupplier` represents if rendering should occur.

If a condition applied to a target that corresponds to a `ForgeLayeredDraw` object, the condition will apply to all child layers within the object. This is helpful for allowing many layers to be disabled with a single boolean check (this is how vanilla handles pressing F1!). In other words, if the parent is cancelled, all child layers are also automatically cancelled. None of the child `Layer#render` methods will be called in this case.

### Modifying Existing Layers

Directly modifying the rendered elements of already existing layers is *not supported* with `ForgeLayeredDraw`. If you wish to do so in a way that is API friendly, cancel the original layer wholesale and do the rendering yourself. 

[screens]: ./screens.md
[screen]: ./screens.md
