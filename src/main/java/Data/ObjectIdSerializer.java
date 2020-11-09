package Data;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.bson.types.ObjectId;

import java.io.IOException;

/**
 * This class is responsible for correctly parsing ObjectIds and returning the toString() result of ObjectIds
 * in API calls, instead of the entire object.
 */
public class ObjectIdSerializer extends JsonSerializer<ObjectId> {
    @Override
    public void serialize(ObjectId id, JsonGenerator jgen, SerializerProvider provider)
            throws IOException {

        if (id == null) {
            jgen.writeNull();
        } else {
            jgen.writeString(id.toString());
        }
    }
}