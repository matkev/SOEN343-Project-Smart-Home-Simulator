package Room;

import Data.ObjectIdSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;

import java.util.Objects;

public class Light {
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    private String name;
    private boolean lightIsOn;

    public Light(ObjectId id, String name, boolean lightIsOn) {
        this.id = id;
        this.name = name;
        this.lightIsOn = lightIsOn;
    }

    public Light() {

    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean getLightIsOn() {
        return lightIsOn;
    }

    public void setLightIsOn(boolean lightIsOn) {
        this.lightIsOn = lightIsOn;
    }

    @Override
    public String toString() {
        return "Light{" +
                "id=" + id +
                ", name=" + name +
                ", lightIsOn=" + lightIsOn +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Light light = (Light) o;
        return lightIsOn == light.lightIsOn &&
                Objects.equals(id, light.id) &&
                Objects.equals(name, light.name);
    }
}
