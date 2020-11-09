package Room;

import Data.ObjectIdListSerializer;
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
    private List<Light> lights;
    private List<Window> windows;
    @JsonSerialize(using = ObjectIdListSerializer.class)
    private List<ObjectId> doors;

    /**
     * Default Room constructor
     */
    public Room() {
    }

    /**
     * Construct a new Room instance
     *
     * @param id       the id
     * @param house_id the id of the associated House
     * @param name     the name
     * @param windows  a list of the Windows in the Room
     * @param lights   a list of the Lights in the Room
     * @param doors    the list of the names of other Rooms linked to this one
     */
    public Room(ObjectId id, ObjectId house_id, String name, List<Window> windows, List<Light> lights, List<ObjectId> doors) {
        this.id = id;
        this.house_id = house_id;
        this.name = name;
        this.windows = windows;
        this.lights = lights;
        this.doors = doors;
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
     * Returns a list of the Windows in the Room
     *
     * @return a list of the Windows in the Room
     */
    public List<Window> getWindows() {
        return windows;
    }

    /**
     * Sets a list of the Windows in the Room
     *
     * @param windows a list of the Windows in the Room
     */
    public void setWindows(List<Window> windows) {
        this.windows = windows;
    }

    /**
     * Returns a list of the Lights in the Room
     *
     * @return the number of lights
     */
    public List<Light> getLights() {
        return lights;
    }

    /**
     * Sets a list of the Lights in the Room
     *
     * @param lights a list of the Lights in the Room
     */
    public void setLights(List<Light> lights) {
        this.lights = lights;
    }

    /**
     * Returns the list of the names of other Rooms linked to this one
     *
     * @return the list of the names of other Rooms linked to this one
     */
    public List<ObjectId> getDoors() {
        return doors;
    }

    /**
     * Sets the list of the names of other Rooms linked to this one
     *
     * @param doors the list of the names of other Rooms linked to this one
     */
    public void setDoors(List<ObjectId> doors) {
        this.doors = doors;
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
                ", doors=" + Arrays.toString(doors.toArray()) +
                '}';
    }

    /**
     * Compares the Room to another object and returns if they are equal
     *
     * @param o the other object
     * @return if the two objects are equal
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Room room = (Room) o;
        return Objects.equals(id, room.id) &&
                Objects.equals(house_id, room.house_id) &&
                Objects.equals(name, room.name) &&
                Objects.equals(lights, room.lights) &&
                Objects.equals(windows, room.windows) &&
                Objects.equals(doors, room.doors);
    }
}
