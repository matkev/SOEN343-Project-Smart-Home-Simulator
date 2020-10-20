import React, {useEffect, useState} from 'react';
import useStyle from '../styles'
import Typography from "@material-ui/core/Typography";
import PageTitle from "../../../Components/PageTitle/PageTitle";
import { MuiPickersUtilsProvider,  DateTimePicker} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
//code is based on example provided in
//https://reactjs.org/docs/state-and-lifecycle.html

//and uses
//https://material-ui-pickers.dev/demo/datetime-picker

//Clock will give the current time of the simulation.
const Clock = (props) => {
    //date to track real-time.
    const [date, setDate] = useState(new Date());
    //time offset in milliseconds.
    const [timeOffset, setTimeOffset] = useState(0);
    
    //tick update's interval
    let intervalID = null;
    
    useEffect(() => {
        //executes when the DOM renders the Clock the first time. 
        //set interval to tick() every second (1000 ms).
        intervalID = setInterval(tick, 1000);
        
        //executes when the DOM removes the Clock.
        return ()=> {
            //tear down interval/timer
            clearInterval(intervalID);
        }
    }, []); //only run on mount and unmount.

    //update time when called.
    const tick = () => {
        //update date.
        setDate(new Date());
    }

    //adds to the time offset (in milliseconds). Will work with negative integers, too.
    const addTimeOffset = (addOffset) => {
        setTimeOffset(timeOffset + addOffset);
    }

    //get time offset of given target date.
    const getOffsetOf = (newDate) => {
        const currentTime = date.getTime();
        const newTime = newDate.getTime();
        const offset = newTime - currentTime;
        return offset; 
    }
    //set time offset for given target date.
    const setOffsetFor = (newDate) => {
        setTimeOffset(getOffsetOf(newDate));
    }

    //get datetime of simulator
    const getSimDate = () =>{
        return new Date(date.getTime() + timeOffset)
    }

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
            {/* TODO: make the board look better. */}
            <table>
                <tr>
                    <td>
                        <PageTitle title={""} button={"+1hr"    } onClickButton={() => addTimeOffset(+1*60*60000  )}/>
                    </td>
                    <td>
                        <PageTitle title={""} button={"-1hr"    } onClickButton={() => addTimeOffset(-1*60*60000  )}/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <PageTitle title={""} button={"+1min"   } onClickButton={() => addTimeOffset(+1*60000     )}/>
                    </td>
                    <td>
                        <PageTitle title={""} button={"-1min"   } onClickButton={() => addTimeOffset(-1*60000     )}/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <PageTitle title={""} button={"+5s"     } onClickButton={() => addTimeOffset(+5*1000      )}/>
                    </td>
                    <td>
                        <PageTitle title={""} button={"-5s"     } onClickButton={() => addTimeOffset(-5*1000      )}/>
                    </td>
                </tr>
            </table>
        </div>
    );
}

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
}

export default Clock;