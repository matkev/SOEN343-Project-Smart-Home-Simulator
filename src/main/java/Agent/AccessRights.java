package Agent;

/**
 * This class contains the attributes related to an Agent's access rights or permissions within the smart home
 */
public class AccessRights {
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
