package Door;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.mongodb.BasicDBObject;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.ReturnDocument;
import io.javalin.apibuilder.CrudHandler;
import io.javalin.http.Context;
import Data.MongoDBConnection;
import com.mongodb.client.MongoDatabase;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.jetbrains.annotations.NotNull;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.function.Consumer;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

/**
 * Class containing the controllers (or handlers) for all '/doors' endpoints.
 */
public class DoorController implements CrudHandler {

    private static final MongoDatabase database= MongoDBConnection.getMongoDatabase();
    private static final MongoCollection<Door> doorCollection = database.getCollection("doors", Door.class);

    private static final Logger LOGGER = LoggerFactory.getLogger(DoorController.class);

    /**
     * Handler for fetching all Doors
     *
     * @param context http request/response object
     */
    public void getAll(@NotNull Context context) {
        LOGGER.info("Get all Doors");

        ArrayList<Bson> filters = new ArrayList<>();

        //iterate over fields of Door class
        for (Field f : Door.class.getDeclaredFields()) {
            String fieldName = f.getName();
            Class fieldType = f.getType();

            //check if the field is in query params
            if (context.queryParam(fieldName) != null) {

                //check if the field is a boolean, int, ObjectId or other
                if (fieldType.equals(boolean.class)) {
                    filters.add(eq(fieldName, Boolean.parseBoolean(context.queryParam(fieldName))));
                } else if (fieldType.equals(int.class)) {
                    filters.add(eq(fieldName, Integer.parseInt(context.queryParam(fieldName))));
                } else if (fieldType.equals(ObjectId.class)) {
                    filters.add(eq(fieldName, new ObjectId(context.queryParam(fieldName))));
                } else {
                    filters.add(eq(fieldName, context.queryParam(fieldName)));
                }
            }
        }

        FindIterable<Door> doors;
        if(filters.size() > 0){
            //join query param filters with logical ANDs
            Bson filter = and(filters);

            //query database with filter
            doors = doorCollection.find(filter);
        } else {
            doors = doorCollection.find();
        }

        //construct arrayList out with query results and send as json response
        ArrayList<Door> doorList = new ArrayList<>();
        doors.forEach((Consumer<Door>) doorList::add);
        context.json(doorList);
    }

    /**
     * Handler to fetch a Door by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the Door
     */
    public void getOne(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Get the Door {}", resourceId);
        Door door = doorCollection.find(eq("_id", new ObjectId(resourceId))).first();
        System.out.println(door);
        if (door != null) {
            context.json(door);
        }
    }

    /**
     * Handler for creating Doors
     *
     * @param context http request/response object
     */
    public void create(@NotNull Context context) {
        Door door = context.bodyAsClass(Door.class);
        LOGGER.info("Create a new Door {}", door);
        doorCollection.insertOne(door);
        context.json(door);
    }

    /**
     * Handler to update a Door by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the Door
     */
    public void update(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Update the Door {}", resourceId);
        Door doorUpdate = context.bodyAsClass(Door.class);
        JsonObject doorUpdateJson = new Gson().fromJson(context.body(), JsonObject.class);

        BasicDBObject carrier = new BasicDBObject();
        BasicDBObject set = new BasicDBObject("$set", carrier);
        if (doorUpdateJson.has("doorIsLocked")) {
            carrier.put("doorIsLocked", doorUpdate.getDoorIsLocked());
        }

        LOGGER.info("With values: {}", doorUpdateJson);

        FindOneAndUpdateOptions returnDocAfterUpdate = new FindOneAndUpdateOptions()
                .returnDocument(ReturnDocument.AFTER);

        Door doorUpdated = doorCollection.findOneAndUpdate(eq("_id", new ObjectId(resourceId)), set, returnDocAfterUpdate);
        System.out.println(doorUpdated);
        if (doorUpdated != null) {
            context.json(doorUpdated);
        }
    }

    /**
     * Handler for deleting a Door by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the Door
     */
    public void delete(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Delete the Door {}", resourceId);
        Door door = doorCollection.findOneAndDelete(eq("_id", new ObjectId(resourceId)));
        if(door != null) {
            context.json(door);
        } else {
            context.status(500);
        }
    }
}