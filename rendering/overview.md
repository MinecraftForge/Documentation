Overview
========

The entry point for the rendering system is at `EntityRenderer.updateCameraAndRender()`.
Despite its name, `EntityRenderer` is responsible for rendering the entire world, including tile entities and entities.
`EntityRenderer` is responsible for setting up the camera and then dispatching work out to a few subsystems which are covered in detail in other places:

  - [Culling](culling.md) works to minimize the amount of pointless work the later systems perform.
  - [Particles](particle.md) are rendered by the `EffectRenderer`.
  - [Static Blocks](modelblock.md) uses `ModelBlocks` to render and cache static blocks.
  - [Tile Entities](tileentity.md) are rendering using `TileEntitySpecialRenderers` (some people refer to these as TESRs).
  - [Entities](entity.md) are rendered using a `Render`, most of which just dispatch work to a `Model`.
