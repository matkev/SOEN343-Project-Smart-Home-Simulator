import Agent.AgentController;
import Data.MongoDBConnection;
import House.HouseController;
import Room.RoomController;
import User.UserController;
import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import static io.javalin.apibuilder.ApiBuilder.crud;

public class Main {
    public static void main(String[] args) {

        MongoDBConnection.setUpMongoDatabase();
        MongoDatabase database = MongoDBConnection.getMongoDatabase();

        Javalin app = Javalin.create().start(7000);
        app.routes(() -> crud("/users/:user-id", new UserController()));

        app.routes(() -> crud("/houses/:house-id", new HouseController()));
        app.post("/houses/uploadHouseLayout/:user-id",  HouseController::uploadHouseLayoutFile);

        app.routes(() -> crud("/rooms/:room-id", new RoomController()));

        app.routes(() -> crud("/agents/:agent-id", new AgentController()));

           }
}