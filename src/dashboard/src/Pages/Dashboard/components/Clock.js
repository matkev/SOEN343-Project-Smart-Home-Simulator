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
const Clock = (props) => {
    //date to track real-time.
    const [date, setDate] = useState(new Date());
    //time offset in milliseconds.
    const [timeOffset, setTimeOffset] = useState(0);
    //speed of simulation
    const [speed, setSpeed] = useState(1);
    //period interval (milliseconds) to update clock display
    const [period, setPeriod] = useState(1000);

    //reference to date for usage in callback.
    const dateRef = useRef();

    const newSimContextRef = useRef({newDate: date, newSpeed: speed});
    //track values to pass to database while in callback.
    useEffect(() => {
        newSimContextRef.current.newDate = getSimDate();
        newSimContextRef.current.newSpeed = speed;
    }, [date, timeOffset, speed]);   //updates on date, timeOffset or speed change.

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
    

    //Initialization and Cleanup.
    useEffect(() => {
        //executes when the DOM renders the Clock the first time. 
        //If passed a simContext, use it.
        //Otherwise, recover saved simContext from database.
        const simContext = props.simContext ?? getLastSavedSimContext();
        //load the simContext data into clock.
        loadSimContext(simContext);

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
        const newSpeed = newSimContext.newSpeed;
        console.log("Saved SimContext: ");
        console.log(newSimContext);
        //list of all SimContexts --> SimContext with matching houseId
        getSimContextList().then(data => {
            const simContext = data.find(item => item.house_id === localStorage.getItem("houseId"));
            patchSimContext(simContext.id, {
                lastDate: newDate.getTime(),
                lastSpeed: newSpeed
            }).catch(err => toast.error(err.message));
        });
    };

    //loads the passed SimContext to the clock
    //recover saved time of simulation,
    // as well as saved speed of simulation.
    const loadSimContext = (sc) => {
        //sets offset.
        setOffsetFor(new Date(sc.lastDate));
        //sets clock speed and timer period.
        setupClockSpeedTimerPeriod(sc.lastSpeed);
    }

    //retrieves from the db the last used simulation context.
    const getLastSavedSimContext = async () =>  {
        let retrievedSimContext;
        //list of all SimContexts --> SimContext with matching houseId
        getSimContextList().then(data => {
            const simContext = data.find(item => item.house_id === localStorage.getItem("houseId"));
            //check if one is found,
            if(!simContext){
                //if there isn't any, create one.
                createNewSimContext(retrievedSimContext = {
                    house_id : localStorage.getItem("houseId"),
                    lastDate : date.getTime(),
                    lastSpeed: speed
                }).catch(err => {
                    toast.error(err.message);
                });
                console.log("Initialized SimContext: ");
                console.log(retrievedSimContext);

                //no offset.
            }
            else{
                //if there is one, use it.
                loadSimContext(simContext);
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
            {/* display the time */}
            <FormattedTime date={getSimDate()} />
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
                setupClockSpeedTimerPeriod(2);
                }}>Speed 2x
            </Button>
            <Button color={"secondary"} className={"uni_m_b_small"} variant={"contained"} onClick={() => {
                setupClockSpeedTimerPeriod(1);
                }}>Speed 1x
            </Button>
            <Button color={"secondary"} className={"uni_m_b_small"} variant={"contained"} onClick={() => {
                setupClockSpeedTimerPeriod(10);
                }}>Speed 10x
            </Button>
            <Button color={"secondary"} className={"uni_m_b_small"} variant={"contained"} onClick={() => {
                setupClockSpeedTimerPeriod(0);
                }}>Speed 0x
            </Button>
            <Button color={"secondary"} className={"uni_m_b_small"} variant={"contained"} onClick={() => {
                setupClockSpeedTimerPeriod(0.5);
                }}>Speed 0.5x
            </Button>
            <InputSlider value = {speed} onValueChange = {(v)=> setupClockSpeedTimerPeriod(v)} />
        </div>
    );
};

//formats a date into readable time.
function FormattedTime(props){
    const classes = useStyle();
    return (
        <div className={classes.sidebarTime}>
            <Typography className={classes.sidebarTime}>
                The (simulated) time is {props.date.toLocaleString()}.
            </Typography>
        </div>
    );
};

//Speed controller with slider + input.
function InputSlider(props) {
    const classes = useStyle();
    const [value, setValue] = useState(props.value);
  
    useEffect(() => {
        setValue(props.value);
    }, [props.value]); //runs when props.value updates.

    useEffect(() => {
        props.onValueChange(value);
    }, [value]); //runs when value updates.

    const marks = [
        {
          value: 1,
        }
      ];

    //onChange of slider
    const handleSliderChange = (event, newValue) => {
      setValue(newValue);
    };
  
    //onChange of input
    const handleInputChange = (event) => {
      setValue(event.target.value === '' ? '' : Number(event.target.value));
    };

    //limit input
    const handleBlur = () => {
      if (value < 0) {
        setValue(0);
      } else if (value > 10) {
        setValue(10);
      }
    };
  
    //render
    return (
      <div className={classes.root}>
            <Slider
              value={typeof value === 'number' ? value : 0}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
              step={0.1}
              marks = {marks}
              min={0}
              max={10}
              valueLabelDisplay="auto"
            />
            <Input
              className={classes.input}
              value={value}
              margin="dense"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step: 1,
                min: 0,
                max: 10,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            />
      </div>
    );
}
export default Clock;