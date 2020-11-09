package Door;

import Data.ObjectIdSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;

import java.util.Objects;

/**
 * Class modeling the Door entity. Door objects are mapped into the 'doors' collection in the MongoDB database.
 */
public class Door {
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    private String fromRoom;
    private String toRoom;
    private boolean doorIsLocked;

    /**
     * Construct a new Door instance
     *
     * @param id the ObjectId
     * @param fromRoom the name of the one of the rooms the door is connecting
     * @param toRoom the name of the other one of the rooms the door is connecting
     * @param doorIsLocked is the door locked
     */
    public Door(ObjectId id, String fromRoom, String toRoom, boolean doorIsLocked) {
        this.id = id;
        this.fromRoom = fromRoom;
        this.toRoom = toRoom;
        this.doorIsLocked = doorIsLocked;
    }

    /**
     * Default Door constructor
     */
    public Door() {}

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
     * Gets the name of the one of the rooms the door is connecting
     *
     * @return the name of the one of the rooms the door is connecting
     */
    public String getFromRoom() {
        return fromRoom;
    }

    /**
     * Sets the name of the one of the rooms the door is connecting
     *
     * @param fromRoom the name of the one of the rooms the door is connecting
     */
    public void setFromRoom(String fromRoom) {
        this.fromRoom = fromRoom;
    }

    /**
     * Gets the name of the other one of the rooms the door is connecting
     *
     * @return the name of the other one of the rooms the door is connecting
     */
    public String getToRoom() {
        return toRoom;
    }

    /**
     * the name of the other one of the rooms the door is connecting
     *
     * @param toRoom the name of the other one of the rooms the door is connecting
     */
    public void setToRoom(String toRoom) {
        this.toRoom = toRoom;
    }

    /**
     * Gets if the door is locked
     *
     * @return if the door is locked
     */
    public boolean getDoorIsLocked() {
        return doorIsLocked;
    }

    /**
     * Sets if the door is locked
     *
     * @param doorIsLocked if the door is locked
     */
    public void setDoorIsLocked(boolean doorIsLocked) {
        this.doorIsLocked = doorIsLocked;
    }

    /**
     * Returns a string representation of a Door object
     *
     * @return string representation of Door object
     */
    @Override
    public String toString() {
        return "Door{" +
                "id=" + id +
                ", fromRoom='" + fromRoom + '\'' +
                ", toRoom='" + toRoom + '\'' +
                ", doorIsLocked=" + doorIsLocked +
                '}';
    }

    /**
     * Compares the Door to another object and returns if they are equal
     *
     * @param o the other object
     * @return if the two objects are equal
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Door door = (Door) o;
        return doorIsLocked == door.doorIsLocked &&
                Objects.equals(id, door.id) &&
                Objects.equals(fromRoom, door.fromRoom) &&
                Objects.equals(toRoom, door.toRoom);
    }
}
