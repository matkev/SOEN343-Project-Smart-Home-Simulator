package SetUp;
import Agent.Agent;
import Agent.AccessRights;
import App.SmartHomeSimulatorAPI;
import Data.MongoDBConnection;
import House.House;
import Room.Room;
import User.User;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;

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
    public static final House houseOne = new House(houseOneId, "houseOne", userOneId, false);

    public static final ObjectId roomOneId = new ObjectId();
    public static final Room roomOne = null; //new Room(roomOneId, houseOneId, "roomOne", 2, Arrays.asList(new Room.Light(new ObjectId(), "Light 1", false)), Arrays.asList("roomTwo", "roomThree"));

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

        agentCollection.deleteMany(new Document());
        agentCollection.insertOne(agentOne);

        userCollection.deleteMany(new Document());
        userCollection.insertOne(userOne);

        houseCollection.deleteMany(new Document());
        houseCollection.insertOne(houseOne);

        roomCollection.deleteMany(new Document());
        roomCollection.insertOne(roomOne);
    }
}
