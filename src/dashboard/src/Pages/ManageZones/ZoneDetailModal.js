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

const ZoneDetail = ({open, onClose, zone, updateZone}) => {

  const [rooms, setRooms] = useState([]);
  const [timeInDay, setTimeInDay] = useState("day");

  useEffect(() => {
    getRoomList(localStorage.getItem("houseId")).then(data => {
      setRooms(data);
    }).catch(err => toast.error(err.message))
  }, []);

  const changeRoomZone = (key, value) => {
    let newZoom;
    //inlcude room
    if (value)
      newZoom = {
        ...zone,
        rooms: [
          ...zone.rooms,
          key
        ]
      };
    //exclude room
    else {
      const foundRoom = zone.rooms.indexOf(key);
      if (foundRoom != -1)
        newZoom = {
          ...zone,
          rooms: [
            ...zone.rooms.slice(0, foundRoom),
            ...zone.rooms.slice(foundRoom + 1)
          ]
        }
    }
    updateZone(zone.id, newZoom);
    // patchAgent(zone.id, agent).then(res => {
    //   updateZone(zone.id, agent);
    // }).catch(err => toast.error(err.message))
  };

  const handleChangeTab = (e, newValue) => {
    setTimeInDay(newValue);
  };
  const onChangeDeg = (deg, value) => {
    let newZone = {
      ...zone,
      [deg]: {
        ...zone[deg],
        [timeInDay]: parseInt(value)
      }
    };
    updateZone(zone.id,newZone);
  };

  const TabPanel = () => {
    return <div className={classes.minMaxInput}>
      <TextField onChange={(e) => onChangeDeg("minDeg", e.target.value)} value={zone.minDeg[timeInDay]}
                 id="outlined-basic" label="Min Degree" variant="outlined"/>
      <TextField onChange={(e) => onChangeDeg("maxDeg", e.target.value)} value={zone.maxDeg[timeInDay]}
                 id="outlined-basic" label="Max Degree" variant="outlined"/>
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
          {rooms.map(item => <FormControlLabel
            value="start"
            control={<Switch color="primary" checked={zone.rooms?.includes(item.id)}
                             onChange={(e, newValue) => changeRoomZone(item.id, newValue)}/>}
            label={item.name}
            labelPlacement={item.name}
          />)}
        </ul>
        <Tabs className={classes.tabs} onChange={handleChangeTab} value={timeInDay}>
          <Tab className={classNames(classes.tab, timeInDay === "morning" && classes.tabActive)} value={"morning"}
               label={"Early Morning"}/>
          <Tab className={classNames(classes.tab, timeInDay === "day" && classes.tabActive)} value={"day"}
               label={"Day"}/>
          <Tab className={classNames(classes.tab, timeInDay === "night" && classes.tabActive)} value={"night"}
               label={"night"}/>
        </Tabs>
        <TabPanel/>
      </div>
    </Modal>
  );
};

export default ZoneDetail;