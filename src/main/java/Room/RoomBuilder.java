package Room;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;

public class RoomBuilder {
    
    private ObjectId id;

    private ObjectId house_id;
    private String name;
    private int windows;
    private int lights;
    private List<String> doorsTo;
    
    /**
     * Builder for <code>Room</code>. May only build one room at a time, enforced by having the id of the room be given on instantiation of the builder.
     * @param id the id of the room
     */
    public RoomBuilder(ObjectId id){
        this.id = id;
        this.house_id = null;
        this.name = "Room";
        this.windows = 0;
        this.lights = 0;
        this.doorsTo = new ArrayList<String>();
    }

    /**
     * Sets the associated House id of the room
     *
     * @param house_id the associated House id
     * @return RoomBuilder
     */
    public RoomBuilder setHouseId(ObjectId house_id){
        this.house_id = house_id;
        return this;
    }
    /**
     * Sets the name of the room
     *
     * @param name the name
     * @return RoomBuilder
     */
    public RoomBuilder setName(String name){
        this.name = name;
        return this;
    }
    
    /**
     * Adds to the number of windows of the room
     *
     * @param windows the number of windows
     * @return RoomBuilder
     */
    public RoomBuilder addWindows(int windows){
        this.windows += windows;
        return this;
    }
    /**
     * Adds to the number of lights of the room
     *
     * @param lights the number of lights
     * @return RoomBuilder
     */
    public RoomBuilder addLights(int lights){
        this.lights += lights;
        return this;
    }
    
    /**
     * Adds the list of the names of other Rooms linked to the room built
     *
     * @param doorsTo the list of the names of other Rooms linked to room built
     * @return RoomBuilder
     */
    public RoomBuilder addDoorsTo(List<String> doorsTo){
        this.doorsTo.addAll(doorsTo);
        return this;
    }

    /**
     * builds the room
     * @return Room built by RoomBuilder
     */
    public Room build(){
        return new Room(id, house_id, name, windows, lights, doorsTo);
    }

}
