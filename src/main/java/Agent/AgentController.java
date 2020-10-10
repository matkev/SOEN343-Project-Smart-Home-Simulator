package Agent;

import com.google.gson.Gson;
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
        ArrayList<Agent> agentslist = new ArrayList<>();
        FindIterable<Agent> agents = agentCollection.find();
        agents.forEach((Consumer<Agent>) agentslist::add);
        System.out.println(agentslist);
        context.json(agentslist);
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
        Agent agent = context.bodyAsClass(Agent.class);
        LOGGER.info("With values: {}", agent);

        FindOneAndReplaceOptions returnDocAfterReplace = new FindOneAndReplaceOptions()
                .returnDocument(ReturnDocument.AFTER);

        Agent agentUpdated = agentCollection.findOneAndReplace(eq("_id", new ObjectId(resourceId)), agent, returnDocAfterReplace);
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
