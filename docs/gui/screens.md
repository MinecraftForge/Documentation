# Screens

Screens are typically the base of all Graphical User Interfaces (GUIs) in Minecraft: taking in user input, verifying it on the server, and syncing the resulting action back to the client. They can be combined with [menus] to create an communication network for inventory-like views, or they can be standalone which modders can handle through their own [network] implementations.

Screens are made up of numerous parts, making it difficult to fully understand what a 'screen' actually is in Minecraft. As such, this document will go over each of the screen's components and how it is applied before discussing the screen itself.

## Relative Coordinates

Whenever anything is rendered, there needs to be some identifier which specifies where it will appear. With numerous abstractions, most of Minecraft's rendering calls takes in an x, y, and z value in a coordinate plane. X values increase from left to right, y from top to bottom, and z from far to near. However, the coordinates are not fixed to a specified range. They can change depending on the size of the screen and the scale at which is specified within the options. As such, extra care must be taken to make sure the values of the coordinates while rendering scale properly to the changeable screen size.

Information on how to relativize your coordinates will be within the [screen] section.

!!! important
    If you choose to use fixed coordinates or incorrectly scale the screen, the rendered objects may look strange or misplaced. An easy way to check if you relativized your coordinates correctly is to click the 'Gui Scale' button in your video settings. This value is used as the divisor to the width and height of your display when determining the scale at which a GUI should render.

## Gui Components

Any GUI rendered by Minecraft is an instance of a `GuiComponent`. `GuiComponent`s contain the most basic methods used to render the most commonly used objects. These fall into three categories: colored rectangles, strings, and textures. There is also an additional method for rendering a snippet of a component (`#enableScissor` / `#disableScissor`). All methods take in a `PoseStack` which applies the transformations necessary to properly render where the component should be rendered. Additionally, colors are in the [ARGB][argb] format.

### Colored Rectangles

Colored rectangles are drawn through a position color shader. There are three types of colored rectangles that can be drawn.

First, there is a colored horizontal and vertical one-pixel wide line, `#hLine` and `#vLine` respectively. `#hLine` takes in two x coordinates defining the left and right (inclusively), the top y coordinate, and the color. `#vLine` takes in the left x coordinate, two y coordinates defining the top and bottom (inclusively), and the color.

Second, there is the `#fill` method, which draws a rectangle to the screen. The line methods internally call this method. This takes in the left x coordinate, the top y coordinate, the right x coordinate, the bottom y coordinate, and the color.


Finally, there is the `#fillGradient` method, which draws a rectangle with a vertical gradient. This takes in the right x coordinate, the bottom y coordinate, the left x coordinate, the top y coordinate, the z coordinate, and the bottom and top colors.

### Strings

Strings are drawn through its `Font`, typically consisting of their own shaders for normal, see through, and offset mode. There are two alignment of strings that can be rendered, each with a back shadow: a left-aligned string (`#drawString`) and a center-aligned string (`#drawCenteredString`). These both take in the font the string will be rendered in, the string to draw, the x coordinate representing the left or center of the string respectively, the top y coordinate, and the color.

!!! note
    Strings should typically be passed in as [`Component`s][component] as they handle a variety of usecases, including the two other overloads of the method.

### Textures

Textures are drawn through blitting, hence the method name `#blit`, which, for this purpose, copies the bits of an image and draws them directly to the screen. These are drawn through a position texture shader. While there are many different `#blit` overloads, we will only discuss two: the instance `#blit` and the static `#blit` the instance method delegates to.

The instance `#blit` takes in six integers and assumes the texture being rendered is on a 256 x 256 PNG file. It takes in the left x and top y screen coordinate, the left x and top y coordinate within the PNG, and the width and height of the image to render.

!!! note
    The size of the PNG file must be specified so that the coordinates can be normalized to obtain the associated UV values.

The static `#blit` expands this to nine integers, only assuming the image is on a PNG file. It takes in the left x and top y screen coordinate, the z coordinate (referred to as the blit offset), the left x and top y coordinate within the PNG, the width and height of the image to render, and the width and height of the PNG file.

#### Blit Offset

The z coordinate when rendering a texture is typically set to the blit offset. The offset is responsible for properly layering renders when viewing a screen. Renders with a smaller z coordinate are rendered in the background and vice versa where renders with a larger z coordinate are rendered in the foreground.

The offset can be obtained by calling `#getBlitOffset` and set using `#setBlitOffset`.

!!! important
    When setting the blit offset, you must reset it after rendering your object. Otherwise, other objects within the screen may be rendered in an incorrect layer causing graphical issues.

## Widget

`Widget`s are essentially objects that are rendered. These include screens, buttons, chat boxes, lists, etc. `Widget`s only have one method: `#render`. This takes in the `PoseStack` holding any prior transformations to properly render the widget, the x and y positions of the mouse scaled to the relative screen size, and the tick delta (how many ticks have passed since the last frame).

## GuiEventListener

Any screen rendered in Minecraft implements `GuiEventListener`. `GuiEventListener`s are responsible for handling user interaction with the screen. These include inputs from the mouse (movement, clicked, released, dragged, scrolled, mouseover) and keyboard (pressed, released, typed). Each method returns whether the associated action affected the screen successfully. Widgets like buttons, chat boxes, lists, etc. also implement this interface.

### ContainerEventHandler

Almost synonymous with `GuiEventListener`s are their subtype: `ContainerEventHandler`s. These are responsible for handling user interaction on screens which contain widgets, managing which is currently focused and how the associated interactions are applied. `ContainerEventHandler`s add three additional features: interactable children, dragging, and focusing.

Event handlers held children which was used to determine the interaction order of elements. During the mouse event handlers (excluding dragging), the first child in the list that the mouse was over would have their logic executed.

Dragging is implemented within `#mouseClicked` and `#mouseReleased` allowing for logic to be more precisely executed when the mouse was dragging the element.

Focusing allowed for a specific child to be selected to execute logic. These included during keyboard events and when the mouse was being dragged. Focus of which element was typically set through `#setFocused` or, when the screen was being opened, `#setInitialFocus`. In addition, interactable children could be cycled through using `#changeFocus`, selecting the next child in the list, or the previous child when shift was held down.

!!! note
    Screens implement `ContainerEventHandler` and `GuiComponent` through `AbstractContainerEventHandler`, which adds in the setter and getter logic for dragging and focusing children.

# TODO BELOW

## A Screen Subclass

title component
widgets
width/height
item renderer

modifier keys and clipboards

render method
  render tooltip
  render background

onClose method
init method
tick method
removed method
onFilesDrop method

resize method

`NarratableEntry`

## `AbstractContainerScreen`

image width/height
  leftPos / topPos calculated from this
titleLabel / inventoryLabel XY
menu hooked into
playerInventory title

renderBg method
containerTick method
renderLabels

[menus]: ./menus.md
[network]: ../networking/index.md
[screen]: #TODO
[argb]: https://en.wikipedia.org/wiki/RGBA_color_model#ARGB32
[component]: ../concepts/internationalization.md#translatablecontents
