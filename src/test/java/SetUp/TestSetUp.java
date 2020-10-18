package SetUp;
import Agent.Agent;
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

import java.util.Arrays;

import static org.junit.jupiter.api.extension.ExtensionContext.Namespace.GLOBAL;

public class TestSetUp implements BeforeAllCallback, ExtensionContext.Store.CloseableResource {

    private static boolean started = false;
    private SmartHomeSimulatorAPI app = new SmartHomeSimulatorAPI();

    public static String baseUrl = "http://localhost:7000";

    //static attributes for test data of agents, users, houses, rooms
    public static final ObjectId userOneId = new ObjectId();
    public static final User userOne = new User(userOneId, "userOne");

    public static final ObjectId houseOneId = new ObjectId();
    public static final House houseOne = new House(houseOneId, "houseOne", userOneId);

    public static final ObjectId roomOneId = new ObjectId();
    public static final Room roomOne = new Room(roomOneId, houseOneId, "roomOne", 2, 2, Arrays.asList("roomTwo", "roomThree"));

    public static final ObjectId agentOneId = new ObjectId();
    public static final Agent agentOne = new Agent(agentOneId, "agentOne", houseOneId, roomOneId, false, new Agent.AccessRights(false, false, false));


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

    @Override
    public void close() {
        // Your "after all tests" logic goes here
        this.app.stop();
    }

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
