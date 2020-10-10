package Room;

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
 * Class containing the controllers (or handlers) for all '/rooms' endpoints.
 */
public class RoomController implements CrudHandler {

    private static MongoDatabase database= MongoDBConnection.getMongoDatabase();
    private static MongoCollection<Room> roomCollection = database.getCollection("rooms", Room.class);

    private static final Logger LOGGER = LoggerFactory.getLogger(RoomController.class);

    /**
     * Handler for fetching all Rooms
     *
     * @param context http request/response object
     */
    public void getAll(@NotNull Context context) {
        LOGGER.info("Get all Rooms");
        ArrayList<Room> roomslist = new ArrayList<>();
        FindIterable<Room> rooms = roomCollection.find();
        rooms.forEach((Consumer<Room>) roomslist::add);
        System.out.println(roomslist);
        context.json(roomslist);
    }

    /**
     * Handler to fetch a Room by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the Room
     */
    public void getOne(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Get the Room {}", resourceId);
        Room room = roomCollection.find(eq("_id", new ObjectId(resourceId))).first();
        System.out.println(room);
        if (room != null) {
            context.json(room);
        }
    }

    /**
     * Handler for creating Rooms
     *
     * @param context http request/response object
     */
    public void create(@NotNull Context context) {
        Room room = context.bodyAsClass(Room.class);
        LOGGER.info("Create a new Room {}", room);
        roomCollection.insertOne(room);
        context.json(room);
    }

    /**
     * Handler to update a Room by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the Room
     */
    public void update(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Update the Room {}", resourceId);
        Room room = context.bodyAsClass(Room.class);
        LOGGER.info("With values: {}", room);

        FindOneAndReplaceOptions returnDocAfterReplace = new FindOneAndReplaceOptions()
                .returnDocument(ReturnDocument.AFTER);

        Room roomUpdated = roomCollection.findOneAndReplace(eq("_id", new ObjectId(resourceId)), room, returnDocAfterReplace);
        System.out.println(roomUpdated);
        if (roomUpdated != null) {
            context.json(roomUpdated);
        }
    }

    /**
     * Handler for deleting a Room by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the Room
     */
    public void delete(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Delete the Room {}", resourceId);
        Room room = roomCollection.findOneAndDelete(eq("_id", new ObjectId(resourceId)));
        if(room != null) {
            context.json(room);
        } else {
            context.status(500);
        }
    }
}