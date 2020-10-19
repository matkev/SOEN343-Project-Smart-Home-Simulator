import React from 'react';
import useStyle from '../styles'
import Typography from "@material-ui/core/Typography";

//code is based on example provided in
//https://reactjs.org/docs/state-and-lifecycle.html

//Clock will give the current time of the simulation.
class Clock extends React.Component{

    //time offset in milliseconds.
    //timeOffset = 0;
    timeOffset = 2*60000+25*1000;   //placeholder, demonstration that there is an offset (here is by 2 min 25 sec).

    constructor(props){
        super(props);
        this.state = {
            //TODO: revise to have date initialized to previous value (probably update last time seen into database, and read from there..?)
            //time to keep track of what time it is. Defaults to current time for now.
            date: new Date()
        };
    }

    //executes when the DOM renders the Clock the first time. 
    componentDidMount(){
        //set interval to tick() every second (1000 ms).
        this.intervalID = setInterval(() => this.tick(), 1000);
    }

    //executes when the DOM removes the Clock.
    componentWillUnmount(){
        //tear down interval/timer
        clearInterval(this.intervalID);
    }

    //update time when called.
    tick(){
        //set state to re-render.
        this.setState({
            date : new Date()
        });
    }

    //TODO: call this method from outside somehow??
    //set time offset (in milliseconds). Negative and positive numbers allowed.
    setOffset(offset){
        this.timeOffset = offset;
    }

    //output, render of the clock.
    render(){
        return <FormattedDate date={new Date(this.state.date.getTime() + this.timeOffset)} />;
    }
}


//TODO: verify the tags are in the proper format (I tried basing it off Preview.js >_<)
//formats a date into readable time.
function FormattedDate(props){
    const classes = useStyle();
    return (
        <div className={classes.sidebarTime}>
            <Typography className={classes.sidebarTime}>
                The time is {props.date.toLocaleTimeString()}.
            </Typography>
        </div>
    );
}

export default Clock;