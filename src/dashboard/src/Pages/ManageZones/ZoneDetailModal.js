import React, {useEffect, useState} from 'react';
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import useStyle from './styles'
import Backdrop from "@material-ui/core/Backdrop";
import {toast} from "react-toastify";
import {getRoomList} from "../../Api/api_rooms";
import TextField from "@material-ui/core/TextField";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import classNames from "classnames";
import TimeSelect from "../Dashboard/sidebar/TimeSelect";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const ZoneDetail = ({open, onClose, zone, updateZone}) => {

  const [rooms, setRooms] = useState([]);
  const [timeInDay, setTimeInDay] = useState(0);

  useEffect(() => {
    getRoomList(localStorage.getItem("houseId")).then(data => {
      setRooms(data);
    }).catch(err => toast.error(err.message))
  }, []);

  const changeRoomZone = (key, value) => {
    let newZone;
    //inlcude room
    if (value)
      newZone = {
        ...zone,
        rooms: [
          ...zone.rooms??[],
          key
        ]
      };
    //exclude room
    else {
      const foundRoom = zone.rooms.indexOf(key);
      if (foundRoom != -1)
        newZone = {
          ...zone,
          rooms: [
            ...zone.rooms.slice(0, foundRoom),
            ...zone.rooms.slice(foundRoom + 1)
          ]
        }
    }
    updateZone(zone.id, newZone);
    // patchAgent(zone.id, agent).then(res => {
    //   updateZone(zone.id, agent);
    // }).catch(err => toast.error(err.message))
  };

  const handleChangeTab = (e, newValue) => {
    setTimeInDay(newValue);
  };

  const validateTempInput = (inputValue)=>{
    const maxValue = 50;
    const minValue = -50;
    let outputValue = +inputValue;
    if (inputValue < minValue) {
      outputValue = +minValue;
    } else if (inputValue > maxValue) {
      outputValue = +maxValue;
    }
    outputValue = parseFloat(outputValue.toFixed(2));
    return outputValue;
  };

  const onChangeDeg = (dayPeriod, value) => {
    let newZone = {
      ...zone,
      periods: [
        ...zone.periods.slice(0, dayPeriod),
        {...zone.periods[dayPeriod], temperatureSetting: value},
        ...zone.periods.slice(dayPeriod + 1)
      ],
    };
    updateZone(zone.id, newZone);
  };

  const onChangeStartTime = (dayPeriod, date)=>{
    const oldDate = new Date(zone.periods[dayPeriod].startTime);
    //change if time is different.
    if (oldDate.getHours() != date.getHours()
    || oldDate.getMinutes() != date.getMinutes()
    || oldDate.getSeconds() != date.getSeconds()
    ){
      let newZone = {
        ...zone,
        periods: [
          ...zone.periods.slice(0, dayPeriod),
          {...zone.periods[dayPeriod], startTime: date.getTime()},
          ...zone.periods.slice(dayPeriod + 1)
        ],
      };
      updateZone(zone.id, newZone);
    }
};

  const TabPanel = () => {
    return <div className={classes.minMaxInput}>
        <TextField
          onChange={(e) => onChangeDeg(timeInDay, validateTempInput(e.target.value))} 
          value={zone.periods[timeInDay].temperatureSetting}
          id="outlined-basic" 
          label={"Period #"+(timeInDay+1)} 
          variant="outlined"
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <TimeSelect
            value={new Date(zone?.periods[timeInDay].startTime)}
            onChange={(date)=>onChangeStartTime(timeInDay, date)}
          />
        </MuiPickersUtilsProvider>
    </div>
  };

  const classes = useStyle();
  return (
    <Modal open={open} onClose={onClose}
           aria-labelledby="transition-modal-title"
           aria-describedby="transition-modal-description"
           className={classes.modal}
           closeAfterTransition
           BackdropComponent={Backdrop}
           BackdropProps={{
             timeout: 500,
           }}>
      <div className={classes.paper}>
        <Typography className={classes.title}>
          Zone Detail
        </Typography>
        <Typography className={classes.property}>Name : {zone.name}</Typography>
        <Typography className={classes.property}>Includes Rooms : </Typography>
        <ul className={classes.roomList}>
          {rooms.map(item => 
            <FormControlLabel
              key={item.id}
              value="start"
              control={
                <Switch 
                  color="primary" 
                  checked={zone.rooms?.includes(item.id)??false}
                  onChange={(e, newValue) => changeRoomZone(item.id, newValue)}
                />
              }
              label={item.name}
            />
          )}
        </ul>
        <Tabs 
          className={classes.tabs} 
          onChange={handleChangeTab} 
          value={timeInDay}>
          {
            [0,1,2].map((el, index) =>
              `Period #${index}`
            ).map((dayPeriod, index)=>
              <Tab 
                key={dayPeriod}
                className={classNames(classes.tab, timeInDay === index && classes.tabActive)} 
                value={index}
                label={dayPeriod}
              />
            )
          }
        </Tabs>
        <TabPanel/>
      </div>
    </Modal>
  );
};

export default ZoneDetail;