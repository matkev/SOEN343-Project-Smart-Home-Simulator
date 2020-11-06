package Room;

import Data.ObjectIdSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;

import java.util.Objects;

public class Window {
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    private boolean windowIsLocked;
    private boolean windowIsOpen;

    public Window(ObjectId id, boolean windowIsLocked, boolean windowIsOpen) {
        this.id = id;
        this.windowIsLocked = windowIsLocked;
        this.windowIsOpen = windowIsOpen;
    }

    public Window() {}

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public boolean getWindowIsLocked() {
        return windowIsLocked;
    }

    public void setWindowIsLocked(boolean windowIsLocked) {
        this.windowIsLocked = windowIsLocked;
    }

    public boolean getWindowIsOpen() {
        return windowIsOpen;
    }

    public void setWindowIsOpen(boolean windowIsOpen) {
        this.windowIsOpen = windowIsOpen;
    }

    @Override
    public String toString() {
        return "Window{" +
                "id=" + id +
                ", windowIsLocked=" + windowIsLocked +
                ", windowIsOpen=" + windowIsOpen +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Window window = (Window) o;
        return windowIsLocked == window.windowIsLocked &&
                windowIsOpen == window.windowIsOpen &&
                Objects.equals(id, window.id);
    }
}
