package SimContext;

import Data.ObjectIdSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;

import java.util.Objects;

/**
 * Class modeling the SimContext entity. SimContext objects are mapped into the 'houses' collection in the MongoDB database.
 */
public class SimContext {
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    private long lastDate;          //stored as unix time

    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId house_id;

    /**
     * Default SimContext constructor
     */
    public SimContext() {

    }

    /**
     * Construct a new SimContext instance
     *
     * @param id       the ObjectId
     * @param lastDate the last recorded time
     * @param house_id the id of the house associated with the created SimContext
     */
    public SimContext(ObjectId id, long lastDate, ObjectId house_id) {
        this.id = id;
        this.lastDate = lastDate;
        this.house_id = house_id;
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
     * Returns the last recorded time
     *
     * @return the last date
     */
    public long getLastDate() {
        return lastDate;
    }

    /**
     * Sets the last recorded time
     *
     * @param lastDate the last recorded time
     */
    public void setLastDate(long lastDate) {
        this.lastDate = lastDate;
    }

    /**
     * Returns the id of the house associated with the created SimContext
     *
     * @return the id of the house associated with the created SimContext
     */
    public ObjectId getHouse_id() {
        return house_id;
    }

    /**
     * Sets the id of the house associated with the created SimContext
     *
     * @param house_id the id of the house associated with the created SimContext
     */
    public void setHouse_id(ObjectId house_id) {
        this.house_id = house_id;
    }

    /**
     * Returns a string representation of a SimContext object
     *
     * @return string representation of a SimContext object
     */
    @Override
    public String toString() {
        return this.getClass().getSimpleName() + "{" +
                "id=" + id +
                ", lastDate='" + lastDate + '\'' +
                ", house_id=" + house_id +
                '}';
    }

    /**
     * Compares the SimContext to another object and returns if they are equal
     *
     * @param o the other object
     * @return if the two objects are equal
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SimContext context = (SimContext) o;
        return Objects.equals(id, context.id) &&
                Objects.equals(lastDate, context.lastDate) &&
                Objects.equals(house_id, context.house_id);
    }
}
