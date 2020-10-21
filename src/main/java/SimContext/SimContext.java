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
    private long lastDate;  //stored as unix time

    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId user_id;

    /**
     * Default SimContext constructor
     */
    public SimContext() {

    }

    /**
     * Construct a new SimContext instance
     *
     * @param id the ObjectId
     * @param lastDate the last recorded time
     * @param user_id the id of the user who created the SimContext
     */
    public SimContext(ObjectId id, long lastDate, ObjectId user_id) {
        this.id = id;
        this.lastDate = lastDate;
        this.user_id = user_id;
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
     * Returns the id of the user who created the SimContext
     *
     * @return the id of the user who created the SimContext
     */
    public ObjectId getUser_id() {
        return user_id;
    }

    /**
     * Sets the id of the user who created the SimContext
     *
     * @param user_id the id of the user who created the SimContext
     */
    public void setUser_id(ObjectId user_id) {
        this.user_id = user_id;
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
                ", user_id=" + user_id +
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
                Objects.equals(user_id, context.user_id);
    }
}
