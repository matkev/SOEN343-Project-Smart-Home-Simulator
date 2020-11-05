package Clock;

import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

/**
 * <code>Clock</code> tracks the simulation time, by remembering its offset to the system time.
 * 
 * Implements Singleton Creational design pattern.
 */
public class Clock {
    
    
    //Setup Singleton
    /**
     * creates an object of Clock, the singleton
     */
    private static Clock instance = new Clock();

    /**
     * private constructor to prevent instantiation.
     * defaults a period of 1 real second per clock second.
     */
    private Clock(){
        this(1000);
    }
    /**
     * private constructor to prevent instantiation.
     * @param p period at which the clock should update 1 second, in real milliseconds.
     */
    private Clock(long p){
        period = p;
        updateTimer();
    }

    /**
     * returns the singleton instance. creates one if it doesn't exist.
     * @return Clock singleton instance
     */
    public static Clock getInstance(){
        if (instance == null){
            instance = new Clock();
        }
        return instance;
    }
    //Singleton done
    

    /**
     * <code>Timer</code> object to schedule <code>tick</code> at a fixed rate.
     */
    private Timer timer = new Timer();
    /**
     * <code>Date</code> object to hold the current system's time. Unix Epoch.
     */
    private Date date = new Date();
    /**
     * offset between the <code>Clock</code> time and the system time.
     */
    private long offset = 0;
    /**
     * interval between <code>Clock</code> updating.
     */
    private long period = 1000;
    /**
     * <code>Clock</code>'s speed relative to the system's.
     */
    private double speed = 1;
    /**
     * <code>Clock</code>'s previous speed value. Used to compensate speed during change in period.
     */
    private double prevSpeed = speed;

    /**
     * updates the <code>Clock</code>'s time.
     */
    private void tick(){
        //track system time and correct offset based on Clock speed.
        final Date prevDate = date;
        date = new Date();
        final long deltaTime = date.getTime() - prevDate.getTime();
        offset += deltaTime * (prevSpeed - 1);
        prevSpeed = speed;
    }

    /**
     * Updates the <code>timer</code>'s interval between <code>tick</code> to <code>Clock</code> advancing 1 second.
     */
    private void updateTimer(){
        //terminate previous scheduled task.
        timer.cancel();
        //start a new scheduled task.
        timer = new Timer();
        timer.scheduleAtFixedRate(new TimerTask(){
            @Override
            public void run() {
                tick();
            }
        }, 0, period);
    }

    /**
     * gets the current system time offset by the <code>Clock</code>'s <code>offset</code>.
     * @return <code>Date</code> of the <code>Clock</code>'s time.
     */
    public Date getClockTime(){
        return new Date(date.getTime() + offset);
    }
    /**
     * gets the current system time offset by the <code>Clock</code>'s <code>offset</code>.
     * @return long of the <code>Clock</code>'s time in Unix Epoch time.
     */
    public long getClockEpochTime(){
        return date.getTime() + offset;
    }

    /**
     * sets the <code>Clock</code>'s time. Internally calculates the offset between the given time and system time.
     * @param d <code>Date</code> of the target time.
     */
    public void setClockTime(Date d){
        System.out.println("SET CLOCK TO: " + d.toString()
                             + " | FROM : " + date.toString());
        offset = d.getTime() - date.getTime();
    }

    /**
     * Sets the period at which the clock will update 1 second. Also modifies the <code>speed</code>.
     * @param p long, period in milliseconds. 
     */
    public void setPeriod(long p){
        System.out.println("SET PERIOD: " + p);
        //only changes the period if it is different.
        if(period != p){
            //does not accept negative period.
            if(p<=0){
                throw new IllegalArgumentException("Clock's period cannot be 0 or below!");
            }
            //update the timer to the period.
            period = p;
            updateTimer();

            //sets the corresponding speed.
            final double sp = 1000.0/p;
            setSpeed(sp);
        }
    }

    /**
     * Sets the speed at which the clock will update 1 second. Also modifies the <code>period</code>.
     * @param sp double, number of clock seconds per real seconds.
     */
    public void setSpeed(double sp){
        //only changes the speed if it is sufficiently different.
        if (Math.abs(speed - sp) >= 0.01 || sp == 0){
            System.out.println("CLOCK SET SPEED: " + sp);
            speed = sp;

            //avoid division by 0.
            if (sp == 0){
                //pause the time
                tick();
                timer.cancel();
            }
            else{
                //sets the corresponding period.
                final long p = (long)(1000.0/sp);
                setPeriod(p);
            }
        }
    }

    /**
     * cancels the <code>Timer</code>'s scheduled task to prevent the clock from updating.
     */
    public void close(){
        timer.cancel();
    }
}
