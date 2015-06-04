Simple Tile Entity Server to Client Networking
=============================

If you want to keep the client side tile entity synced with the server, you do not need the full networking system

You can split the nbt saving/loading for the syncable items into their own functions

    @Override
    public void writeToNBT(NBTTagCompound tag)
    {
        super.writeToNBT(tag);
        writeCustomNBT(tag);
    }
    
    public void writeCustomNBT(tag)
    {
        tag.setString("active","yes");
    }
    
    @Override
    public void readFromNBT(NBTTagCompound tag)
    {
        super.writeToNBT(tag);
        writeCustomNBT(tag);
    }
    
    public void readCustomNBT(tag)
    {
        active=tag.setString("active");
    }
    
Then override the getDescriptionPacket and onDataPacket

    @Override
    public Packet getDescriptionPacket()
    {
        NBTTagCompound nbttagcompound = new NBTTagCompound();
        writeCustomNBT(nbttagcompound);
        return new S35PacketUpdateTileEntity(this.pos,1,nbttagcompound)
    }
    
    @Override
    public void onDataPacket(NetworkManager net,S35PacketUpdateTileEntity pkt)
    {
        super.onDataPacket(net,pkt);
        readCustomNBT(pkt.getNbtCompound);
    }
  
  
Finally you need to override markDirty

    @Override
    public void markDirty()
    {
        super.markDirty();
        worldObj.markBlockForUpdate(pos);
    }
    
