import React, {useEffect, useState, useRef} from 'react';
import useStyle from '../styles'
import Typography from "@material-ui/core/Typography";
import PageTitle from "../../../Components/PageTitle/PageTitle";
import { MuiPickersUtilsProvider,  DateTimePicker} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {patchSimContext} from "../../../Api/api_simContexts";
import {toast} from "react-toastify";
//code is based on example provided in
//https://reactjs.org/docs/state-and-lifecycle.html

//and uses
//https://material-ui-pickers.dev/demo/datetime-picker

//Clock will give the current time of the simulation.
const Clock = (props) => {
    //date to track real-time.
    const [date, setDate] = useState(new Date());
    //time offset in milliseconds.
    const [timeOffset, setTimeOffset] = useState(props ? props.date - new Date() : 0);
    //reference to some values for usage in callback.
    const valueRef = useRef();

    //tick update's interval
    let intervalID = null;

    //track value of simDate while in callback.
    useEffect(() => {
        valueRef.current = getSimDate();
      }, [date, timeOffset]);   //updates on date or timeOffset change.
      
    useEffect(() => {
        //executes when the DOM renders the Clock the first time. 
        //set interval to tick() every second (1000 ms).
        intervalID = setInterval(tick, 1000);
        
        //executes when the DOM removes the Clock.
        return function cleanup(){
            //tear down interval/timer
            clearInterval(intervalID);
            updateDB(valueRef.current);
        }
    }, []); //only run on mount and unmount.

    //update time when called.
    const tick = () => {
        //update date.
        setDate(new Date());
    };

    const updateDB = (newDate) => {
        console.log("Saved time: " + newDate.toLocaleString);
        //TODO: get the corresponding SimContext to the house instead of a static one.
        patchSimContext("5f90d0bc855ed95559d31ba8", {
            lastDate: newDate.getTime()
          }).catch(err => toast.error(err.message));
    };

    //adds to the time offset (in milliseconds). Will work with negative integers, too.
    const addTimeOffset = (addOffset) => {
        setTimeOffset(timeOffset + addOffset);
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
        </div>
    );
};

//TODO: verify the tags are in the proper format (I tried basing it off Preview.js >_<)
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

export default Clock;