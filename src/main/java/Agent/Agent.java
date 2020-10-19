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
     * Sets the id
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

    /**
     * This class contains the attributes related to an Agent's access rights or permissions within the smart home
     */
    public static class AccessRights {
        private boolean shcRights;
        private boolean shpRights;
        private boolean shhRights;

        /**
         * Default AccessRights constructor
         */
        public AccessRights() {
        }

        /**
         * Construct a new AccessRights instance
         *
         * @param shcRights access rights to the SHC module
         * @param shpRights access rights to the SHP module
         * @param shhRights access rights to the SHH module
         */
        public AccessRights(boolean shcRights, boolean shpRights, boolean shhRights) {
            this.shcRights = shcRights;
            this.shpRights = shpRights;
            this.shhRights = shhRights;
        }

        /**
         * Returns access rights to the SHC module
         *
         * @return access rights to the SHC module
         */
        public boolean getShcRights() {
            return shcRights;
        }

        /**
         * Sets access rights to the SHC module
         *
         * @param shcRights access rights to the SHC module
         */
        public void setShcRights(boolean shcRights) {
            this.shcRights = shcRights;
        }

        /**
         * Returns access rights to the SHP module
         *
         * @return access rights to the SHP module
         */
        public boolean getShpRights() {
            return shpRights;
        }

        /**
         * Sets access rights to the SHP module
         *
         * @param shpRights access rights to the SHP module
         */
        public void setShpRights(boolean shpRights) {
            this.shpRights = shpRights;
        }

        /**
         * Returns access rights to the SHH module
         *
         * @return access rights to the SHH module
         */
        public boolean getShhRights() {
            return shhRights;
        }

        /**
         * Sets access rights to the SHH module
         *
         * @param shhRights access rights to the SHH module
         */
        public void setShhRights(boolean shhRights) {
            this.shhRights = shhRights;
        }

        /**
         * Returns a string representation of a AccessRights object
         *
         * @return a string representation of a AccessRights object
         */
        @Override
        public String toString() {
            return "AccessRights{" +
                    "shcRights=" + shcRights +
                    ", shpRights=" + shpRights +
                    ", shhRights=" + shhRights +
                    '}';
        }

        /**
         * Compares the AccessRights to another object and returns if they are equal
         *
         * @param o the other object
         * @return if the two objects are equal
         */
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            AccessRights that = (AccessRights) o;
            return shcRights == that.shcRights &&
                    shpRights == that.shpRights &&
                    shhRights == that.shhRights;
        }
    }
}
