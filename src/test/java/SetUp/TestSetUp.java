package SetUp;
import Agent.Agent;
import Agent.AccessRights;
import App.SmartHomeSimulatorAPI;
import Data.MongoDBConnection;
import Door.Door;
import House.House;
import Room.Room;
import Room.Light;
import Room.Window;
import User.User;
import Zone.Zone;
import Zone.Period;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;

import java.util.Arrays;

import static org.junit.jupiter.api.extension.ExtensionContext.Namespace.GLOBAL;

/**
 * Sets up data fixtures intended for the test classes, and starts and stops the javalin app.
 */
public class TestSetUp implements BeforeAllCallback, ExtensionContext.Store.CloseableResource {

    private static boolean started = false;
    private final SmartHomeSimulatorAPI app = new SmartHomeSimulatorAPI();

    public static String baseUrl = "http://localhost:7000";

    //static attributes for test data of agents, users, houses, rooms
    public static final ObjectId userOneId = new ObjectId();
    public static final User userOne = new User(userOneId, "userOne");

    public static final ObjectId houseOneId = new ObjectId();
    public static final House houseOne = new House(houseOneId, "houseOne", userOneId, false, true, 19.0, 23.0, "15/05", "15/09");

    public static final ObjectId zoneOneId = new ObjectId();
    public static final Period periodOne = new Period(new ObjectId(), "00:00", "12:59", 23.0);
    public static final Period periodTwo = new Period(new ObjectId(), "00:00", "12:59", 22.0);
    public static final Zone zoneOne = new Zone(zoneOneId, houseOneId, "Zone 1", Arrays.asList(periodOne, periodTwo));

    public static final ObjectId roomOneId = new ObjectId();
    public static final Light lightOne = new Light(new ObjectId(), "Light 1", false);
    public static final Light lightTwo = new Light(new ObjectId(), "Light 2", false);
    public static final Window windowOne = new Window(new ObjectId(), true, false);
    public static final Window windowTwo = new Window(new ObjectId(), true, false);
    public static final ObjectId doorOneId = new ObjectId();
    public static final Door doorOne = new Door(doorOneId, "roomOne", "roomTwo", true);
    public static final Room roomOne = new Room(roomOneId, houseOneId, zoneOneId, "roomOne", Arrays.asList(windowOne, windowTwo), Arrays.asList(lightOne, lightTwo), Arrays.asList(doorOneId), 23.0);

    public static final ObjectId agentOneId = new ObjectId();
    public static final Agent agentOne = new Agent(agentOneId, "agentOne", houseOneId, roomOneId, false, new AccessRights(false, false, false));


    /**
     * Runs once before any of the tests defined in the test classes, sets up the test fixture data and starts
     * the javalin app
     * @param context JUnit context
     */
    @Override
    public void beforeAll(ExtensionContext context) {
        if (!started) {
            started = true;

            //insert attributes into database
            this.app.start(7000, ".env.test");
            setUpTestData();

            context.getRoot().getStore(GLOBAL).put("any unique name", this);
        }
    }

    /**
     * Runs once after all the test cases, and stops the javalin app.
     */
    @Override
    public void close() {
        // Your "after all tests" logic goes here
        this.app.stop();
    }

    /**
     * Sets up data fixtures, by first clearing each collection and then inserting the test data.
     */
    public void setUpTestData() {
        MongoDatabase database = MongoDBConnection.getMongoDatabase();

        MongoCollection<Agent> agentCollection = database.getCollection("agents", Agent.class);
        MongoCollection<User> userCollection = database.getCollection("users", User.class);
        MongoCollection<House> houseCollection = database.getCollection("houses", House.class);
        MongoCollection<Room> roomCollection = database.getCollection("rooms", Room.class);
        MongoCollection<Door> doorCollection = database.getCollection("doors", Door.class);
        MongoCollection<Zone> zoneCollection = database.getCollection("zones", Zone.class);


        agentCollection.deleteMany(new Document());
        agentCollection.insertOne(agentOne);

        userCollection.deleteMany(new Document());
        userCollection.insertOne(userOne);

        houseCollection.deleteMany(new Document());
        houseCollection.insertOne(houseOne);

        zoneCollection.deleteMany(new Document());
        zoneCollection.insertOne(zoneOne);

        roomCollection.deleteMany(new Document());
        roomCollection.insertOne(roomOne);

        doorCollection.deleteMany(new Document());
        doorCollection.insertOne(doorOne);
    }
}
