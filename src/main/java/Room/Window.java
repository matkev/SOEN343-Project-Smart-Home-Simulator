package Room;

import Data.ObjectIdSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;

import java.util.Objects;

/**
 * Class modeling the Window entity associated with Rooms
 */
public class Window {
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    private boolean windowIsLocked;
    private boolean windowIsOpen;

    /**
     * Constructs a new Window instance
     * 
     * @param id the id of the Window
     * @param windowIsLocked if the Window is locked
     * @param windowIsOpen if the Window is open
     */
    public Window(ObjectId id, boolean windowIsLocked, boolean windowIsOpen) {
        this.id = id;
        this.windowIsLocked = windowIsLocked;
        this.windowIsOpen = windowIsOpen;
    }

    /**
     * Default Window constructor
     */
    public Window() {}

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
     * Returns if the Window is locked
     *
     * @return if the Window is locked
     */
    public boolean getWindowIsLocked() {
        return windowIsLocked;
    }

    /**
     * Sets if the Window is locked
     *
     * @param windowIsLocked if the Window is locked
     */
    public void setWindowIsLocked(boolean windowIsLocked) {
        this.windowIsLocked = windowIsLocked;
    }

    /**
     * Returns if the Window is open
     *
     * @return if the Window is open
     */
    public boolean getWindowIsOpen() {
        return windowIsOpen;
    }

    /**
     * Sets if the Window is open
     *
     * @param windowIsOpen if the Window is open
     */
    public void setWindowIsOpen(boolean windowIsOpen) {
        this.windowIsOpen = windowIsOpen;
    }

    /**
     * Returns a string representation of a Window object
     *
     * @return string representation of a Window object
     */
    @Override
    public String toString() {
        return "Window{" +
                "id=" + id +
                ", windowIsLocked=" + windowIsLocked +
                ", windowIsOpen=" + windowIsOpen +
                '}';
    }

    /**
     * Compares the Window to another object and returns if they are equal
     *
     * @param o the other object
     * @return if the two objects are equal
     */
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
