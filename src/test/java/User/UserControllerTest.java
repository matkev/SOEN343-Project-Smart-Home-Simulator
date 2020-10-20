package User;
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
@DisplayName("User Tests")
public class UserControllerTest {

    MongoDatabase database = MongoDBConnection.getMongoDatabase();
    MongoCollection<User> userCollection = database.getCollection("users", User.class);

    @Test
    @Order(1)
    @DisplayName("Get all Users")
    void GET_to_fetch_users_returns_list_of_users(){
        HttpResponse response = Unirest.get(baseUrl + "/users").asString();
        assertEquals(response.getStatus(), 200);
        assertEquals(response.getBody(), "["+JavalinJson.toJson(userOne)+"]");
    }

    @Test
    @Order(2)
    @DisplayName("Get one User")
    void GET_to_fetch_one_user_returns_user(){
        HttpResponse response = Unirest.get(baseUrl + "/users/" + userOneId.toString()).asString();
        assertEquals(response.getStatus(), 200);
        assertEquals(response.getBody(), JavalinJson.toJson(userOne));
    }

    @Test
    @Order(3)
    @DisplayName("Create User")
    void POST_to_create_user_returns_new_user(){
        ObjectId userTwoId = new ObjectId();
        User userTwo = new User(userTwoId, "userTwo");
        String userTwoJson = JavalinJson.toJson(userTwo);
        HttpResponse response = Unirest.post(baseUrl + "/users")
                .body(userTwoJson)
                .asString();

        User userTwoResponse = JavalinJson.fromJson(response.getBody().toString(), User.class);
        assertEquals(response.getStatus(), 200);
        assertEquals(response.getBody(), userTwoJson);
        assertEquals(userTwoResponse, userCollection.find(eq("_id", userTwoId)).first());

    }

    @Test
    @Order(4)
    @DisplayName("Update User")
    void PATCH_to_update_user_returns_updated_user(){
        String userOneUpdateJson = "{\n" +
                "    \"username\": \"newUser\"\n" +
                "}";
        User userOneUpdate = JavalinJson.fromJson(userOneUpdateJson, User.class);

        HttpResponse response = Unirest.patch(baseUrl + "/users/" + userOneId)
                .body(userOneUpdateJson)
                .asString();
        User responseUser = JavalinJson.fromJson(response.getBody().toString(), User.class);
        assertEquals(response.getStatus(), 200);
        assertEquals(responseUser.getUsername(), userOneUpdate.getUsername());
    }

    @Test
    @Order(5)
    @DisplayName("Delete User")
    void DELETE_to_remove_user_returns_removed_user(){
        User userOne = userCollection.find(eq("_id", userOneId)).first();
        HttpResponse response = Unirest.delete(baseUrl + "/users/" + userOneId)
                .asString();
        assertEquals(response.getStatus(), 200);
        assertEquals(JavalinJson.fromJson(response.getBody().toString(), User.class), userOne);
    }
}
