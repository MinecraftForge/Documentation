Tile Entities
=============

Tile entites are rendered on the basis of their class type.
Essentially all you have to do is register a class that extends/implements `TileEntitySpecialRenderer` and the game will use your own speciall renderer when it needs to render your `TileEntity`
So, in your client side proxy:

```java
import net.minecraftforge.fml.client.registry.ClientRegistry;
public class ClientProxy extends CommonProxy {
    @Override
    public void init () {
        ClientRegistry.bindTileEntitySpecialRenderer(MyTileEntity.class, new MyTileEntitySpecialRenderer());
    }
}
```

The actual implementation of TESRs is relatively well documented elsewhere, so that work won't be duplicated here.
If you're interested in writting your own TESR there are some excelent tutorials on the Forge wiki, like [this one](http://www.minecraftforge.net/wiki/Custom_Tile_Entity_Renderer).

Under The Hood
--------------

It turns out that `TileEntitySpecialRenderer`s aren't super interesting under the hood either.
When walking the list of blocks in a chunk to render, when it sees a tile entity it determines if that tile entity has a special renderer, and if it does adds it to the list of tile entities to render when that chunk needs to be drawn.
If there is no TESR registered, the block is drawn as usual with the [`ModelBlock`](modelblock.md) infrastructure.
