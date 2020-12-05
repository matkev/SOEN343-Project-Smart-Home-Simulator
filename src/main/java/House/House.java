package House;

import Data.ObjectIdSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;

import java.util.Objects;

/**
 * Class modeling the House entity. House objects are mapped into the 'houses' collection in the MongoDB database.
 */
public class House {
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    private String name;

    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId user_id;

    private boolean autoMode;
    private boolean awayMode;
    private double summerTemperature;
    private double winterTemperature;

    /**
     * Default House constructor
     */
    public House() {

    }

    /**
     * Construct a new House instance
     *
     * @param id the ObjectId
     * @param name the name of the house
     * @param user_id the id of the user who created the House
     * @param autoMode if the house is in auto-mode
     * @param awayMode if the house is in away-mode
     * @param summerTemperature the summer temperature
     * @param winterTemperature the winter temperature
     */
    public House(ObjectId id, String name, ObjectId user_id, boolean autoMode, boolean awayMode, double summerTemperature, double winterTemperature) {
        this.id = id;
        this.name = name;
        this.user_id = user_id;
        this.autoMode = autoMode;
        this.awayMode = awayMode;
        this.summerTemperature = summerTemperature;
        this.winterTemperature = winterTemperature;
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
     * Returns the id of the user who created the House
     *
     * @return the id of the user who created the House
     */
    public ObjectId getUser_id() {
        return user_id;
    }

    /**
     * Sets the id of the user who created the House
     *
     * @param user_id the id of the user who created the House
     */
    public void setUser_id(ObjectId user_id) {
        this.user_id = user_id;
    }

    /**
     * Returns if autoMode is on
     *
     * @return if autoMode is on
     */
    public boolean isAutoMode() {
        return autoMode;
    }

    /**
     * Sets if autoMode is on
     *
     * @param autoMode if autoMode is on
     */
    public void setAutoMode(boolean autoMode) {
        this.autoMode = autoMode;
    }

    public boolean isAwayMode() {
        return awayMode;
    }

    public void setAwayMode(boolean awayMode) {
        this.awayMode = awayMode;
    }

    public double getSummerTemperature() {
        return summerTemperature;
    }

    public void setSummerTemperature(double summerTemperature) {
        this.summerTemperature = summerTemperature;
    }

    public double getWinterTemperature() {
        return winterTemperature;
    }

    public void setWinterTemperature(double winterTemperature) {
        this.winterTemperature = winterTemperature;
    }

    /**
     * Returns a string representation of a House object
     *
     * @return string representation of a House object
     */
    @Override
    public String toString() {
        return "House{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", user_id=" + user_id +
                ", autoMode=" + autoMode +
                ", awayMode=" + awayMode +
                ", summerTemperature=" + summerTemperature +
                ", winterTemperature=" + winterTemperature +
                '}';
    }

    /**
     * Compares the House to another object and returns if they are equal
     *
     * @param o the other object
     * @return if the two objects are equal
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        House house = (House) o;
        return autoMode == house.autoMode &&
                awayMode == house.awayMode &&
                Double.compare(house.summerTemperature, summerTemperature) == 0 &&
                Double.compare(house.winterTemperature, winterTemperature) == 0 &&
                Objects.equals(id, house.id) &&
                Objects.equals(name, house.name) &&
                Objects.equals(user_id, house.user_id);
    }
}
