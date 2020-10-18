package App;

import Agent.AgentController;
import Data.MongoDBConnection;
import House.HouseController;
import Room.RoomController;
import User.UserController;
import io.javalin.Javalin;

import static io.javalin.apibuilder.ApiBuilder.crud;

public class SmartHomeSimulatorAPI {

    private Javalin app = Javalin.create();

    public void start(int port, String envFileName) {
        MongoDBConnection.setUpMongoDatabase(envFileName);

        this.app.routes(() -> crud("/users/:user-id", new UserController()));

        this.app.routes(() -> crud("/houses/:house-id", new HouseController()));
        this.app.post("/houses/uploadHouseLayout/:user-id",  HouseController::uploadHouseLayoutFile);

        this.app.routes(() -> crud("/rooms/:room-id", new RoomController()));

        this.app.routes(() -> crud("/agents/:agent-id", new AgentController()));

        this.app.start(port);
    }

    public void stop(){
        this.app.stop();
    }
}
