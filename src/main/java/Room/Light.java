package Room;

import Data.ObjectIdSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;

import java.util.Objects;

/**
 * Class modeling the Light entity associated with Rooms
 */
public class Light {
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    private String name;
    private boolean lightIsOn;

    /**
     * Construct a new Light instance
     * 
     * @param id the id of the Light
     * @param name the name of the Light
     * @param lightIsOn if the light is turned on
     */
    public Light(ObjectId id, String name, boolean lightIsOn) {
        this.id = id;
        this.name = name;
        this.lightIsOn = lightIsOn;
    }

    /**
     * Default Light constructor
     */
    public Light() {

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
     * Returns if the light is turned on
     *
     * @return if the light is turned on
     */
    public boolean getLightIsOn() {
        return lightIsOn;
    }

    /**
     * Sets if the light is turned on
     *
     * @param lightIsOn if the light is turned on
     */
    public void setLightIsOn(boolean lightIsOn) {
        this.lightIsOn = lightIsOn;
    }

    /**
     * Returns a string representation of a Light object
     *
     * @return string representation of a Light object
     */
    @Override
    public String toString() {
        return "Light{" +
                "id=" + id +
                ", name=" + name +
                ", lightIsOn=" + lightIsOn +
                '}';
    }

    /**
     * Compares the Light to another object and returns if they are equal
     *
     * @param o the other object
     * @return if the two objects are equal
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Light light = (Light) o;
        return lightIsOn == light.lightIsOn &&
                Objects.equals(id, light.id) &&
                Objects.equals(name, light.name);
    }
}
