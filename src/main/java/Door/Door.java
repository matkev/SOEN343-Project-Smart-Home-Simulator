package Door;

import Data.ObjectIdSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;

import java.util.Objects;

/**
 * Class modeling the House entity. House objects are mapped into the 'houses' collection in the MongoDB database.
 */
public class Door {
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    private String fromRoom;
    private String toRoom;
    private boolean doorIsLocked;

    public Door(ObjectId id, String fromRoom, String toRoom, boolean doorIsLocked) {
        this.id = id;
        this.fromRoom = fromRoom;
        this.toRoom = toRoom;
        this.doorIsLocked = doorIsLocked;
    }

    public Door() {

    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getFromRoom() {
        return fromRoom;
    }

    public void setFromRoom(String fromRoom) {
        this.fromRoom = fromRoom;
    }

    public String getToRoom() {
        return toRoom;
    }

    public void setToRoom(String toRoom) {
        this.toRoom = toRoom;
    }

    public boolean getDoorIsLocked() {
        return doorIsLocked;
    }

    public void setDoorIsLocked(boolean doorIsLocked) {
        this.doorIsLocked = doorIsLocked;
    }

    @Override
    public String toString() {
        return "Door{" +
                "id=" + id +
                ", fromRoom='" + fromRoom + '\'' +
                ", toRoom='" + toRoom + '\'' +
                ", doorIsLocked=" + doorIsLocked +
                '}';
    }

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
