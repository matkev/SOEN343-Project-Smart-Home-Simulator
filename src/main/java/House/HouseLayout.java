package House;

import java.util.Arrays;

/**
 * Class modeling the HouseLayout entity. This class is used to parse out the JSON contents of a
 * house layout file.
 */
public class HouseLayout {
    private RoomLayout[] roomLayouts;

    /**
     * Default HouseLayout constructor
     */
    public HouseLayout() {
    }

    /**
     * Construct a new HouseLayout instance
     *
     * @param roomLayouts array of RoomLayout objects
     */
    public HouseLayout(RoomLayout[] roomLayouts) {
        this.roomLayouts = roomLayouts;
    }

    /**
     * Returns array of RoomLayout objects
     *
     * @return array of RoomLayout objects
     */
    public RoomLayout[] getRoomLayouts() {
        return roomLayouts;
    }

    /**
     * Sets the array of RoomLayout objects
     *
     * @param roomLayouts array of RoomLayout objects
     */
    public void setRoomLayouts(RoomLayout[] roomLayouts) {
        this.roomLayouts = roomLayouts;
    }

    /**
     * Returns a string representation of a HouseLayout object
     *
     * @return string representation of a HouseLayout object
     */
    @Override
    public String toString() {
        return "HouseLayout{" +
                "roomLayouts=" + Arrays.toString(roomLayouts) +
                '}';
    }

    /**
     * Inner class modeling the RoomLayout entity. This class is used to parse out the JSON contents of a
     * house layout file, for each room.
     */
    public class RoomLayout {

        private String name;
        private int windows;
        private int lights;
        private String[] doorsTo;

        /**
         * Default RoomLayout constructor
         */
        public RoomLayout() {
        }

        /**
         * Constructs a new RoomLayout instance
         *
         * @param name the name
         * @param windows the number of windows
         * @param lights the number of lights
         * @param doorsTo the array of the names of other RoomLayouts linked to this one
         */
        public RoomLayout(String name, int windows, int lights, String[] doorsTo) {
            this.name = name;
            this.windows = windows;
            this.lights = lights;
            this.doorsTo = doorsTo;
        }

        /**
         * Returns the name
         *
         * @return the name
         */
        public String getName() {
            return name;
        }

        /**
         * Sets the name
         *
         * @param name the name
         */
        public void setName(String name) {
            this.name = name;
        }

        /**
         * Returns the number of windows
         *
         * @return the number of windows
         */
        public int getWindows() {
            return windows;
        }

        /**
         * Sets the number of windows
         *
         * @param windows the number of windows
         */
        public void setWindows(int windows) {
            this.windows = windows;
        }

        /**
         * Returns the number of lights
         *
         * @return the number of lights
         */
        public int getLights() {
            return lights;
        }

        /**
         * Sets the number of lights
         *
         * @param lights the number of lights
         */
        public void setLights(int lights) {
            this.lights = lights;
        }

        /**
         * Returns the array of the names of other RoomLayouts linked to this one
         *
         * @return the array of the names of other RoomLayouts linked to this one
         */
        public String[] getDoorsTo() {
            return doorsTo;
        }

        /**
         * Sets the array of the names of other RoomLayouts linked to this one
         *
         * @param doorsTo the array of the names of other RoomLayouts linked to this one
         */
        public void setDoorsTo(String[] doorsTo) {
            this.doorsTo = doorsTo;
        }

        /**
         * Returns a string representation of a RoomLayout object
         *
         * @return string representation of a RoomLayout object
         */
        @Override
        public String toString() {
            return "RoomLayout{" +
                    "name='" + name + '\'' +
                    ", windows=" + windows +
                    ", lights=" + lights +
                    ", doorsTo=" + Arrays.toString(doorsTo) +
                    '}';
        }
    }
}
