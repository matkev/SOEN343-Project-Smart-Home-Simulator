import React, {useEffect, useState, useRef} from 'react';
import useStyle from '../styles'
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { MuiPickersUtilsProvider, DateTimePicker} from "@material-ui/pickers";
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import DateFnsUtils from '@date-io/date-fns';
import {createNewSimContext, getSimContextList, patchSimContext} from "../../../Api/api_simContexts";
import {toast} from "react-toastify";
//code is based on example provided in
//https://reactjs.org/docs/state-and-lifecycle.html

//and uses
//https://material-ui-pickers.dev/demo/datetime-picker
//https://material-ui.com/components/slider/

//tick update's interval
let intervalID = null;
//previous speed value
let previousSpeed = 1;

//Clock will give the current time of the simulation.
// -props.simContext is the simContext used to initialize the clock
// -props.speed overwrites the clock's speed.
// -props.onSpeedChange(speed) is returned the clock's speed when it updates. 
const Clock = (props) => {
    //date to track real-time.
    const [date, setDate] = useState(new Date());
    //time offset in milliseconds.
    const [timeOffset, setTimeOffset] = useState(0);
    //speed of simulation
    const [speed, setSpeed] = useState(0);
    //period interval (milliseconds) to update clock display
    const [period, setPeriod] = useState(1000);

    let displaySpeed = speed;

    //reference to date for usage in callback.
    const dateRef = useRef();

    const newSimContextRef = useRef({newDate: date});
    //track values to pass to database while in callback.
    useEffect(() => {
        newSimContextRef.current.newDate = getSimDate();
    }, [date, timeOffset]);   //updates on date or timeOffset change.

    //reference to timeOffset for usage in callback.
    const timeOffsetRef = useRef();

    //track value of date while in callback.
    useEffect(() => {
        dateRef.current = date;
    }, [date]);   //updates on date change.

    //track value of timeOffset while in callback.
    useEffect(() => {
        timeOffsetRef.current = timeOffset;
    }, [timeOffset]);   //updates on timeOffset change.

    //updates clock speed if the passed speed changes.
    useEffect(() => {
        //if props speed exists
        if (typeof props.speed !== "undefined") {
            setupClockSpeedTimerPeriod(props.speed);
        }
    }, [props.speed]); //runs when props.speed updates.
    
    //callback about clock speed change
    useEffect(() => {
        let a = props.onSpeedChange?.(speed);
    }, [speed]); //runs when speed updates.

    //Initialization and Cleanup.
    useEffect(() => {
        //scoped async function so that the return is not a promise.
        async function getSimContextAndLoad(){ 
            //If passed a simContext, use it.
            //Otherwise, recover saved simContext from database.
            const simContext = props.simContext ?? await getLastSavedSimContext();
            //load the simContext data into clock.
            loadSimContext(simContext);
        }
        //executes when the DOM renders the Clock the first time.

        //load the appropriate simContext.
        getSimContextAndLoad();

        //initialize previousSpeed to current speed.
        previousSpeed = speed;

        //executes when the DOM removes the Clock.
        return function cleanup(){
            //tears down interval/timer
            clearInterval(intervalID);
            //stores new simContext into db.
            updateDB(newSimContextRef.current);
        }
    }, []); //only run on mount and unmount.
    
    //update timer interval when period changes.
    useEffect(() => {
        //clears previous timer interval
        clearInterval(intervalID);
        //only set new timer if period is strictly positive.
        if ( period > 0 ){
            //setups new timer interval
            intervalID = setInterval(tick, period);
        }
    }, [period]); //runs when period updates.
    
    //immediately tick the clock when speed changes.
    useEffect(() => {
        tick();
        displaySpeed = speed;
    }, [speed]); //runs when speed updates.

    // arranges the speed of the clock and the period of the timer. 
    const setupClockSpeedTimerPeriod = (sp) =>{
        //change the Timer if the new speed is sufficiently different or zero.
        if ( Math.abs(sp - speed) > 0.001 || sp === 0 ){
            //set the speed.
            setSpeed(sp);
            //avoid division by 0.
            if (sp === 0){
                //pause the timer
                setPeriod(-1);
            }
            else{
                //set the period of the timer to match the speed.
                setPeriod(1000/sp);
            }
        }

    };

    //update time when called.
    const tick = () => {
        const prevDate = dateRef.current;
        const newDate = new Date();
        //update date.
        setDate(newDate);

        //calculates and sets offset by speed.
        const simOffset = (newDate.getTime() - prevDate.getTime()) * (previousSpeed - 1) ;
        addTimeOffset( simOffset );
        //update previous speed to current speed.
        previousSpeed = speed;
    };

    //updates the db to save the current simulation time.
    const updateDB = (newSimContext) => {
        const newDate = newSimContext.newDate;
        console.log("Saved SimContext: ");
        console.log(newSimContext);
        //list of all SimContexts --> SimContext with matching houseId
        getSimContextList().then(data => {
            const simContext = data.find(item => item.house_id === localStorage.getItem("houseId"));
            patchSimContext(simContext.id, {
                lastDate: newDate.getTime()
            }).catch(err => toast.error(err.message));
        });
    };

    //loads the passed SimContext to the clock
    //recover saved time of simulation,
    // as well as saved speed of simulation.
    const loadSimContext = (sc) => {
        //sets offset.
        setOffsetFor(new Date(sc.lastDate));
    }

    //retrieves from the db the last used simulation context.
    const getLastSavedSimContext = () => {
        let retrievedSimContext;
        //list of all SimContexts --> SimContext with matching houseId
        return getSimContextList().then(data => {
            const simContext = data.find(item => item.house_id === localStorage.getItem("houseId"));
            //check if one is found,
            if(!simContext){
                //if there isn't any, create one.
                 createNewSimContext(retrievedSimContext = {
                    house_id : localStorage.getItem("houseId"),
                    lastDate : date.getTime()
                }).catch(err => {
                    toast.error(err.message);
                });
                console.log("Initialized SimContext: ");
                console.log(retrievedSimContext);
                //no offset.
            }
            else{
                //if there is one, retrieve it.
                retrievedSimContext = simContext;
                console.log("Retrieved SimContext: ");
                console.log(retrievedSimContext);
            }
            return retrievedSimContext;
        }).catch(err => {
            toast.error(err.message);
        });
    };

    //adds to the time offset (in milliseconds). Will work with negative integers, too.
    const addTimeOffset = (addOffset) => {
        setTimeOffset(timeOffsetRef.current + addOffset);
    };

    //get time offset of given target date.
    const getOffsetOf = (newDate) => {
        const currentTime = date.getTime();
        const newTime = newDate.getTime();
        const offset = newTime - currentTime;
        return offset; 
    };

    //set time offset for given target date.
    const setOffsetFor = (newDate) => {
        setTimeOffset(getOffsetOf(newDate));
    };

    //get datetime of simulator
    const getSimDate = () =>{
        return new Date(date.getTime() + timeOffset)
    };

    //output, render of the clock.
    return (
        <div>
            {/* display the time and speed */}
            <FormattedDisplay date={getSimDate()} speed = {speed} />
            {/* using https://material-ui-pickers.dev/demo/datetime-picker */}
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DateTimePicker
                    autoOk
                    ampm={false}
                    views={["year", "month", "date", "hours", "minutes", "seconds"]}
                    label="DateTimePicker"
                    inputVariant="outlined"
                    value={getSimDate()}
                    onChange={setOffsetFor}
                />
            </MuiPickersUtilsProvider>
            {/* Speed Controls */}
            <Button color={"secondary"} className={"uni_m_b_small"} variant={"contained"} onClick={() => {
                setupClockSpeedTimerPeriod(0);
                }}>Speed 0X (Pause)
            </Button>
            <Button color={"secondary"} className={"uni_m_b_small"} variant={"contained"} onClick={() => {
                setupClockSpeedTimerPeriod(1);
                }}>Speed 1x (Play)
            </Button>
            <Button color={"secondary"} className={"uni_m_b_small"} variant={"contained"} onClick={() => {
                setupClockSpeedTimerPeriod(2);
                }}>Speed 2x
            </Button>
            <Button color={"secondary"} className={"uni_m_b_small"} variant={"contained"} onClick={() => {
                setupClockSpeedTimerPeriod(10);
                }}>Speed 10x
            </Button>
            <Button color={"secondary"} className={"uni_m_b_small"} variant={"contained"} onClick={() => {
                setupClockSpeedTimerPeriod(0.5);
                }}>Speed 0.5x
            </Button>
        </div>
    );
};

//formats a date into readable time.
function FormattedDisplay(props){
    const classes = useStyle();
    return (
        <div className={classes.sidebarTime}>
            <Typography className={classes.sidebarTime}>
                The (simulated) time is {props.date?.toLocaleString()}.<br />
                The (simulated) speed is {props.speed}.
            </Typography>
        </div>
    );
};

export default Clock;