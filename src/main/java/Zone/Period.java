package Zone;

import Data.ObjectIdSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;

import java.util.Objects;

/**
 * Class modeling the Period entity associated with Zones
 */
public class Period {
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    private String startTime;
    private String endTime;
    private double temperatureSetting;

    /**
     * Construct a new Period instance
     * @param id the id of the Period
     * @param startTime the start time of the period
     * @param endTime the end time of the period
     * @param temperatureSetting the temeprature setting of the period
     */
    public Period(ObjectId id, String startTime, String endTime, double temperatureSetting) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.temperatureSetting = temperatureSetting;
    }


    /**
     * Default Period constructor
     */
    public Period() {

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
     * Gets the period start time
     *
     * @return the period start time
     */
    public String getStartTime() {
        return startTime;
    }

    /**
     * Sets the period start time
     *
     * @param startTime the period start time
     */
    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    /**
     * Gets the period end time
     *
     * @return the period end time
     */
    public String getEndTime() {
        return endTime;
    }

    /**
     * Sets the period end time
     *
     * @param endTime the period end time
     */
    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    /**
     * Gets the period temperature setting
     *
     * @return the period temperature setting
     */
    public double getTemperatureSetting() {
        return temperatureSetting;
    }

    /**
     * Sets the period temperature setting
     *
     * @param temperatureSetting the period temperature setting
     */
    public void setTemperatureSetting(double temperatureSetting) {
        this.temperatureSetting = temperatureSetting;
    }

    /**
     * Returns a string representation of a Period object
     *
     * @return string representation of a Period object
     */
    @Override
    public String toString() {
        return "Period{" +
                "id=" + id +
                ", startTime='" + startTime + '\'' +
                ", endTime='" + endTime + '\'' +
                ", temperatureSetting=" + temperatureSetting +
                '}';
    }

    /**
     * Compares the Period to another object and returns if they are equal
     *
     * @param o the other object
     * @return if the two objects are equal
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Period period = (Period) o;
        return Double.compare(period.temperatureSetting, temperatureSetting) == 0 &&
                Objects.equals(id, period.id) &&
                Objects.equals(startTime, period.startTime) &&
                Objects.equals(endTime, period.endTime);
    }
}
