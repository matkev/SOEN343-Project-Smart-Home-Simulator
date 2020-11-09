import App.SmartHomeSimulatorAPI;

/**
 * This is the driver class of the API
 */
public class Main {
    /**
     * Creates an instance of and starts the javalin app with a specified
     * port number and .env file
     *
     * @param args args
     */
    public static void main(String[] args) {
        SmartHomeSimulatorAPI app = new SmartHomeSimulatorAPI();
        app.start(7000, ".env.dev");

    }
}