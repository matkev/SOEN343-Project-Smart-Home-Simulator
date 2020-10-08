package User;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.FindOneAndReplaceOptions;
import com.mongodb.client.model.ReturnDocument;
import io.javalin.apibuilder.CrudHandler;
import io.javalin.http.Context;
import Data.MongoDBConnection;
import com.mongodb.client.MongoDatabase;
import org.bson.types.ObjectId;
import org.jetbrains.annotations.NotNull;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.function.Consumer;

import static com.mongodb.client.model.Filters.eq;

/**
 * Class containing the controllers (or handlers) for all '/users' endpoints.
 */
public class UserController implements CrudHandler {

    private MongoDatabase database= MongoDBConnection.getMongoDatabase();
    private MongoCollection<User> userCollection = database.getCollection("users", User.class);

    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);


    /**
     * Handler for fetching all Users
     *
     * @param context http request/response object
     */
    public void getAll(@NotNull Context context) {
        LOGGER.info("Get all Users");
        ArrayList<User> userslist = new ArrayList<>();
        FindIterable<User> users = userCollection.find();
        users.forEach((Consumer<User>) userslist::add);
        System.out.println(userslist);
        context.json(userslist);
    }

    /**
     * Handler to fetch a User by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the User
     */
    public void getOne(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Get the User {}", resourceId);
        User user = userCollection.find(eq("_id", new ObjectId(resourceId))).first();
        System.out.println(user);
        if (user != null) {
            context.json(user);
        }
    }

    /**
     * Handler for creating Users
     *
     * @param context http request/response object
     */
    public void create(@NotNull Context context) {
        User user = context.bodyAsClass(User.class);
        LOGGER.info("Create a new User {}", user);
        userCollection.insertOne(user);
        context.json(user);
    }

    /**
     * Handler to update a User by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the User
     */
    public void update(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Update the User {}", resourceId);
        User user = context.bodyAsClass(User.class);
        LOGGER.info("With values: {}", user);

        FindOneAndReplaceOptions returnDocAfterReplace = new FindOneAndReplaceOptions()
                .returnDocument(ReturnDocument.AFTER);

        User userUpdated = userCollection.findOneAndReplace(eq("_id", new ObjectId(resourceId)), user, returnDocAfterReplace);
        System.out.println(userUpdated);
        if (userUpdated != null) {
            context.json(userUpdated);
        }
    }

    /**
     * Handler for deleting a User by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the User
     */
    public void delete(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Delete the User {}", resourceId);
        User user = userCollection.findOneAndDelete(eq("_id", new ObjectId(resourceId)));
        if(user != null) {
            context.json(user);
        } else {
            context.status(500);
        }
    }
}
