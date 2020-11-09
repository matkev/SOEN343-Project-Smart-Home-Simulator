package Data;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.bson.types.ObjectId;

import java.io.IOException;
import java.util.List;

/**
 * This class is responsible for correctly parsing a list of ObjectIds and returning the toString() result of ObjectIds
 * in API calls, instead of the entire object.
 */
public class ObjectIdListSerializer extends JsonSerializer<List<ObjectId>> {
    @Override
    public void serialize(List<ObjectId> ids, JsonGenerator jgen, SerializerProvider provider)
            throws IOException {

        if (ids == null) {
            jgen.writeNull();
        } else {
            jgen.writeStartArray();
            ids.forEach((id) -> {
                try {
//                    jgen.writeStartObject();
                    jgen.writeString(id.toString());
//                    jgen.writeEndObject();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
            jgen.writeEndArray();
        }
    }
}