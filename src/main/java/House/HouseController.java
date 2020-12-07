package House;

import Agent.Agent;
import Door.Door;
import Room.Room;
import Room.Light;
import Room.Window;
import Zone.Zone;
import Zone.Period;
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
import java.util.List;
import java.util.function.Consumer;

import static Room.RoomController.lightSwitch;
import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

/**
 * Class containing the controllers (or handlers) for all '/houses' endpoints.
 */
public class HouseController implements CrudHandler {

    private static final MongoDatabase database = MongoDBConnection.getMongoDatabase();
    private static final MongoCollection<House> houseCollection = database.getCollection("houses", House.class);
    private static final MongoCollection<Zone> zoneCollection = database.getCollection("zones", Zone.class);
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
        House house = new House(new ObjectId(), context.formParam("house_name"), new ObjectId(context.pathParam("user-id")), false, true, 19.0, 23.0, "15/05", "15/09");
        houseCollection.insertOne(house);

        ArrayList<Period> periodList = new ArrayList<>();
        periodList.add(new Period(new ObjectId(), "00:00", "23:59", 23.0));

        Zone zone = new Zone(new ObjectId(), house.getId(), "Zone 1", periodList);
        zoneCollection.insertOne(zone);

        HashMap<String, ObjectId> doorMap = new HashMap<>();

        //iterate over the roomLayouts in the house layout file
        for (HouseLayout.RoomLayout roomLayout : houseLayout.getRoomLayouts()) {

            //for each roomLayout, add new doors to a hash map of all the doors in the house
            for (String toRoom : roomLayout.getDoorsTo()) {
                if (!(doorMap.containsKey(toRoom + "-" + roomLayout.getName())) &&
                        !(doorMap.containsKey(roomLayout.getName() + "-" + toRoom))) {

                    Door newDoor = new Door(new ObjectId(), toRoom, roomLayout.getName(), true);
                    doorMap.put(roomLayout.getName() + "-" + toRoom, newDoor.getId());

                    //insert each new door into the database
                    doorCollection.insertOne(newDoor);
                }
            }
        }

        //iterate over the roomLayouts in the house layout file and insert into database as Room objects
        for (HouseLayout.RoomLayout roomLayout : houseLayout.getRoomLayouts()) {

            //find the doors from the hashmap that are for this room
            ArrayList<ObjectId> doorList = new ArrayList<>();
            doorMap.keySet().forEach((roomConnection) -> {
                String[] rooms = roomConnection.split("-", 2);
                if (rooms[0].equals(roomLayout.getName()) || rooms[1].equals(roomLayout.getName())) {
                    doorList.add(doorMap.get(roomConnection));
                }
            });

            //create list of lights
            ArrayList<Light> lightList = new ArrayList<>();
            for (int i = 0; i < roomLayout.getLights(); i++) {
                lightList.add(new Light(new ObjectId(), "Light_" + (i + 1) + "", false));
            }

            //create list of windows
            ArrayList<Window> windowList = new ArrayList<>();
            for (int i = 0; i < roomLayout.getWindows(); i++) {
                windowList.add(new Window(new ObjectId(), true, false));
            }

            //create Room
            Room room = new Room(new ObjectId(), house.getId(), zone.getId(), roomLayout.getName(), windowList, lightList, doorList, null);
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
        if (filters.size() > 0) {
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
     * @param context    http request/response object
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
     * @param context    http request/response object
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
            carrier.put("user_id", houseUpdate.getUser_id());
        }

        if (houseUpdateJson.has("autoMode")) {
            carrier.put("autoMode", houseUpdate.isAutoMode());

            //if automode is turned on, then handle lights
            if (houseUpdate.isAutoMode()) {
                //find all the agents in the house and all the rooms in the house
                FindIterable agentsInHouse = agentCollection.find(eq("house_id", new ObjectId(resourceId)));
                FindIterable roomsInHouse = roomCollection.find(eq("house_id", new ObjectId(resourceId)));

                //store the results in arrayLists
                ArrayList<Agent> agentsInHouseList = new ArrayList<>();
                agentsInHouse.forEach((Consumer<Agent>) agentsInHouseList::add);

                ArrayList<Room> unoccupiedRoomsList = new ArrayList<>();
                roomsInHouse.forEach((Consumer<Room>) unoccupiedRoomsList::add);

                ArrayList<ObjectId> occupiedRoomsList = new ArrayList<>();

                //iterate over agents in the house
                agentsInHouseList.forEach((agent) -> {
                    //if the room the agent is in hasn't already had the lights turned on, then turn them on
                    if (!occupiedRoomsList.contains(agent.getRoom_id())) {
                        lightSwitch(agent.getRoom_id(), true);
                    }

                    //update which rooms are occupied/unoccupied
                    occupiedRoomsList.add(agent.getRoom_id());
                    unoccupiedRoomsList.removeIf(room -> room.getId().equals(agent.getRoom_id()));
                });

                //iterate over unoccupied rooms and turn the lights off
                unoccupiedRoomsList.forEach((room) -> lightSwitch(room.getId(), false));
            }
        }

        if (houseUpdateJson.has("awayMode")) {
            carrier.put("awayMode", houseUpdate.isAwayMode());

            //if awayMode is being set to True, make all agents go outside
            if (houseUpdate.isAwayMode()) {
                FindIterable agentsInHouse = agentCollection.find(eq("house_id", new ObjectId(resourceId)));

                ArrayList<Agent> agentsInHouseList = new ArrayList<>();
                agentsInHouse.forEach((Consumer<Agent>) agentsInHouseList::add);

                agentsInHouseList.forEach((agent) -> {
                    BasicDBObject agentCarrier = new BasicDBObject();
                    BasicDBObject agentSet = new BasicDBObject("$set", agentCarrier);

                    agentCarrier.put("room_id", null);

                    agentCollection.findOneAndUpdate(eq("_id", agent.getId()), agentSet);
                });
            }
        }

        if (houseUpdateJson.has("summerTemperature")) {
            carrier.put("summerTemperature", houseUpdate.getSummerTemperature());
        }

        if (houseUpdateJson.has("winterTemperature")) {
            carrier.put("winterTemperature", houseUpdate.getWinterTemperature());
        }

        if (houseUpdateJson.has("summerStartDate")) {
            carrier.put("summerStartDate", houseUpdate.getSummerStartDate());
        }

        if (houseUpdateJson.has("winterStartDate")) {
            carrier.put("winterStartDate", houseUpdate.getWinterStartDate());
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
     * @param context    http request/response object
     * @param resourceId ObjectId of the House
     */
    public void delete(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Delete the House {}", resourceId);
        House house = houseCollection.findOneAndDelete(eq("_id", new ObjectId(resourceId)));
        if (house != null) {
            context.json(house);
        } else {
            context.status(500);
        }
    }
}