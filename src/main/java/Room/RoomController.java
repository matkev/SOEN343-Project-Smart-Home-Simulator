package Room;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.FindOneAndUpdateOptions;
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

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.function.Consumer;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

/**
 * Class containing the controllers (or handlers) for all '/rooms' endpoints.
 */
public class RoomController implements CrudHandler {

    private static final MongoDatabase database= MongoDBConnection.getMongoDatabase();
    private static final MongoCollection<Room> roomCollection = database.getCollection("rooms", Room.class);

    private static final Logger LOGGER = LoggerFactory.getLogger(RoomController.class);

    /**
     * Handler for fetching all Rooms
     *
     * @param context http request/response object
     */
    public void getAll(@NotNull Context context) {
        LOGGER.info("Get all Rooms");

        ArrayList<Bson> filters = new ArrayList<>();

        //iterate over fields of Room class
        for (Field f : Room.class.getDeclaredFields()) {
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

        FindIterable<Room> rooms;
        if(filters.size() > 0){
            //join query param filters with logical ANDs
            Bson filter = and(filters);

            //query database with filter
            rooms = roomCollection.find(filter);
        } else {
            rooms = roomCollection.find();
        }

        //construct arrayList out with query results and send as json response
        ArrayList<Room> roomsList = new ArrayList<>();
        rooms.forEach((Consumer<Room>) roomsList::add);
        context.json(roomsList);
    }

    /**
     * Handler to fetch a Room by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the Room
     */
    public void getOne(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Get the Room {}", resourceId);
        Room room = roomCollection.find(eq("_id", new ObjectId(resourceId))).first();
        System.out.println(room);
        if (room != null) {
            context.json(room);
        }
    }

    /**
     * Handler for creating Rooms
     *
     * @param context http request/response object
     */
    public void create(@NotNull Context context) {
        Room room = context.bodyAsClass(Room.class);
        LOGGER.info("Create a new Room {}", room);
        roomCollection.insertOne(room);
        context.json(room);
    }

    /**
     * Handler to update a Room by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the Room
     */
    public void update(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Update the Room {}", resourceId);
        Room roomUpdate = context.bodyAsClass(Room.class);
        JsonObject roomUpdateJson = new Gson().fromJson(context.body(), JsonObject.class);

        BasicDBObject carrier = new BasicDBObject();
        BasicDBObject set = new BasicDBObject("$set", carrier);
        if (roomUpdateJson.has("house_id")) {
            carrier.put("house_id", roomUpdate.getHouse_id());
        }

        if (roomUpdateJson.has("name")) {
            carrier.put("name", roomUpdate.getName());
        }

        if (roomUpdateJson.has("windows")) {
            carrier.put("windows", roomUpdate.getWindows());
        }

        if (roomUpdateJson.has("lights")) {
            carrier.put("lights", roomUpdate.getLights());
        }

        if (roomUpdateJson.has("doorsTo")) {
            carrier.put("doorsTo", roomUpdate.getDoorsTo());
        }

        LOGGER.info("With values: {}", roomUpdateJson);

        FindOneAndUpdateOptions returnDocAfterUpdate = new FindOneAndUpdateOptions()
                .returnDocument(ReturnDocument.AFTER);

        Room roomUpdated = roomCollection.findOneAndUpdate(eq("_id", new ObjectId(resourceId)), set, returnDocAfterUpdate);
        System.out.println(roomUpdated);
        if (roomUpdated != null) {
            context.json(roomUpdated);
        }
    }

    /**
     * Handler for deleting a Room by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the Room
     */
    public void delete(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Delete the Room {}", resourceId);
        Room room = roomCollection.findOneAndDelete(eq("_id", new ObjectId(resourceId)));
        if(room != null) {
            context.json(room);
        } else {
            context.status(500);
        }
    }
}