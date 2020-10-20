package Data;

import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;

import io.github.cdimascio.dotenv.Dotenv;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;

import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

/**
 * Responsible for setting up a connection to the Mongo database with the needed configuration
 */
public class MongoDBConnection {
    private static MongoDatabase database;

    /**
     * Initiates the Mongo connection and sets the database reference
     * @param envFileName the file name of the .env file containing the database name to use
     */
    public static void setUpMongoDatabase(String envFileName) {
        //Set up CodecRegistry for mongo to accept POJOs
        CodecRegistry pojoCodecRegistry = fromRegistries(MongoClientSettings.getDefaultCodecRegistry(),
                fromProviders(PojoCodecProvider.builder().automatic(true).build()));

        MongoClientSettings settings = MongoClientSettings.builder()
                .codecRegistry(pojoCodecRegistry)
                .build();

        //Set up mongodb connection and database
        MongoClient mongoClient = MongoClients.create(settings);

        //load the correct .env file
        Dotenv dotenv = Dotenv.configure()
                .filename(envFileName)
                .load();

        //connect to the database according to the .env file
        database = mongoClient.getDatabase(dotenv.get("DATABASE_NAME"));
    }

    /**
     * Gets the reference to the Mongo database
     * @return the Mongo database
     */
    public static MongoDatabase getMongoDatabase() {
        return database;
    }
}
