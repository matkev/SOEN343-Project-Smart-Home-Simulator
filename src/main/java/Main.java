import App.SmartHomeSimulatorAPI;

public class Main {
    public static void main(String[] args) {
        SmartHomeSimulatorAPI app = new SmartHomeSimulatorAPI();
        app.start(7000, ".env.dev");

    }
}