package Agent;
import Data.MongoDBConnection;
import SetUp.TestSetUp;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import io.javalin.plugin.json.JavalinJson;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;

import static SetUp.TestSetUp.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.mongodb.client.model.Filters.eq;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@ExtendWith({TestSetUp.class})
@DisplayName("Agent Tests")
public class AgentControllerTest {

    MongoDatabase database = MongoDBConnection.getMongoDatabase();
    MongoCollection<Agent> agentCollection = database.getCollection("agents", Agent.class);

    @Test
    @Order(1)
    @DisplayName("Get all Agents")
    void GET_to_fetch_agents_returns_list_of_agents(){
        HttpResponse response = Unirest.get(baseUrl + "/agents").asString();
        assertEquals(response.getStatus(), 200);
        assertEquals(response.getBody(), "["+JavalinJson.toJson(agentOne)+"]");
    }

    @Test
    @Order(2)
    @DisplayName("Get one Agent")
    void GET_to_fetch_one_agent_returns_agent(){
        HttpResponse response = Unirest.get(baseUrl + "/agents/" + agentOneId.toString()).asString();
        assertEquals(response.getStatus(), 200);
        assertEquals(response.getBody(), JavalinJson.toJson(agentOne));
    }

    @Test
    @Order(3)
    @DisplayName("Create Agent")
    void POST_to_create_agent_returns_new_agent(){
        ObjectId agentTwoId = new ObjectId();
        Agent agentTwo = new Agent(agentTwoId, "agentTwo", houseOneId, roomOneId, false, new Agent.AccessRights(false, false, false));
        String agentTwoJson = JavalinJson.toJson(agentTwo);
        HttpResponse response = Unirest.post(baseUrl + "/agents")
                .body(agentTwoJson)
                .asString();

        Agent agentTwoResponse = JavalinJson.fromJson(response.getBody().toString(), Agent.class);
        assertEquals(response.getStatus(), 200);
        assertEquals(response.getBody(), agentTwoJson);
        assertEquals(agentTwoResponse, agentCollection.find(eq("_id", agentTwoId)).first());

    }

    @Test
    @Order(4)
    @DisplayName("Update Agent")
    void PATCH_to_update_agent_returns_updated_agent(){
        String agentOneUpdateJson = "{\n" +
                "    \"agentname\": \"fakeGuest\",\n" +
                "    \"isAway\": \"false\",\n" +
                "    \"accessRights\": {\n" +
                "        \"shcRights\": \"true\",\n" +
                "        \"shpRights\": \"false\",\n" +
                "        \"shhRights\": \"true\"\n" +
                "    }\n" +
                "}";
        Agent agentOneUpdate = JavalinJson.fromJson(agentOneUpdateJson, Agent.class);

        HttpResponse response = Unirest.patch(baseUrl + "/agents/" + agentOneId)
                .body(agentOneUpdateJson)
                .asString();
        Agent responseAgent = JavalinJson.fromJson(response.getBody().toString(), Agent.class);
        assertEquals(response.getStatus(), 200);
        assertEquals(responseAgent.getAgentname(), agentOneUpdate.getAgentname());
        assertEquals(responseAgent.getIsAway(), agentOneUpdate.getIsAway());
        assertEquals(responseAgent.getAccessRights(), agentOneUpdate.getAccessRights());
    }

    @Test
    @Order(5)
    @DisplayName("Delete Agent")
    void DELETE_to_remove_agent_returns_removed_agent(){
        Agent agentOne = agentCollection.find(eq("_id", agentOneId)).first();
        HttpResponse response = Unirest.delete(baseUrl + "/agents/" + agentOneId)
                .asString();
        assertEquals(response.getStatus(), 200);
        assertEquals(JavalinJson.fromJson(response.getBody().toString(), Agent.class), agentOne);
    }
}
