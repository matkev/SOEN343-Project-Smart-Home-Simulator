package Zone;

import Data.ObjectIdSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;


import java.util.List;
import java.util.Objects;

/**
 * Class modeling the Zone entity. Zone objects are mapped into the 'heatingZones' collection in the MongoDB database.
 */
public class Zone {
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;

    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId house_id;
    private String name;
    private List<Period> periods;


    /**
     * Default Zone constructor
     */
    public Zone() {
    }

    /**
     * Construct a new Zone instance
     *
     * @param id       the id
     * @param house_id the id of the associated House
     * @param name     the name
     * @param periods  the list of heating and cooling periods for this Zone
     */
    public Zone(ObjectId id, ObjectId house_id, String name, List<Period> periods) {
        this.id = id;
        this.house_id = house_id;
        this.name = name;
        this.periods = periods;
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
     * Gets the periods for this zone
     *
     * @return the periods for this zone
     */
    public List<Period> getPeriods() {
        return periods;
    }

    /**
     * Sets the periods for this zone
     *
     * @param periods the periods for this zone
     */
    public void setPeriods(List<Period> periods) {
        this.periods = periods;
    }

    /**
     * Returns a string representation of a Zone object
     *
     * @return a string representation of a Zone object
     */
    @Override
    public String toString() {
        return "Zone{" +
                "id=" + id +
                ", house_id=" + house_id +
                ", name='" + name + '\'' +
                '}';
    }

    /**
     * Compares the Zone to another object and returns if they are equal
     *
     * @param o the other object
     * @return if the two objects are equal
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Zone zone = (Zone) o;
        return Objects.equals(id, zone.id) &&
                Objects.equals(house_id, zone.house_id) &&
                Objects.equals(name, zone.name);
    }
}
