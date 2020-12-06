package House;
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

import java.io.File;

import static SetUp.TestSetUp.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.mongodb.client.model.Filters.eq;

/**
 * This is the test class for the routes handled by HouseController
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@ExtendWith({TestSetUp.class})
@DisplayName("House Tests")
public class HouseControllerTest {

    MongoDatabase database = MongoDBConnection.getMongoDatabase();
    MongoCollection<House> houseCollection = database.getCollection("houses", House.class);

    /**
     * Test GET request to fetch all houses
     */
    @Test
    @Order(1)
    @DisplayName("Get all Houses")
    void GET_to_fetch_houses_returns_list_of_houses(){
        HttpResponse response = Unirest.get(baseUrl + "/houses").asString();
        assertEquals(response.getStatus(), 200);
        assertEquals(response.getBody(), "["+JavalinJson.toJson(houseOne)+"]");
    }

    /**
     * Test GET request to fetch one house by id
     */
    @Test
    @Order(2)
    @DisplayName("Get one House")
    void GET_to_fetch_one_house_returns_house(){
        HttpResponse response = Unirest.get(baseUrl + "/houses/" + houseOneId.toString()).asString();
        assertEquals(response.getStatus(), 200);
        assertEquals(response.getBody(), JavalinJson.toJson(houseOne));
    }

    /**
     * Test POST request to create one house
     */
    @Test
    @Order(3)
    @DisplayName("Create House")
    void POST_to_create_house_returns_new_house() {
        ObjectId houseTwoId = new ObjectId();
        House houseTwo = new House(houseTwoId, "houseTwo", userOneId, false, true, 19.0, 23.0);
        String houseTwoJson = JavalinJson.toJson(houseTwo);
        HttpResponse response = Unirest.post(baseUrl + "/houses")
                .body(houseTwoJson)
                .asString();

        House houseTwoResponse = JavalinJson.fromJson(response.getBody().toString(), House.class);
        assertEquals(response.getStatus(), 200);
        assertEquals(response.getBody(), houseTwoJson);
        assertEquals(houseTwoResponse, houseCollection.find(eq("_id", houseTwoId)).first());
    }

    /**
     * Test PATCH to update a house by id
     */
    @Test
    @Order(4)
    @DisplayName("Update House")
    void PATCH_to_update_house_returns_updated_house(){
        String houseOneUpdateJson = "{\n" +
                "    \"name\": \"batcave\"\n" +
                "}";
        House houseOneUpdate = JavalinJson.fromJson(houseOneUpdateJson, House.class);

        HttpResponse response = Unirest.patch(baseUrl + "/houses/" + houseOneId)
                .body(houseOneUpdateJson)
                .asString();
        House responseHouse = JavalinJson.fromJson(response.getBody().toString(), House.class);
        assertEquals(response.getStatus(), 200);
        assertEquals(responseHouse.getName(), houseOneUpdate.getName());
    }

    /**
     * Test DELETE request to delete a house by id
     */
    @Test
    @Order(5)
    @DisplayName("Delete House")
    void DELETE_to_remove_house_returns_removed_house(){
        House houseOne = houseCollection.find(eq("_id", houseOneId)).first();
        HttpResponse response = Unirest.delete(baseUrl + "/houses/" + houseOneId)
                .asString();
        assertEquals(response.getStatus(), 200);
        assertEquals(JavalinJson.fromJson(response.getBody().toString(), House.class), houseOne);
    }

    /**
     * Test POST request to upload a house layout file
     */
    @Test
    @Order(6)
    @DisplayName("Upload house layout file")
    void POST_to_upload_house_layout_file_returns_created_house() {

        HttpResponse response = Unirest.post(baseUrl + "/houses/uploadHouseLayout/" + userOneId.toString())
                .field("house_layout", new File("/home/matthew/Documents/repos/SOEN343-Project-Smart-Home-Simulator/sampleHouseLayout.txt"))
                .field("house_name", "TestHouseLayout")
                .asString();
        System.out.println(response.getBody());

        House testHouse = JavalinJson.fromJson(response.getBody().toString(), House.class);
        assertEquals(testHouse, houseCollection.find(eq("_id", testHouse.getId())).first());
        assertEquals(testHouse.getUser_id(), userOneId);
    }
}
