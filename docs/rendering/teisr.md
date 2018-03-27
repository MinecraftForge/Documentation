TileEntityItemStackRenderer
=======================

With the release of Forge 14.23.2.2638, a proper way to render items with GL was implemented. Using this system is much simpler than the old system, which required a TileEntity, and does not allow access to the ItemStack.

Using TileEntityItemStackRenderer
--------------------------

TileEntityItemStackRenderer allows you to render your item using `public void renderByItem(ItemStack itemStackIn)`.  
There is an overload that takes partialTicks as a parameter, but it is never called in vanilla.

In order to use a TEISR, the Item must first satisfy the condition that its model returns true for `IBakedModel#isBuiltInRenderer`.
Once that returns true, the Item's TEISR will be accessed for rendering.  If it does not have one, it will use the default `TileEntityItemStackRenderer.instance`. For an example IBakedModel to use, see below.

To set the TEISR for an Item, use `Item#setTileEntityItemStackRenderer`.  Each Item can only ever provide one TEISR, and the getter is final so that mods do not return new instances each frame.

That's it, no additional setup is necessary to use a TEISR.

Example IBakedModel (ItemLayerWrapper.java)
---------------

```java
import java.util.List;

import javax.vecmath.Matrix4f;

import org.apache.commons.lang3.tuple.Pair;

import net.minecraft.block.state.IBlockState;
import net.minecraft.client.renderer.block.model.BakedQuad;
import net.minecraft.client.renderer.block.model.IBakedModel;
import net.minecraft.client.renderer.block.model.ItemCameraTransforms.TransformType;
import net.minecraft.client.renderer.block.model.ItemOverrideList;
import net.minecraft.client.renderer.texture.TextureAtlasSprite;
import net.minecraft.util.EnumFacing;

public class ItemLayerWrapper implements IBakedModel {

  private final IBakedModel internal;

  public ItemLayerWrapper(IBakedModel internal) {
    this.internal = internal;
  }

  @Override
  public List<BakedQuad> getQuads(IBlockState state, EnumFacing side, long rand) {
    return internal.getQuads(state, side, rand);
  }

  @Override
  public boolean isAmbientOcclusion() {
    return internal.isAmbientOcclusion();
  }

  @Override
  public boolean isGui3d() {
    return internal.isGui3d();
  }

  public IBakedModel getInternal() {
    return internal;
  }

  @Override
  public boolean isBuiltInRenderer() {
    return true;
  }

  @Override
  public TextureAtlasSprite getParticleTexture() {
    return internal.getParticleTexture();
  }

  @Override
  public ItemOverrideList getOverrides() {
    return internal.getOverrides();
  }

  @Override
  public Pair<? extends IBakedModel, Matrix4f> handlePerspective(TransformType cameraTransformType) {
    //You can use a field on your TileEntityItemStackRenderer to store this TransformType for use in renderByItem, this method is always called before it.
    return Pair.of(this, internal.handlePerspective(cameraTransformType).getRight());
  }

}
```