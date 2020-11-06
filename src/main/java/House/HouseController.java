package House;

import Agent.Agent;
import Door.Door;
import Room.Room;
import Room.Light;
import Room.Window;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.mongodb.BasicDBObject;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import org.apache.commons.io.IOUtils;
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
import java.util.HashMap;
import java.util.function.Consumer;

import static Room.RoomController.lightSwitch;
import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

/**
 * Class containing the controllers (or handlers) for all '/houses' endpoints.
 */
public class HouseController implements CrudHandler {

    private static final MongoDatabase database= MongoDBConnection.getMongoDatabase();
    private static final MongoCollection<House> houseCollection = database.getCollection("houses", House.class);
    private static final MongoCollection<Room> roomCollection = database.getCollection("rooms", Room.class);
    private static final MongoCollection<Door> doorCollection = database.getCollection("doors", Door.class);
    private static final MongoCollection<Agent> agentCollection = database.getCollection("agents", Agent.class);

    private static final Logger LOGGER = LoggerFactory.getLogger(HouseController.class);

    /**
     * Handler for uploading HouseLayout json files, and inserting the corresponding House and Room objects into
     * the database
     *
     * @param context http request/response object
     * @throws IOException input/output exception thrown if parsing file contents goes wrong
     */
    public static void uploadHouseLayoutFile(@NotNull Context context) throws IOException {
        LOGGER.info("Uploading new HouseLayout file");

        //extract json content from house layout file
        String jsonHouseLayout = IOUtils.toString(context.uploadedFile("house_layout").getContent(), StandardCharsets.UTF_8);

        //parse json into java object HouseLayout
        Gson gson = new Gson();
        HouseLayout houseLayout = gson.fromJson(jsonHouseLayout, HouseLayout.class);

        //insert new House into collection
        House house = new House(new ObjectId(), context.formParam("house_name"), new ObjectId(context.pathParam("user-id")), false);
        houseCollection.insertOne(house);

        HashMap<String, ObjectId> doorMap = new HashMap<>();

        for(HouseLayout.RoomLayout roomLayout : houseLayout.getRoomLayouts()) {

            //handle doors
            for (String toRoom : roomLayout.getDoorsTo()) {
                if (!(doorMap.containsKey(toRoom + "-" + roomLayout.getName())) &&
                        !(doorMap.containsKey(roomLayout.getName() + "-" + toRoom))) {
                    Door newDoor = new Door(new ObjectId(), toRoom, roomLayout.getName(), true);
                    doorMap.put(roomLayout.getName() + "-" + toRoom, newDoor.getId());
                    doorCollection.insertOne(newDoor);
                }
            }
        }

        //iterate over rooms in layout file and insert into database as Room objects
        for(HouseLayout.RoomLayout roomLayout : houseLayout.getRoomLayouts()) {
            ArrayList<ObjectId> doorsForRoom = new ArrayList<>();

            doorMap.keySet().forEach((roomConnection) -> {
                String[] rooms = roomConnection.split("-", 2);
                if (rooms[0].equals(roomLayout.getName()) || rooms[1].equals(roomLayout.getName())) {
                    doorsForRoom.add(doorMap.get(roomConnection));
                }
            });

            //handle lights
            ArrayList<Light> lightList = new ArrayList<>();
            for (int i = 0; i < roomLayout.getLights(); i++) {
                lightList.add(new Light(new ObjectId(), "Light_" + (i+1) + "", false));
            }

            //handle windows
            ArrayList<Window> windowList = new ArrayList<>();
            for (int i = 0; i < roomLayout.getWindows(); i++) {
                windowList.add(new Window(new ObjectId(), true, false));
            }

            Room room = new Room(new ObjectId(), house.getId(), roomLayout.getName(), windowList, lightList, doorsForRoom);
            roomCollection.insertOne(room);
        }
        LOGGER.info("Create a new House {}", house);

        context.json(house);
    }

    /**
     * Handler for fetching all Houses
     *
     * @param context http request/response object
     */
    public void getAll(@NotNull Context context) {
        LOGGER.info("Get all Houses");

        ArrayList<Bson> filters = new ArrayList<>();

        //iterate over fields of House class
        for (Field f : House.class.getDeclaredFields()) {
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

        FindIterable<House> houses;
        if(filters.size() > 0){
            //join query param filters with logical ANDs
            Bson filter = and(filters);

            //query database with filter
            houses = houseCollection.find(filter);
        } else {
            houses = houseCollection.find();
        }

        //construct arrayList out with query results and send as json response
        ArrayList<House> houseList = new ArrayList<>();
        houses.forEach((Consumer<House>) houseList::add);
        context.json(houseList);
    }

    /**
     * Handler to fetch a House by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the House
     */
    public void getOne(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Get the House {}", resourceId);
        House house = houseCollection.find(eq("_id", new ObjectId(resourceId))).first();
        System.out.println(house);
        if (house != null) {
            context.json(house);
        }
    }

    /**
     * Handler for creating Houses
     *
     * @param context http request/response object
     */
    public void create(@NotNull Context context) {
        House house = context.bodyAsClass(House.class);
        LOGGER.info("Create a new House {}", house);
        houseCollection.insertOne(house);
        context.json(house);
    }

    /**
     * Handler to update a House by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the House
     */
    public void update(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Update the House {}", resourceId);
        House houseUpdate = context.bodyAsClass(House.class);
        JsonObject houseUpdateJson = new Gson().fromJson(context.body(), JsonObject.class);

        BasicDBObject carrier = new BasicDBObject();
        BasicDBObject set = new BasicDBObject("$set", carrier);
        if (houseUpdateJson.has("name")) {
            carrier.put("name", houseUpdate.getName());
        }

        if (houseUpdateJson.has("user_id")) {
            carrier.put("house_id", houseUpdate.getUser_id());
        }

        LOGGER.info("With values: {}", houseUpdateJson);

        FindOneAndUpdateOptions returnDocAfterUpdate = new FindOneAndUpdateOptions()
                .returnDocument(ReturnDocument.AFTER);

        House houseUpdated = houseCollection.findOneAndUpdate(eq("_id", new ObjectId(resourceId)), set, returnDocAfterUpdate);
        System.out.println(houseUpdated);
        if (houseUpdated != null) {
            context.json(houseUpdated);
        }
    }

    /**
     * Handler for deleting a House by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the House
     */
    public void delete(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Delete the House {}", resourceId);
        House house = houseCollection.findOneAndDelete(eq("_id", new ObjectId(resourceId)));
        if(house != null) {
            context.json(house);
        } else {
            context.status(500);
        }
    }
}