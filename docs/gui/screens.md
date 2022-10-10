# Screens

Screens are typically the base of all Graphical User Interfaces in Minecraft: taking in user input, verifying it on the server, and syncing the resulting action back to the client. They can be combined with [menus] to create an communication network for inventory-like views, or they can be standalone which modders can handle through their own [network] implementations.

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

everything is a `GuiComponent`
input logic through `GuiEventListener`

### `ContainerEventHandler`

focusing on a specific element
dragging element on screen

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