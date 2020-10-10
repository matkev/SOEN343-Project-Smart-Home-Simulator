package User;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.FindOneAndReplaceOptions;
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

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.function.Consumer;

import static com.mongodb.client.model.Filters.and;
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

        ArrayList<Bson> filters = new ArrayList<>();

        //iterate over fields of User class
        for (Field f : User.class.getDeclaredFields()) {
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

        //join query param filters with logical ANDs
        Bson filter = and(filters);

        //query database with filter
        FindIterable<User> users = userCollection.find(filter);

        //construct arrayList out with query results and send as json response
        ArrayList<User> usersList = new ArrayList<>();
        users.forEach((Consumer<User>) usersList::add);
        context.json(usersList);
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
