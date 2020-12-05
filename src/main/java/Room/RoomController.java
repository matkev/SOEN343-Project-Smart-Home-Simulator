package Room;

import Door.Door;
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
import java.util.*;
import java.util.function.Consumer;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.or;
import static com.mongodb.client.model.Filters.eq;

/**
 * Class containing the controllers (or handlers) for all '/rooms' endpoints.
 */
public class RoomController implements CrudHandler {

    private static final MongoDatabase database = MongoDBConnection.getMongoDatabase();
    private static final MongoCollection<Room> roomCollection = database.getCollection("rooms", Room.class);
    private static final MongoCollection<Door> doorCollection = database.getCollection("doors", Door.class);

    private static final Logger LOGGER = LoggerFactory.getLogger(RoomController.class);


    /**
     * Handler for fetching the doors associated with a Room
     *
     * @param context http request/response object
     */
    public static void getDoors(@NotNull Context context) {
        Room room = roomCollection.find(eq("_id", new ObjectId(context.pathParam("room-id")))).first();

        List<ObjectId> doorIds = room.getDoors();
        ArrayList<Bson> filters = new ArrayList<>();

        doorIds.forEach((doorId) -> filters.add(eq("_id", doorId)));
        Bson filter = or(filters);

        //query database with filter
        FindIterable<Door> doors = doorCollection.find(filter);

        //construct arrayList out with query results and send as json response
        ArrayList<Door> doorsList = new ArrayList<>();
        doors.forEach((Consumer<Door>) doorsList::add);
        context.json(doorsList);
    }

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
            Class<?> fieldType = f.getType();

            //check if the field is in query params
            if (context.queryParam(fieldName) != null) {

                //check if the field is a boolean, int, ObjectId or other
                if (fieldType.equals(boolean.class)) {
                    filters.add(eq(fieldName, Boolean.parseBoolean(context.queryParam(fieldName))));
                } else if (fieldType.equals(int.class)) {
                    filters.add(eq(fieldName, Integer.parseInt(context.queryParam(fieldName))));
                } else if (fieldType.equals(ObjectId.class)) {
                    filters.add(eq(fieldName, new ObjectId(context.queryParam(fieldName))));
                } else if (fieldType.equals(Double.class)) {
                    filters.add(eq(fieldName, Double.parseDouble(context.queryParam(fieldName))));
                } else {
                    filters.add(eq(fieldName, context.queryParam(fieldName)));
                }
            }
        }

        FindIterable<Room> rooms;
        if (filters.size() > 0) {
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
     * @param context    http request/response object
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
     * @param context    http request/response object
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
        
        if (roomUpdateJson.has("overridden_temperature")) {
            carrier.put("overridden_temperature", roomUpdate.getOverridden_temperature());
        }

        if (roomUpdateJson.has("windows")) {
            List<Window> list = updateWindows(roomUpdate, new ObjectId(resourceId));

            carrier.put("windows", list);
        }

        if (roomUpdateJson.has("lights")) {
            List<Light> list = updateLights(roomUpdate, new ObjectId(resourceId));

            carrier.put("lights", list);
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
     * @param context    http request/response object
     * @param resourceId ObjectId of the Room
     */
    public void delete(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Delete the Room {}", resourceId);
        Room room = roomCollection.findOneAndDelete(eq("_id", new ObjectId(resourceId)));
        if (room != null) {
            context.json(room);
        } else {
            context.status(500);
        }
    }

    /**
     * Updates the lights of a room, by comparing the Lights in a 'Room update' object and the Lights
     * of the Room in the database to be updated. Only Lights with the same ObjectId in both are updated, and Lights not
     * included in the update object are kept as they are.
     *
     * @param roomUpdate the Room object with updated properties
     * @param oldRoom    the ObjectId of the Room in the database to be updated
     * @return a List of Lights that the Room in the database will be updated with
     */
    public static List<Light> updateLights(Room roomUpdate, ObjectId oldRoom) {
        List<Light> updatedLights = roomUpdate.getLights();
        Room room = roomCollection.find(eq("_id", oldRoom)).first();
        List<Light> currentLights = room.getLights();
        HashMap<ObjectId, Light> currentLightMap = new HashMap<>();
        currentLights.forEach((light) -> currentLightMap.put(light.getId(), light));

        HashMap<ObjectId, Light> updatedLightMap = new HashMap<>();
        updatedLights.forEach((light) -> updatedLightMap.put(light.getId(), light));

        updatedLightMap.keySet().forEach((objectId) -> {
            if (currentLightMap.containsKey(objectId)) {
                Light currentLight = currentLightMap.get(objectId);
                Light updatedLight = updatedLightMap.get(objectId);
                currentLightMap.remove(objectId);

                Light newLight = new Light(objectId, updatedLight.getName() != null ? updatedLight.getName() : currentLight.getName(), updatedLight.getLightIsOn());
                currentLightMap.put(objectId, newLight);
            }
        });

        List<Light> list = new ArrayList<>(currentLightMap.values());
        return list;
    }

    /**
     * Switches all the Lights in a room either on or off.
     *
     * @param roomId   the ObjectId of the Room in the database
     * @param lightsOn whether to turn the Lights on or off
     */
    public static void lightSwitch(ObjectId roomId, boolean lightsOn) {
        Room room = roomCollection.find(eq("_id", roomId)).first();
        List<Light> roomLightsList = room.getLights();
        roomLightsList.forEach((light) -> light.setLightIsOn(lightsOn));
        room.setLights(roomLightsList);
        BasicDBObject roomCarrier = new BasicDBObject();
        BasicDBObject roomSet = new BasicDBObject("$set", roomCarrier);

        roomCarrier.put("lights", room.getLights());

        roomCollection.findOneAndUpdate(eq("_id", roomId), roomSet);

    }

    /**
     * Updates the Windows of a room, by comparing the Windows in a 'Room update' object and the Windows
     * of the Room in the database to be updated. Only Windows with the same ObjectId in both are updated, and Windows not
     * included in the update object are kept as they are.
     *
     * @param roomUpdate the Room object with updated properties
     * @param oldRoom    the ObjectId of the Room in the database to be updated
     * @return a List of Windows that the Room in the database will be updated with
     */
    public static List<Window> updateWindows(Room roomUpdate, ObjectId oldRoom) {
        List<Window> updatedWindows = roomUpdate.getWindows();
        Room room = roomCollection.find(eq("_id", oldRoom)).first();
        List<Window> currentWindows = room.getWindows();
        HashMap<ObjectId, Window> currentWindowMap = new HashMap<>();
        currentWindows.forEach((window) -> currentWindowMap.put(window.getId(), window));

        HashMap<ObjectId, Window> updatedWindowMap = new HashMap<>();
        updatedWindows.forEach((window) -> updatedWindowMap.put(window.getId(), window));

        updatedWindowMap.keySet().forEach((objectId) -> {
            if (currentWindowMap.containsKey(objectId)) {
                Window updatedWindow = updatedWindowMap.get(objectId);
                currentWindowMap.remove(objectId);

                Window newWindow = new Window(objectId, updatedWindow.getWindowIsLocked(), !updatedWindow.getWindowIsLocked() && updatedWindow.getWindowIsOpen());
                currentWindowMap.put(objectId, newWindow);
            }
        });

        List<Window> list = new ArrayList<>(currentWindowMap.values());
        return list;
    }
}