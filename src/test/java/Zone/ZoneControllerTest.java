package Zone;

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

import java.util.Arrays;

import static SetUp.TestSetUp.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.mongodb.client.model.Filters.eq;

/**
 * This is the test class for the routes handled by ZoneController
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@ExtendWith({TestSetUp.class})
@DisplayName("Zone Tests")
public class ZoneControllerTest {

    MongoDatabase database = MongoDBConnection.getMongoDatabase();
    MongoCollection<Zone> zoneCollection = database.getCollection("zones", Zone.class);

    /**
     * Test GET request to fetch all zones
     */
    @Test
    @Order(1)
    @DisplayName("Get all Zones")
    void GET_to_fetch_zones_returns_list_of_zones(){
        HttpResponse response = Unirest.get(baseUrl + "/zones").asString();
        assertEquals(response.getStatus(), 200);
        assertEquals(response.getBody(), "["+JavalinJson.toJson(zoneOne)+"]");
    }

    /**
     * Test GET request to fetch one zone by id
     */
    @Test
    @Order(2)
    @DisplayName("Get one Zone")
    void GET_to_fetch_one_zone_returns_zone(){
        HttpResponse response = Unirest.get(baseUrl + "/zones/" + zoneOneId.toString()).asString();
        assertEquals(response.getStatus(), 200);
        assertEquals(response.getBody(), JavalinJson.toJson(zoneOne));
    }

    /**
     * Test POST request to create one zone
     */
    @Test
    @Order(3)
    @DisplayName("Create Zone")
    void POST_to_create_zone_returns_new_zone(){
        ObjectId zoneTwoId = new ObjectId();
        Period periodOne = new Period(new ObjectId(), "00:00", "12:59", 23.0);
        Period periodTwo = new Period(new ObjectId(), "00:00", "12:59", 22.0);
        Zone zoneTwo = new Zone(zoneTwoId, houseOneId, "zoneOne", Arrays.asList(periodOne, periodTwo));

        String zoneTwoJson = JavalinJson.toJson(zoneTwo);
        HttpResponse response = Unirest.post(baseUrl + "/zones")
                .body(zoneTwoJson)
                .asString();

        Zone zoneTwoResponse = JavalinJson.fromJson(response.getBody().toString(), Zone.class);
        assertEquals(response.getStatus(), 200);
        assertEquals(response.getBody(), zoneTwoJson);
        assertEquals(zoneTwoResponse, zoneCollection.find(eq("_id", zoneTwoId)).first());
    }

    /**
     * Test PATCH to update an zone by id
     */
    @Test
    @Order(4)
    @DisplayName("Update Zone")
    void PATCH_to_update_zone_returns_updated_zone(){
        String zoneOneUpdateJson = "{\n" +
                "    \"name\": \"Party Zone\"\n" +
                "}";
        Zone zoneOneUpdate = JavalinJson.fromJson(zoneOneUpdateJson, Zone.class);

        HttpResponse response = Unirest.patch(baseUrl + "/zones/" + zoneOneId)
                .body(zoneOneUpdateJson)
                .asString();
        Zone responseZone = JavalinJson.fromJson(response.getBody().toString(), Zone.class);
        assertEquals(response.getStatus(), 200);
        assertEquals(responseZone.getName(), zoneOneUpdate.getName());
    }

    /**
     * Test DELETE request to delete an zone by id
     */
    @Test
    @Order(5)
    @DisplayName("Delete Zone")
    void DELETE_to_remove_zone_returns_removed_zone(){
        Zone zoneOne = zoneCollection.find(eq("_id", zoneOneId)).first();
        HttpResponse response = Unirest.delete(baseUrl + "/zones/" + zoneOneId)
                .asString();
        assertEquals(response.getStatus(), 200);
        assertEquals(JavalinJson.fromJson(response.getBody().toString(), Zone.class), zoneOne);
    }
}
