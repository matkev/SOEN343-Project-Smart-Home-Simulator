import React, {useRef, useEffect, useState} from 'react';
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
  const [hasInitZoneRooms, setHasInitZoneRooms] = useState(false);

  const [s, ss]=useState(0);
  const zoneRef = useRef({});
  const roomsRef = useRef({});
  const [prevZoneId, setPrevZoneId] = useState();

  useEffect(()=>{
    zoneRef.current = zone;
    ss(s+1);
  }, [JSON.stringify(zone)]);
  useEffect(()=>{
    roomsRef.current = rooms;
    ss(s+1);
  }, [JSON.stringify(rooms)]);

  useEffect(() => {
    getRoomList(localStorage.getItem("houseId")).then(data => {
      setRooms(data);
    }).catch(err => toast.error(err.message))
  }, []);

  useEffect(()=>{
    if((!hasInitZoneRooms && rooms !== undefined && rooms.length>0 && open ) 
    || zone.id !== prevZoneId 
    ){
      initZone();
      setHasInitZoneRooms(true);
    }
    setPrevZoneId(zone.id);
  }, [zone.id, hasInitZoneRooms]);

  const initZone=()=>{
      const roomsOfZone = (rooms.filter((room)=>room.zone_id===zoneRef.current.id)).map((room)=> room.id);
      const newZone = {...zone, rooms: [...roomsOfZone]}
      updateZone(zoneRef.current.id, newZone); 

    if (zoneRef.current.rooms === undefined){
      setTimeout(initZone,0);
    }
  };

  const changeRoomZone = (key, value) => {
    let newZone = {...zoneRef.current};
    const tempRooms = [...rooms];
    const foundRoomOfRooms = rooms.findIndex((room)=>room.id === key);
    //inlcude room
    if (value){
      newZone = {
        ...zoneRef.current,
        rooms: [
          ...zoneRef.current.rooms??[],
          key
        ]
      };
      tempRooms[foundRoomOfRooms].zone_id = zoneRef.current.id;
      setRooms([...tempRooms]);
    }
    //exclude room
    else {
      const foundRoom = zoneRef.current.rooms.indexOf(key);
      if (foundRoom !== -1){
        newZone = {
          ...zoneRef.current,
          rooms: [
            ...zoneRef.current.rooms.slice(0, foundRoom),
            ...zoneRef.current.rooms.slice(foundRoom + 1)
          ]
        };
      tempRooms[foundRoomOfRooms].zone_id = "";
      setRooms([...tempRooms]);
      }
    }
    updateZone(zoneRef.current.id, newZone);
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
    if (oldDate.getHours() !== date.getHours()
    || oldDate.getMinutes() !== date.getMinutes()
    || oldDate.getSeconds() !== date.getSeconds()
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
        <Typography className={classes.property}>Name : {zoneRef.current.name}</Typography>
        <Typography className={classes.property}>Includes Rooms : </Typography>
        <ul className={classes.roomList}>
          {zoneRef.current.rooms!== undefined 
            ? (roomsRef.current.map(item => {
                return (<FormControlLabel
                  key={item.id}
                  value="start"
                  control={
                    <Switch 
                      color="primary" 
                      checked={item.zone_id === zoneRef.current.id}
                      onChange={(e, newValue) => changeRoomZone(item.id, newValue)}
                    />
                  }
                  label={item.name}
                />)
                }))
            : ""
          }
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