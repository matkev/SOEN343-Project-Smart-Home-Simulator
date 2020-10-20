import React from 'react';
import useStyle from '../styles'
import Typography from "@material-ui/core/Typography";
import PageTitle from "../../../Components/PageTitle/PageTitle";

//code is based on example provided in
//https://reactjs.org/docs/state-and-lifecycle.html

//Clock will give the current time of the simulation.
class Clock extends React.Component{

    //time offset in milliseconds.
    timeOffset = 0;

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

    //set time offset (in milliseconds). Negative and positive numbers allowed.
    setOffset(offset){
        this.timeOffset = offset;
        
        //re-render.
        this.setState({});
    }

    //output, render of the clock.
    render(){
        return (
            <div>
                {/* display the time */}
                <FormattedTime date={new Date(this.state.date.getTime() + this.timeOffset)} />
                {/* TODO: make the way to change time better. (I stole the buttons from ManageUsers.js)*/}
                <PageTitle title={""} button={"+1hr"    } onClickButton={()=>this.setOffset(this.timeOffset-1*60*60000) }/>
                <PageTitle title={""} button={"+1min"   } onClickButton={()=>this.setOffset(this.timeOffset-1*60000)    }/>
                <PageTitle title={""} button={"+5s"     } onClickButton={()=>this.setOffset(this.timeOffset-5*1000)     }/>
                <PageTitle title={""} button={"-1hr"    } onClickButton={()=>this.setOffset(this.timeOffset-1*60*60000) }/>
                <PageTitle title={""} button={"-1min"   } onClickButton={()=>this.setOffset(this.timeOffset-1*60000)    }/>
                <PageTitle title={""} button={"-5s"     } onClickButton={()=>this.setOffset(this.timeOffset-5*1000)     }/>
            </div>
        );
    }
}

//TODO: verify the tags are in the proper format (I tried basing it off Preview.js >_<)
//formats a date into readable time.
function FormattedTime(props){
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