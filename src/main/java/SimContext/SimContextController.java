package SimContext;

import Data.MongoDBConnection;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import com.mongodb.client.model.ReturnDocument;
import io.javalin.apibuilder.CrudHandler;
import io.javalin.http.Context;
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
 * Class containing the controllers (or handlers) for all '/simContexts' endpoints.
 */
public class SimContextController implements CrudHandler {

    private static final MongoDatabase database= MongoDBConnection.getMongoDatabase();
    private static final MongoCollection<SimContext> simContextCollection = database.getCollection("simContext", SimContext.class);

    private static final Logger LOGGER = LoggerFactory.getLogger(SimContextController.class);


    /**
     * Handler for fetching all SimContext
     *
     * @param context http request/response object
     */
    public void getAll(@NotNull Context context) {
        LOGGER.info("Get all SimContext");

        ArrayList<Bson> filters = new ArrayList<>();

        //iterate over fields of SimContext class
        for (Field f : SimContext.class.getDeclaredFields()) {
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
        FindIterable<SimContext> simContext;
        if(filters.size() > 0){
            //join query param filters with logical ANDs
            Bson filter = and(filters);

            //query database with filter
            simContext = simContextCollection.find(filter);
        } else {
            simContext = simContextCollection.find();
        }

        //construct arrayList out with query results and send as json response
        ArrayList<SimContext> simContextsList = new ArrayList<>();
        simContext.forEach((Consumer<SimContext>) simContextsList::add);
        context.json(simContextsList);
    }

    /**
     * Handler to fetch a SimContext by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the SimContext
     */
    public void getOne(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Get the SimContext {}", resourceId);
        SimContext simContext = simContextCollection.find(eq("_id", new ObjectId(resourceId))).first();
        System.out.println(simContext);
        if (simContext != null) {
            context.json(simContext);
        }
    }

    /**
     * Handler for creating SimContexts
     *
     * @param context http request/response object
     */
    public void create(@NotNull Context context) {
        SimContext simContext = context.bodyAsClass(SimContext.class);
        LOGGER.info("Create a new SimContext {}", simContext);
        simContextCollection.insertOne(simContext);
        context.json(simContext);
    }

    /**
     * Handler to update a SimContext by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the SimContext
     */
    public void update(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Update the SimContext {}", resourceId);
        SimContext simContextUpdate = context.bodyAsClass(SimContext.class);
        JsonObject simContextUpdateJson = new Gson().fromJson(context.body(), JsonObject.class);

        BasicDBObject carrier = new BasicDBObject();
        BasicDBObject set = new BasicDBObject("$set", carrier);
        if (simContextUpdateJson.has("lastDate")) {
            carrier.put("lastDate", simContextUpdate.getLastDate());
        }

        LOGGER.info("With values: {}", simContextUpdateJson);

        FindOneAndUpdateOptions returnDocAfterUpdate = new FindOneAndUpdateOptions()
                .returnDocument(ReturnDocument.AFTER);

        SimContext simContextUpdated = simContextCollection.findOneAndUpdate(eq("_id", new ObjectId(resourceId)), set, returnDocAfterUpdate);
        System.out.println(simContextUpdated);
        if (simContextUpdated != null) {
            context.json(simContextUpdated);
        }
    }

    /**
     * Handler for deleting a SimContext by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the SimContext
     */
    public void delete(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Delete the SimContext {}", resourceId);
        SimContext simContext = simContextCollection.findOneAndDelete(eq("_id", new ObjectId(resourceId)));
        if(simContext != null) {
            context.json(simContext);
        } else {
            context.status(500);
        }
    }
}
