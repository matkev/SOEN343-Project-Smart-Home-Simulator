package House;

import org.bson.types.ObjectId;

/**
 * Class modeling the House entity. House objects are mapped into the 'houses' collection in the MongoDB database.
 */
public class House {
    private ObjectId id;
    private String name;

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
     */
    public House(ObjectId id, String name) {
        this.id = id;
        this.name = name;
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
     * Sets the id
     *
     * @param name the name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Returns a string representation of a House object
     *
     * @return string representation of a House object
     */
    @Override
    public String toString() {
        return "House.House{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
