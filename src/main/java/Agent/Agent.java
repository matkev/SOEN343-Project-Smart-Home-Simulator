package Agent;
import Data.ObjectIdSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;

import java.util.Objects;

/**
 * Class modeling the Agent entity. Agent objects are mapped into the 'agents' collection in the MongoDB database.
 */
public class Agent {
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    private String agentname;

    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId house_id;

    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId room_id;
    private boolean isAway;
    private AccessRights accessRights;

    /**
     * Default Agent constructor
     */
    public Agent() {

    }

    /**
     * Construct a new Agent instance
     *
     * @param id the ObjectId
     * @param agentname the agentname
     * @param house_id the id of the House the Agent is associated with
     * @param room_id the id of the Room the Agent is located in
     * @param isAway if the Agent is away from the House
     * @param accessRights the Agent's access rights to various modules
     */
    public Agent(ObjectId id, String agentname, ObjectId house_id, ObjectId room_id, boolean isAway, AccessRights accessRights) {
        this.id = id;
        this.agentname = agentname;
        this.house_id = house_id;
        this.room_id = room_id;
        this.isAway = isAway;
        this.accessRights = accessRights;
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
     * Returns the agentname
     *
     * @return the agentname
     */
    public String getAgentname() {
        return agentname;
    }

    /**
     * Sets the agentname
     *
     * @param agentname the agentname
     */
    public void setAgentname(String agentname) {
        this.agentname = agentname;
    }

    /**
     * Returns the id of the House the Agent is associated with
     *
     * @return the id of the House the Agent is associated with
     */
    public ObjectId getHouse_id() {
        return house_id;
    }

    /**
     * Sets the id of the House the Agent is associated with
     *
     * @param house_id the id of the House the Agent is associated with
     */
    public void setHouse_id(ObjectId house_id) {
        this.house_id = house_id;
    }

    /**
     * Returns the id of the Room the Agent is located in
     *
     * @return the id of the Room the Agent is located in
     */
    public ObjectId getRoom_id() {
        return room_id;
    }

    /**
     * Sets the id of the Room the Agent is located in
     *
     * @param room_id the id of the Room the Agent is located in
     */
    public void setRoom_id(ObjectId room_id) {
        this.room_id = room_id;
    }

    /**
     * Returns if the agent is away from the House
     *
     * @return if the agent is away from the House
     */
    public boolean getIsAway() {
        return isAway;
    }

    /**
     * Sets if the agent is away from the House
     *
     * @param isAway if the agent is away from the House
     */
    public void setIsAway(boolean isAway) {
        this.isAway = isAway;
    }

    /**
     * Returns the accessRights of the Agent
     *
     * @return the accessRights of the Agent
     */
    public AccessRights getAccessRights() {
        return accessRights;
    }

    /**
     * Set the accessRights of the Agent
     *
     * @param accessRights the accessRights of the Agent
     */
    public void setAccessRights(AccessRights accessRights) {
        this.accessRights = accessRights;
    }

    /**
     * Returns a string representation of a Agent object
     *
     * @return string representation of Agent object
     */
    @Override
    public String toString() {
        return "Agent{" +
                "id=" + id +
                ", agentname='" + agentname + '\'' +
                ", house_id=" + house_id +
                ", room_id=" + room_id +
                ", isAway=" + isAway +
                ", accessRights=" + accessRights +
                '}';
    }

    /**
     * Compares the Agent to another object and returns if they are equal
     *
     * @param o the other object
     * @return if the two objects are equal
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Agent agent = (Agent) o;
        return isAway == agent.isAway &&
                Objects.equals(id, agent.id) &&
                Objects.equals(agentname, agent.agentname) &&
                Objects.equals(house_id, agent.house_id) &&
                Objects.equals(room_id, agent.room_id) &&
                Objects.equals(accessRights, agent.accessRights);
    }
}
