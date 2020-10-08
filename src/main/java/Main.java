import Data.MongoDBConnection;
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
    }
}