package User;
import Data.ObjectIdSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;

/**
 * Class modeling the User entity. User objects are mapped into the 'users' collection in the MongoDB database.
 */
public class User {
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    private String username;

    /**
     * Default User constructor
     */
    public User() {

    }

    /**
     * Construct a new User instance
     *
     * @param id the ObjectId
     * @param username the username
     */
    public User(ObjectId id, String username) {
        this.id = id;
        this.username = username;
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
     * Returns the username
     *
     * @return the username
     */
    public String getUsername() {
        return username;
    }

    /**
     * Sets the id
     *
     * @param username the username
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Returns a string representation of a User object
     *
     * @return string representation of User object
     */
    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' +
                '}';
    }
}
