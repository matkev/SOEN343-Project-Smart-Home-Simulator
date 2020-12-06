package Room;
import Data.MongoDBConnection;
import Door.Door;
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
 * This is the test class for the routes handled by RoomController
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@ExtendWith({TestSetUp.class})
@DisplayName("Room Tests")
public class RoomControllerTest {

    MongoDatabase database = MongoDBConnection.getMongoDatabase();
    MongoCollection<Room> roomCollection = database.getCollection("rooms", Room.class);

    /**
     * Test GET request to fetch all rooms
     */
    @Test
    @Order(1)
    @DisplayName("Get all Rooms")
    void GET_to_fetch_rooms_returns_list_of_rooms(){
        HttpResponse response = Unirest.get(baseUrl + "/rooms").asString();
        assertEquals(response.getStatus(), 200);
        assertEquals(response.getBody(), "["+JavalinJson.toJson(roomOne)+"]");
    }

    /**
     * Test GET request to fetch one room by id
     */
    @Test
    @Order(2)
    @DisplayName("Get one Room")
    void GET_to_fetch_one_room_returns_room(){
        HttpResponse response = Unirest.get(baseUrl + "/rooms/" + roomOneId.toString()).asString();
        assertEquals(response.getStatus(), 200);
        assertEquals(response.getBody(), JavalinJson.toJson(roomOne));
    }

    /**
     * Test POST request to create one room
     */
    @Test
    @Order(3)
    @DisplayName("Create Room")
    void POST_to_create_room_returns_new_room(){
        ObjectId roomTwoId = new ObjectId();
        Light lightOne = new Light(new ObjectId(), "Light 1", false);
        Light lightTwo = new Light(new ObjectId(), "Light 2", false);
        Window windowOne = new Window(new ObjectId(), true, false);
        Window windowTwo = new Window(new ObjectId(), true, false);
        Room roomTwo = new Room(roomTwoId, houseOneId, zoneOneId, "roomOne", Arrays.asList(windowOne, windowTwo), Arrays.asList(lightOne, lightTwo), Arrays.asList(doorOneId), null);

        String roomTwoJson = JavalinJson.toJson(roomTwo);
        HttpResponse response = Unirest.post(baseUrl + "/rooms")
                .body(roomTwoJson)
                .asString();

        Room roomTwoResponse = JavalinJson.fromJson(response.getBody().toString(), Room.class);
        assertEquals(response.getStatus(), 200);
        assertEquals(response.getBody(), roomTwoJson);
        assertEquals(roomTwoResponse, roomCollection.find(eq("_id", roomTwoId)).first());
    }

    /**
     * Test PATCH to update an room by id
     */
    @Test
    @Order(4)
    @DisplayName("Update Room")
    void PATCH_to_update_room_returns_updated_room(){
        String roomOneUpdateJson = "{\n" +
                "    \"name\": \"Bathroom\"\n" +
                "}";
        Room roomOneUpdate = JavalinJson.fromJson(roomOneUpdateJson, Room.class);

        HttpResponse response = Unirest.patch(baseUrl + "/rooms/" + roomOneId)
                .body(roomOneUpdateJson)
                .asString();
        Room responseRoom = JavalinJson.fromJson(response.getBody().toString(), Room.class);
        assertEquals(response.getStatus(), 200);
        assertEquals(responseRoom.getName(), roomOneUpdate.getName());
    }

    /**
     * Test DELETE request to delete an room by id
     */
    @Test
    @Order(5)
    @DisplayName("Delete Room")
    void DELETE_to_remove_room_returns_removed_room(){
        Room roomOne = roomCollection.find(eq("_id", roomOneId)).first();
        HttpResponse response = Unirest.delete(baseUrl + "/rooms/" + roomOneId)
                .asString();
        assertEquals(response.getStatus(), 200);
        assertEquals(JavalinJson.fromJson(response.getBody().toString(), Room.class), roomOne);
    }
}
