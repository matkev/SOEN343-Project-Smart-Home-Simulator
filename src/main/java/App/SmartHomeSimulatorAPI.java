package App;

import Agent.AgentController;
import Data.MongoDBConnection;
import Door.DoorController;
import House.HouseController;
import Room.RoomController;
import SimContext.SimContextController;
import User.UserController;
import Zone.ZoneController;
import io.javalin.Javalin;
import io.javalin.core.JavalinConfig;

import static io.javalin.apibuilder.ApiBuilder.crud;

import java.util.function.Consumer;

/**
 * This is the class responsible for starting and stopping the javalin app
 */
public class SmartHomeSimulatorAPI {

    private final Javalin app = Javalin.create(new Consumer<JavalinConfig>() {

        public void accept(JavalinConfig t) {
            t.enableCorsForAllOrigins();
        }
    });

    /**
     * Starts the javalin app
     *
     * @param port        the port number the app will run on
     * @param envFileName the file name of the .env file containing config info
     */
    public void start(int port, String envFileName) {
        MongoDBConnection.setUpMongoDatabase(envFileName);

        this.app.routes(() -> crud("/users/:user-id", new UserController()));

        this.app.routes(() -> crud("/houses/:house-id", new HouseController()));
        this.app.post("/houses/uploadHouseLayout/:user-id", HouseController::uploadHouseLayoutFile);

        this.app.routes(() -> crud("/rooms/:room-id", new RoomController()));
        this.app.get("/rooms/getDoors/:room-id", RoomController::getDoors);

        this.app.routes(() -> crud("/doors/:door-id", new DoorController()));

        this.app.routes(() -> crud("/agents/:agent-id", new AgentController()));

        this.app.routes(() -> crud("/simContexts/:simContext-id", new SimContextController()));

        this.app.routes(() -> crud("/zones/:zone-id", new ZoneController()));

        this.app.start(port);
    }

    /**
     * stop the javalin app
     */
    public void stop() {
        this.app.stop();
    }
}
