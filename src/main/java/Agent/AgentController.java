package Agent;

import com.google.gson.*;
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
import java.util.ArrayList;
import java.util.Set;
import java.util.function.Consumer;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

/**
 * Class containing the controllers (or handlers) for all '/agents' endpoints.
 */
public class AgentController implements CrudHandler {

    private MongoDatabase database= MongoDBConnection.getMongoDatabase();
    private MongoCollection<Agent> agentCollection = database.getCollection("agents", Agent.class);

    private static final Logger LOGGER = LoggerFactory.getLogger(AgentController.class);


    /**
     * Handler for fetching all Agents
     *
     * @param context http request/response object
     */
    public void getAll(@NotNull Context context) {
        LOGGER.info("Get all Agents");

        ArrayList<Bson> filters = new ArrayList<>();

        //iterate over fields of Agent class
        for (Field f : Agent.class.getDeclaredFields()) {
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

        FindIterable<Agent> agents;
        if(filters.size() > 0){
            //join query param filters with logical ANDs
            Bson filter = and(filters);

            //query database with filter
            agents = agentCollection.find(filter);
        } else {
            agents = agentCollection.find();
        }

        //construct arrayList out with query results and send as json response
        ArrayList<Agent> agentsList = new ArrayList<>();
        agents.forEach((Consumer<Agent>) agentsList::add);
        context.json(agentsList);
    }

    /**
     * Handler to fetch a Agent by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the Agent
     */
    public void getOne(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Get the Agent {}", resourceId);
        Agent agent = agentCollection.find(eq("_id", new ObjectId(resourceId))).first();
        System.out.println(agent);
        if (agent != null) {
            context.json(agent);
        }
    }

    /**
     * Handler for creating Agents
     *
     * @param context http request/response object
     */
    public void create(@NotNull Context context) {
        System.out.println(context.body());
        Agent agent = context.bodyAsClass(Agent.class);
        LOGGER.info("Create a new Agent {}", agent);
        agentCollection.insertOne(agent);
        context.json(agent);
    }

    /**
     * Handler to update a Agent by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the Agent
     */
    public void update(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Update the Agent {}", resourceId);
        Agent agentUpdate = context.bodyAsClass(Agent.class);
        JsonObject agentUpdateJson = new Gson().fromJson(context.body(), JsonObject.class);

        BasicDBObject carrier = new BasicDBObject();
        BasicDBObject set = new BasicDBObject("$set", carrier);
        if (agentUpdateJson.has("agentname")) {
            carrier.put("agentname", agentUpdate.getAgentname());
        }

        if (agentUpdateJson.has("house_id")) {
            carrier.put("house_id", agentUpdate.getHouse_id());
        }

        if (agentUpdateJson.has("room_id")) {
            carrier.put("room_id", agentUpdate.getRoom_id());
        }

        if (agentUpdateJson.has("isAway")) {
            carrier.put("isAway", agentUpdate.getIsAway());
        }

        if (agentUpdateJson.has("accessRights")) {
            carrier.put("accessRights", agentUpdate.getAccessRights());
        }

        LOGGER.info("With values: {}", agentUpdateJson);

        FindOneAndUpdateOptions returnDocAfterUpdate = new FindOneAndUpdateOptions()
                .returnDocument(ReturnDocument.AFTER);

        Agent agentUpdated = agentCollection.findOneAndUpdate(eq("_id", new ObjectId(resourceId)), set, returnDocAfterUpdate);
        System.out.println(agentUpdated);
        if (agentUpdated != null) {
            context.json(agentUpdated);
        }
    }

    /**
     * Handler for deleting a Agent by id
     *
     * @param context http request/response object
     * @param resourceId ObjectId of the Agent
     */
    public void delete(@NotNull Context context, @NotNull String resourceId) {
        LOGGER.info("Delete the Agent {}", resourceId);
        Agent agent = agentCollection.findOneAndDelete(eq("_id", new ObjectId(resourceId)));
        if(agent != null) {
            context.json(agent);
        } else {
            context.status(500);
        }
    }
}
