package Zone;

import Room.Room;
import Room.Window;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.FindOneAndUpdateOptions;
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
import java.util.*;
import java.util.function.Consumer;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.or;
import static com.mongodb.client.model.Filters.eq;

/**
 * Class containing the controllers (or handlers) for all '/zones' endpoints.
 */
public class ZoneController implements CrudHandler {

    private static final MongoDatabase database = MongoDBConnection.getMongoDatabase();
    private static final MongoCollection<Zone> zoneCollection = database.getCollection("zones", Zone.class);

    private static final Logger LOGGER = LoggerFactory.getLogger(ZoneController.class);

    /**
     * Handler for fetching all Zones
     *
     * @param context http request/response object
     */
    public void getAll(@NotNull Context context) {
        LOGGER.info("Get all Zones");

        ArrayList<Bson> filters = new ArrayList<>();

        //iterate over fields of Zone class
        for (Field f : Zone.class.getDeclaredFields()) {
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

        FindIterable<Zone> zones;
        if (filters.size() > 0) {
            //join query param filters with logical ANDs
            Bson filter = and(filters);

            //query database with filter
            zones = zoneCollection.find(filter);
        } else {
            zones = zoneCollection.find();
        }

        //construct arrayList out with query results and send as json response
        ArrayList<Zone> zonesList = new ArrayList<>();
        zones.forEach((Consumer<Zone>) zonesList::add);
        context.json(zonesList);
    }

    /**
     * Handler to fetch a Zone by id
     *
     * @param context    http request/response object
     * @param resourceId ObjectId of the Zone
     */
    public void getOne(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Get the Zone {}", resourceId);
        Zone zone = zoneCollection.find(eq("_id", new ObjectId(resourceId))).first();
        System.out.println(zone);
        if (zone != null) {
            context.json(zone);
        }
    }

    /**
     * Handler for creating Zones
     *
     * @param context http request/response object
     */
    public void create(@NotNull Context context) {
        Zone zone = context.bodyAsClass(Zone.class);
        LOGGER.info("Create a new Zone {}", zone);
        zoneCollection.insertOne(zone);
        context.json(zone);
    }

    /**
     * Handler to update a Zone by id
     *
     * @param context    http request/response object
     * @param resourceId ObjectId of the Zone
     */
    public void update(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Update the Zone {}", resourceId);
        Zone zoneUpdate = context.bodyAsClass(Zone.class);
        JsonObject zoneUpdateJson = new Gson().fromJson(context.body(), JsonObject.class);

        BasicDBObject carrier = new BasicDBObject();
        BasicDBObject set = new BasicDBObject("$set", carrier);
        if (zoneUpdateJson.has("house_id")) {
            carrier.put("house_id", zoneUpdate.getHouse_id());
        }

        if (zoneUpdateJson.has("name")) {
            carrier.put("name", zoneUpdate.getName());
        }

        if (zoneUpdateJson.has("periods")) {
//            List<Period> list = updatePeriods(zoneUpdate, new ObjectId(resourceId));

            carrier.put("periods", zoneUpdate.getPeriods());
        }

        LOGGER.info("With values: {}", zoneUpdateJson);

        FindOneAndUpdateOptions returnDocAfterUpdate = new FindOneAndUpdateOptions()
                .returnDocument(ReturnDocument.AFTER);

        Zone zoneUpdated = zoneCollection.findOneAndUpdate(eq("_id", new ObjectId(resourceId)), set, returnDocAfterUpdate);
        System.out.println(zoneUpdated);
        if (zoneUpdated != null) {
            context.json(zoneUpdated);
        }
    }

    /**
     * Handler for deleting a Zone by id
     *
     * @param context    http request/response object
     * @param resourceId ObjectId of the Zone
     */
    public void delete(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Delete the Zone {}", resourceId);
        Zone zone = zoneCollection.findOneAndDelete(eq("_id", new ObjectId(resourceId)));
        if (zone != null) {
            context.json(zone);
        } else {
            context.status(500);
        }
    }
}