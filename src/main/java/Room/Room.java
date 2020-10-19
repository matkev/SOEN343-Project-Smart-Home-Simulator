package Room;

import Data.ObjectIdSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

/**
 * Class modeling the Room entity. Room objects are mapped into the 'rooms' collection in the MongoDB database.
 */
public class Room {
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;

    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId house_id;
    private String name;
    private int windows;
    private int lights;
    private List<String> doorsTo;

    /**
     * Default Room constructor
     */
    public Room() {
    }

    /**
     * Construct a new Room instance
     *
     * @param id the id
     * @param house_id the id of the associated House
     * @param name the name
     * @param windows the number of windows
     * @param lights the number of lights
     * @param doorsTo the list of the names of other Rooms linked to this one
     */
    public Room(ObjectId id, ObjectId house_id, String name, int windows, int lights, List<String> doorsTo) {
        this.id = id;
        this.house_id = house_id;
        this.name = name;
        this.windows = windows;
        this.lights = lights;
        this.doorsTo = doorsTo;
    }

    /**
     * Returns the id
     *
     * @return the id
     */
    public ObjectId getId() {
        return id;
    }

    /**
     * Sets the id
     *
     * @param id the id
     */
    public void setId(ObjectId id) {
        this.id = id;
    }

    /**
     * Returns the id of the associated House
     *
     * @return the id of the associated House
     */
    public ObjectId getHouse_id() {
        return house_id;
    }

    /**
     * Sets the associated House id
     *
     * @param house_id the associated House id
     */
    public void setHouse_id(ObjectId house_id) {
        this.house_id = house_id;
    }

    /**
     * Returns the name
     *
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the name
     *
     * @param name the name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Returns the number of windows
     *
     * @return the number of windows
     */
    public int getWindows() {
        return windows;
    }

    /**
     * Sets the number of windows
     *
     * @param windows the number of windows
     */
    public void setWindows(int windows) {
        this.windows = windows;
    }

    /**
     * Returns the number of lights
     *
     * @return the number of lights
     */
    public int getLights() {
        return lights;
    }

    /**
     * Sets the number of lights
     *
     * @param lights the number of lights
     */
    public void setLights(int lights) {
        this.lights = lights;
    }

    /**
     * Returns the list of the names of other Rooms linked to this one
     *
     * @return the list of the names of other Rooms linked to this one
     */
    public List<String> getDoorsTo() {
        return doorsTo;
    }

    /**
     * Sets the list of the names of other Rooms linked to this one
     *
     * @param doorsTo the list of the names of other Rooms linked to this one
     */
    public void setDoorsTo(List<String> doorsTo) {
        this.doorsTo = doorsTo;
    }

    /**
     * Returns a string representation of a Room object
     *
     * @return a string representation of a Room object
     */
    @Override
    public String toString() {
        return "Room{" +
                "id=" + id +
                ", house_id=" + house_id +
                ", name='" + name + '\'' +
                ", windows=" + windows +
                ", lights=" + lights +
                ", doorsTo=" + Arrays.toString(doorsTo.toArray()) +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Room room = (Room) o;
        return windows == room.windows &&
                lights == room.lights &&
                Objects.equals(id, room.id) &&
                Objects.equals(house_id, room.house_id) &&
                Objects.equals(name, room.name) &&
                Objects.equals(doorsTo, room.doorsTo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, house_id, name, windows, lights, doorsTo);
    }
}
