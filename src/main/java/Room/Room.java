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

    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId zone_id;
    private String name;
    private List<Light> lights;
    private List<Window> windows;
    @JsonSerialize(using = ObjectIdListSerializer.class)
    private List<ObjectId> doors;
    private Double overridden_temperature; //null to be not overridden

    /**
     * Default Room constructor
     */
    public Room() {
    }

    /**
     * Construct a new Room instance
     *
     * @param id                     the id
     * @param house_id               the id of the associated House
     * @param zone_id                the id of the associated Zone
     * @param name                   the name
     * @param windows                a list of the Windows in the Room
     * @param lights                 a list of the Lights in the Room
     * @param doors                  the list of the names of other Rooms linked to this one
     * @param overridden_temperature the overridden temperature value
     */
    public Room(ObjectId id, ObjectId house_id, ObjectId zone_id, String name, List<Window> windows, List<Light> lights, List<ObjectId> doors, Double overridden_temperature) {
        this.id = id;
        this.house_id = house_id;
        this.zone_id = zone_id;
        this.name = name;
        this.windows = windows;
        this.lights = lights;
        this.doors = doors;
        this.overridden_temperature = overridden_temperature;
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
     * Returns the id of the associated Zone
     *
     * @return the id of the associated Zone
     */
    public ObjectId getZone_id() {
        return zone_id;
    }

    /**
     * Sets the associated Zone id
     *
     * @param zone_id the associated Zone id
     */
    public void setZone_id(ObjectId zone_id) {
        this.zone_id = zone_id;
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
     * Returns the overridden temperature value. Is null if no value overridden.
     *
     * @return the overridden temperature value.
     */
    public Double getOverridden_temperature() {
        return overridden_temperature;
    }

    /**
     * Sets the overridden temperature value. Null if no value overridden.
     *
     * @param overridden_temperature the overridden temperature value.
     */
    public void setOverridden_temperature(Double overridden_temperature) {
        this.overridden_temperature = overridden_temperature;
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
                ", zone_id=" + zone_id +
                ", name='" + name + '\'' +
                ", windows=" + windows +
                ", lights=" + lights +
                ", doors=" + Arrays.toString(doors.toArray()) +
                ", overridden_temperature=" + overridden_temperature +
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
                Objects.equals(zone_id, room.zone_id) &&
                Objects.equals(name, room.name) &&
                Objects.equals(lights, room.lights) &&
                Objects.equals(windows, room.windows) &&
                Objects.equals(doors, room.doors) &&
                Objects.equals(overridden_temperature, room.overridden_temperature);
    }
}
